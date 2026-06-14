"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const activateFreePlan = actionClient.action(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error("Não autorizado");
	}

	// Atualiza o plano do usuário diretamente no banco para 'free'
	// e garante que ele não fique com IDs de assinatura do Stripe antigos caso esteja mudando de plano
	await db
		.update(usersTable)
		.set({
			plan: "free",
			stripeSubscriptionId: null,
			updatedAt: new Date(),
		})
		.where(eq(usersTable.id, session.user.id));

	// Revalida os caminhos para atualizar o estado na tela do usuário
	revalidatePath("/subscription");
	revalidatePath("/dashboard");

	return { success: true };
});
