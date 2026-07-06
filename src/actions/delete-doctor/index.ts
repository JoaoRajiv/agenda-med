"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const deleteDoctor = actionClient
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
			.delete(doctorsTable)
			.where(
				and(
					eq(doctorsTable.id, parsedInput.id),
					eq(doctorsTable.clinicId, session.user.clinic.id),
				),
			)
			.returning({ id: doctorsTable.id });
		if (!deleted) {
			throw new Error("Doctor not found");
		}
		revalidatePath("/doctors");
		revalidatePath("/dashboard");
	});
