"use server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { appointmentsTable, doctorsTable } from "@/db/schema";
import { generateTimeSlots } from "@/helpers/time";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getAvailableTimes = actionClient
	.schema(
		z.object({
			doctorId: z.string(),
			date: z.string().date(),
		}),
	)
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

		const doctor = await db.query.doctorsTable.findFirst({
			where: eq(doctorsTable.id, parsedInput.doctorId),
		});
		if (!doctor) {
			throw new Error("Doctor not found");
		}

		// Verificar se o médico tem disponibilidade para o dia selecionado
		const selectedDayOfWeek = dayjs(parsedInput.date).day();
		const doctorAvailability =
			selectedDayOfWeek >= doctor.availableFromWeekday &&
			selectedDayOfWeek <= doctor.availableToWeekday;
		if (!doctorAvailability) {
			return [];
		}
		const appointments = await db.query.appointmentsTable.findMany({
			where: eq(appointmentsTable.doctorId, parsedInput.doctorId),
		});
		const appointmentOnSelectedDate = appointments
			.filter((appointment) => {
				return dayjs(appointment.date).isSame(parsedInput.date, "day");
			})
			.map((appointment) => dayjs(appointment.date).format("HH:mm:ss"));
		const timeSlots = generateTimeSlots();
		const doctorAvailableFrom = dayjs()
			.utc()
			.set("hour", Number(doctor.availableFromTime.split(":")[0]))
			.set("minute", Number(doctor.availableFromTime.split(":")[1]))
			.set("second", 0)
			.local();
		const doctorAvailableTo = dayjs()
			.utc()
			.set("hour", Number(doctor.availableToTime.split(":")[0]))
			.set("minute", Number(doctor.availableToTime.split(":")[1]))
			.set("second", 0)
			.local();

		const doctorTimeSlots = timeSlots.filter((timeSlot) =>
			// timeSlot = "08:00:00"
			{
				const timeSlotTime = dayjs()
					.utc()
					.set("hour", Number(timeSlot.split(":")[0]))
					.set("minute", Number(timeSlot.split(":")[1]))
					.set("second", 0);
				return (
					timeSlotTime.format("HH:mm:ss") >=
						doctorAvailableFrom.format("HH:mm:ss") &&
					timeSlotTime.format("HH:mm:ss") <=
						doctorAvailableTo.format("HH:mm:ss")
				);
			},
		);
		return doctorTimeSlots.map((timeSlot) => {
			return {
				value: timeSlot,
				available: !appointmentOnSelectedDate.includes(timeSlot),
				label: timeSlot.substring(0, 5), // "08:00"
			};
		});
	});
