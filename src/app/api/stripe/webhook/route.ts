/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
	if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
		throw new Error("Stripe secret key not found");
	}
	const signature = request.headers.get("stripe-signature");
	if (!signature) {
		throw new Error("Stripe signature not found");
	}
	const text = await request.text();
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
		apiVersion: "2025-05-28.basil",
	});

	let event: Stripe.Event;
	// 1. TRY/CATCH OBRIGATÓRIO: Impede que o Stripe faça retentativas infinitas em caso de falha de assinatura
	try {
		event = stripe.webhooks.constructEvent(
			text,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (error: any) {
		console.error(`⚠️ Webhook signature verification failed.`, error.message);
		return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
	}

	try {
		switch (event.type) {
			case "invoice.paid": {
				const invoice = event.data.object as Stripe.Invoice & {
					subscription?: string | Stripe.Subscription | null;
					parent?: {
						type: string;
						subscription_details?: {
							subscription: string;
							metadata?: Record<string, string>;
						};
					} | null;
				};

				let subscriptionId: string | undefined;

				if (typeof invoice.subscription === "string") {
					subscriptionId = invoice.subscription;
				} else if (invoice.subscription?.id) {
					subscriptionId = invoice.subscription.id;
				} else if (invoice.parent?.subscription_details?.subscription) {
					subscriptionId = invoice.parent.subscription_details.subscription;
				}

				if (!subscriptionId) {
					console.log("Fatura sem assinatura atrelada. Ignorando.");
					break;
				}

				const customerId =
					typeof invoice.customer === "string"
						? invoice.customer
						: invoice.customer?.id;

				if (!customerId) {
					console.error("Customer ID missing on invoice.");
					break;
				}

				const subscription =
					await stripe.subscriptions.retrieve(subscriptionId);
				const userId = subscription.metadata.userId;

				if (!userId) {
					console.error("User ID not found in subscription metadata");
					break;
				}

				await db
					.update(usersTable)
					.set({
						stripeSubscriptionId: subscriptionId,
						stripeCustomerId: customerId, // Garante que o cliente seja salvo
						plan: "essential",
					})
					.where(eq(usersTable.id, userId));

				console.log(`✅ Assinatura ativada para o usuário: ${userId}`);
				break;
			}

			case "customer.subscription.deleted": {
				// 2. OTIMIZAÇÃO: O objeto do evento JÁ É a assinatura. Economizamos um fetch!
				const subscription = event?.data.object as Stripe.Subscription;

				if (!subscription.id) {
					console.error("Subscription ID not found in event");
					break;
				}

				const userId = subscription.metadata.userId;

				if (!userId) {
					console.error("User ID not found in deleted subscription metadata");
					break;
				}

				await db
					.update(usersTable)
					.set({
						stripeSubscriptionId: null,
						// 3. CORREÇÃO LÓGICA: Não passamos stripeCustomerId: null
						// O usuário continua sendo um cliente Stripe, só não tem mais assinatura ativa.
						plan: "free",
					})
					.where(eq(usersTable.id, userId));

				console.log(
					`❌ Assinatura cancelada/encerrada para o usuário: ${userId}`,
				);
				break;
			}
		}
	} catch (error: any) {
		// Captura erros do banco de dados (Drizzle) para não quebrar silenciosamente
		console.error("❌ Erro interno ao processar webhook:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}

	// Sempre retorne 200 pro Stripe saber que você processou a mensagem
	return NextResponse.json({ received: true });
};
