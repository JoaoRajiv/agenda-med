"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertPatientSchema } from "./schema";

export const upsertPatient = actionClient
	.schema(upsertPatientSchema)
	.action(async ({ parsedInput }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		const clinicId = session?.user?.clinic?.id;

		if (!clinicId) {
			throw new Error("Usuário não está associado a nenhuma clínica.");
		}

		if (parsedInput.id) {
			await db
				.update(patientsTable)
				.set({
					...parsedInput,
					updatedAt: new Date(),
				})
				.where(eq(patientsTable.id, parsedInput.id));

			revalidatePath("/patients");

			return {
				message: "Paciente atualizado com sucesso.",
			};
		}

		await db.insert(patientsTable).values({
			...parsedInput,
			clinicId,
		});

		revalidatePath("/patients");
		revalidatePath("/dashboard");

		return {
			message: "Paciente criado com sucesso.",
		};
	});
