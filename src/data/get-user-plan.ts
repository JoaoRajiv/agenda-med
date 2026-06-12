import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getUserPlan = async () => {
	// 1. Verifica quem é o usuário logado de forma segura no servidor
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user?.id) {
		return "free"; // Se não estiver logado, assume o plano mais básico
	}

	// 2. Busca apenas a coluna necessária para economizar memória
	const user = await db.query.usersTable.findFirst({
		where: eq(usersTable.id, session.user.id),
		columns: {
			plan: true,
			// stripeSubscriptionId: true <-- Descomente apenas se for usar o Portal do Stripe
		},
	});

	return user?.plan || "free";
};
