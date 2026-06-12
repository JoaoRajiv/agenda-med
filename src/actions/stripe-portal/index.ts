"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
// Importe o seu cliente do next-safe-action (ajuste o caminho se necessário)
import { actionClient } from "@/lib/next-safe-action";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
	throw new Error("Stripe secret key not found");
}

const stripe = new Stripe(key, {
	apiVersion: "2025-05-28.basil",
});

// Definindo a ação de forma segura
export const openCustomerPortalAction = actionClient.action(async () => {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user?.id) {
		throw new Error("Não autorizado");
	}

	const user = await db.query.usersTable.findFirst({
		where: eq(usersTable.id, session.user.id),
		columns: { stripeCustomerId: true },
	});

	if (!user?.stripeCustomerId) {
		throw new Error("Usuário não possui um cliente Stripe atrelado.");
	}

	const portalSession = await stripe.billingPortal.sessions.create({
		customer: user.stripeCustomerId,
		return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
	});

	// Retornamos a URL para o frontend executar o redirecionamento
	return { url: portalSession.url };
});
