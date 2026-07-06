"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const deleteAppointment = actionClient
	.schema(
		z.object({
			id: z.string().uuid(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.clinic?.id) {
			throw new Error("Unauthorized");
		}
		const [deleted] = await db
			.delete(appointmentsTable)
			.where(
				and(
					eq(appointmentsTable.id, parsedInput.id),
					eq(appointmentsTable.clinicId, session.user.clinic.id),
				),
			)
			.returning({ id: appointmentsTable.id });
		if (!deleted) {
			throw new Error("Agendamento não encontrado");
		}
		revalidatePath("/appointments");
	});
