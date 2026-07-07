import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { and, count, desc, eq, gte, lte } from "drizzle-orm";
import { Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/db";
import { appointmentsTable, doctorsTable } from "@/db/schema";

import { appointmentsTableColumns } from "../../appointments/_components/table-columns";
import { TopSpecialties } from "./top-specialties";

dayjs.extend(utc);

interface TodaySectionProps {
	clinicId: string;
	from: string;
	to: string;
}

export default async function TodaySection({
	clinicId,
	from,
	to,
}: TodaySectionProps) {
	const [todayAppointments, topSpecialties] = await Promise.all([
		db.query.appointmentsTable.findMany({
			where: and(
				eq(appointmentsTable.clinicId, clinicId),
				gte(appointmentsTable.date, dayjs().startOf("day").toDate()),
				lte(appointmentsTable.date, dayjs().endOf("day").toDate()),
			),
			with: {
				patient: {
					columns: {
						id: true,
						name: true,
						email: true,
						phoneNumber: true,
						sex: true,
					},
				},
				doctor: { columns: { id: true, name: true, specialty: true } },
			},
		}),
		db
			.select({
				specialty: doctorsTable.specialty,
				appointments: count(appointmentsTable.id),
			})
			.from(appointmentsTable)
			.innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
			.where(
				and(
					eq(appointmentsTable.clinicId, clinicId),
					gte(appointmentsTable.date, new Date(from)),
					lte(appointmentsTable.date, new Date(to)),
				),
			)
			.groupBy(doctorsTable.specialty)
			.orderBy(desc(count(appointmentsTable.id))),
	]);

	return (
		<div className="animate-fade-in grid min-h-0 flex-1 lg:grid-cols-[2.25fr_1fr] gap-4">
			<Card className="min-h-0 overflow-hidden">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Calendar className="w-5 h-5 text-gray-400" />
						<CardTitle className="text-md font-bold text-gray-900">
							Agendamentos de hoje
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="min-h-0 flex-1 overflow-auto">
					<DataTable
						data={todayAppointments}
						columns={appointmentsTableColumns}
					/>
				</CardContent>
			</Card>
			<TopSpecialties topSpecialties={topSpecialties} />
		</div>
	);
}
