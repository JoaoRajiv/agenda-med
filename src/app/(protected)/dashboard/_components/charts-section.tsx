import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable, doctorsTable } from "@/db/schema";

import AppointmentsChart from "./appointment-chart";
import { TopDoctors } from "./top-doctors";

dayjs.extend(utc);

interface ChartsSectionProps {
	clinicId: string;
	from: string;
	to: string;
}

export default async function ChartsSection({
	clinicId,
	from,
	to,
}: ChartsSectionProps) {
	const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate();
	const chartEndDate = dayjs().add(10, "days").endOf("day").toDate();

	const [topDoctors, dailyAppointmentsData] = await Promise.all([
		db
			.select({
				id: doctorsTable.id,
				name: doctorsTable.name,
				avatarImageUrl: doctorsTable.avatarImageUrl,
				specialty: doctorsTable.specialty,
				appointments: count(appointmentsTable.id),
			})
			.from(doctorsTable)
			.leftJoin(
				appointmentsTable,
				and(
					eq(appointmentsTable.doctorId, doctorsTable.id),
					gte(appointmentsTable.date, new Date(from)),
					lte(appointmentsTable.date, new Date(to)),
				),
			)
			.where(eq(doctorsTable.clinicId, clinicId))
			.groupBy(doctorsTable.id)
			.orderBy(desc(count(appointmentsTable.id)))
			.limit(5),
		db
			.select({
				date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
				appointments: count(appointmentsTable.id),
				revenue:
					sql<number>`COALESCE(SUM(${appointmentsTable.appointmentPriceInCents}), 0)`.as(
						"revenue",
					),
			})
			.from(appointmentsTable)
			.where(
				and(
					eq(appointmentsTable.clinicId, clinicId),
					gte(appointmentsTable.date, chartStartDate),
					lte(appointmentsTable.date, chartEndDate),
				),
			)
			.groupBy(sql`DATE(${appointmentsTable.date})`)
			.orderBy(sql`DATE(${appointmentsTable.date})`),
	]);

	return (
		<div className="animate-fade-in grid min-h-0 grid-rows-2 lg:grid-rows-1 lg:grid-cols-[2.25fr_1fr] gap-4">
			<AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
			<TopDoctors topDoctors={topDoctors} />
		</div>
	);
}
