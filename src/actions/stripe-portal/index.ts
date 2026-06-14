"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const openCustomerPortalAction = actionClient.action(async () => {
	// 1. Movemos a validação para DENTRO da execução da action
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) {
		throw new Error("Stripe secret key not found");
	}

	// 2. Inicializamos o Stripe apenas quando a action for chamada
	const stripe = new Stripe(key, {
		apiVersion: "2025-05-28.basil",
	});

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

	return { url: portalSession.url };
});
