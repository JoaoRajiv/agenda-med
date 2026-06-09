"use server";

import { eq } from "drizzle-orm";
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
		if (!session?.user) {
			throw new Error("Unauthorized");
		}

		const [patient] = await db
			.select()
			.from(patientsTable)
			.where(eq(patientsTable.id, parsedInput.id));

		if (!patient || patient.clinicId !== session.user.clinic?.id) {
			throw new Error(
				"Paciente não encontrado ou não pertence a esta clínica.",
			);
		}

		await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id));

		revalidatePath("/patients");
		revalidatePath("/dashboard");

		return {
			message: "Paciente excluído com sucesso.",
		};
	});
