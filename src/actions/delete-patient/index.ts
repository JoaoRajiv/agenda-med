"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const deletePatient = actionClient
	.schema(z.object({ id: z.string().uuid() }))
	.action(async ({ parsedInput }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.clinic?.id) {
			throw new Error("Unauthorized");
		}

		const [deleted] = await db
			.delete(patientsTable)
			.where(
				and(
					eq(patientsTable.id, parsedInput.id),
					eq(patientsTable.clinicId, session.user.clinic.id),
				),
			)
			.returning({ id: patientsTable.id });
		if (!deleted) {
			throw new Error("Paciente não encontrado");
		}

		revalidatePath("/patients");
		revalidatePath("/dashboard");

		return {
			message: "Paciente excluído com sucesso.",
		};
	});
