"use server";

import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { checkPlanLimit } from "@/data/check-plan-limits";
import { db } from "@/db";
import { appointmentsTable, doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { createAppointmentSchema } from "./schema";

export const createAppointment = actionClient
	.schema(createAppointmentSchema)
	.action(async ({ parsedInput }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user) {
			throw new Error("Unauthorized");
		}
		if (!session?.user.clinic?.id) {
			throw new Error("Clinic not found");
		}

		const { allowed } = await checkPlanLimit(
			session.user.clinic.id,
			"appointments",
		);
		if (!allowed) {
			throw new Error("FREE_LIMIT_REACHED:appointments");
		}

		const doctor = await db.query.doctorsTable.findFirst({
			where: eq(doctorsTable.id, parsedInput.doctorId),
		});
		if (!doctor) {
			throw new Error("Doctor not found");
		}

		const appointmentDateTime = dayjs(parsedInput.date)
			.set("hour", Number(parsedInput.time.split(":")[0]))
			.set("minute", Number(parsedInput.time.split(":")[1]))
			.toDate();

		const [existing] = await db
			.select({ id: appointmentsTable.id })
			.from(appointmentsTable)
			.where(
				and(
					eq(appointmentsTable.doctorId, parsedInput.doctorId),
					eq(appointmentsTable.date, appointmentDateTime),
				),
			)
			.limit(1);

		if (existing) {
			throw new Error("Time not available");
		}

		await db.insert(appointmentsTable).values({
			...parsedInput,
			clinicId: session.user.clinic.id,
			date: appointmentDateTime,
		});

		revalidatePath("/appointments");
		revalidatePath("/dashboard");
	});
