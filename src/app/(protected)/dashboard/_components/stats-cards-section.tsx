import { and, count, eq, gte, lte, sum } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import StatsCards from "./stats-card";

interface StatsCardsSectionProps {
	clinicId: string;
	from: string;
	to: string;
}

export default async function StatsCardsSection({
	clinicId,
	from,
	to,
}: StatsCardsSectionProps) {
	const [[totalRevenue], [totalAppointments], [totalPatients], [totalDoctors]] =
		await Promise.all([
			db
				.select({
					total: sum(appointmentsTable.appointmentPriceInCents),
				})
				.from(appointmentsTable)
				.where(
					and(
						eq(appointmentsTable.clinicId, clinicId),
						gte(appointmentsTable.date, new Date(from)),
						lte(appointmentsTable.date, new Date(to)),
					),
				),
			db
				.select({ total: count() })
				.from(appointmentsTable)
				.where(
					and(
						eq(appointmentsTable.clinicId, clinicId),
						gte(appointmentsTable.date, new Date(from)),
						lte(appointmentsTable.date, new Date(to)),
					),
				),
			db
				.select({ total: count() })
				.from(patientsTable)
				.where(eq(patientsTable.clinicId, clinicId)),
			db
				.select({ total: count() })
				.from(doctorsTable)
				.where(eq(doctorsTable.clinicId, clinicId)),
		]);

	return (
		<div className="animate-fade-in">
			<StatsCards
				totalRevenue={totalRevenue?.total ? Number(totalRevenue.total) : null}
				totalAppointments={totalAppointments?.total ?? 0}
				totalPatients={totalPatients?.total ?? 0}
				totalDoctors={totalDoctors?.total ?? 0}
			/>
		</div>
	);
}
