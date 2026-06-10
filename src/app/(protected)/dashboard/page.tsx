import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sum } from "drizzle-orm";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
	PageActions,
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import {
	appointmentsTable,
	doctorsTable,
	patientsTable,
	usersToClinicTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import AppointmentsChart from "./_components/appointment-chart";
import { DatePicker } from "./_components/date-picker";
import StatsCards from "./_components/stats-card";
import { TopDoctors } from "./_components/top-doctors";
import { TopSpecialties } from "./_components/top-specialties";

interface DashboardPageProps {
	searchParams: Promise<{
		from: string;
		to: string;
	}>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
	const { from, to } = await searchParams;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user) {
		redirect("/authentication");
	}
	const clinics = await db.query.usersToClinicTable.findMany({
		where: eq(usersToClinicTable.userId, session.user.id),
	});
	if (clinics.length === 0) {
		redirect("/clinic-form");
	}
	if (!session.user.clinic?.id) {
		redirect("/clinic-form");
	}

	const fromDate = new Date(from);
	const toDate = new Date(to);

	if (!from || !to) {
		redirect(
			`/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
		);
	}

	const [
		[totalRevenue],
		[totalAppointments],
		[totalPatients],
		[totalDoctors],
		topDoctors,
		appointmentsBySpecialty,
		todayAppointments,
	] = await Promise.all([
		db
			.select({ total: sum(appointmentsTable.appointmentPriceInCents) })
			.from(appointmentsTable)
			.where(
				and(
					eq(appointmentsTable.clinicId, session.user.clinic.id),
					gte(appointmentsTable.date, fromDate),
					lte(appointmentsTable.date, toDate),
				),
			),
		db
			.select({ total: count() })
			.from(appointmentsTable)
			.where(
				and(
					eq(appointmentsTable.clinicId, session.user.clinic.id),
					gte(appointmentsTable.date, fromDate),
					lte(appointmentsTable.date, toDate),
				),
			),
		db
			.select({ total: count() })
			.from(patientsTable)
			.where(eq(patientsTable.clinicId, session.user.clinic.id)),
		db
			.select({ total: count() })
			.from(doctorsTable)
			.where(and(eq(doctorsTable.clinicId, session.user.clinic.id))),
		db
			.select({
				doctorId: doctorsTable.id,
				name: doctorsTable.name,
				avatarImageUrl: doctorsTable.avatarImageUrl,
				specialty: doctorsTable.specialty,
				totalAppointments: count(),
			})
			.from(doctorsTable)
			.leftJoin(
				appointmentsTable,
				eq(doctorsTable.id, appointmentsTable.doctorId),
			)
			.where(
				and(
					eq(appointmentsTable.clinicId, session.user.clinic.id),
					gte(appointmentsTable.date, fromDate),
					lte(appointmentsTable.date, toDate),
				),
			)
			.groupBy(doctorsTable.id)
			.orderBy((t) => desc(t.totalAppointments))
			.limit(5),
		db
			.select({
				specialty: doctorsTable.specialty,
				totalAppointments: count(),
			})
			.from(appointmentsTable)
			.innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
			.where(
				and(
					eq(appointmentsTable.clinicId, session.user.clinic.id),
					gte(appointmentsTable.date, fromDate),
					lte(appointmentsTable.date, toDate),
				),
			)
			.groupBy(doctorsTable.specialty)
			.orderBy(desc(count(appointmentsTable.id))),
		db.query.appointmentsTable.findMany({
			where: and(
				eq(appointmentsTable.clinicId, session.user.clinic.id),
				gte(appointmentsTable.date, dayjs().startOf("day").toDate()),
				lte(appointmentsTable.date, dayjs().endOf("day").toDate()),
			),
			with: {
				patient: true,
				doctor: true,
			},
		}),
	]);

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Dashboard</PageTitle>
					<PageDescription>Tenha controle sobre suas consultas</PageDescription>
				</PageHeaderContent>
				<PageActions>
					<DatePicker />
				</PageActions>
			</PageHeader>
			<PageContent>
				<StatsCards
					totalRevenue={totalRevenue?.total ? Number(totalRevenue.total) : null}
					totalAppointments={totalAppointments?.total ?? 0}
					totalPatients={totalPatients?.total ?? 0}
					totalDoctors={totalDoctors?.total ?? 0}
				/>
				<div className="grid grid-cols-[2.25fr_1fr] gap-4 mt-4">
					<AppointmentsChart dailyAppointmentsData={[]} />
					<TopDoctors topDoctors={topDoctors} />
				</div>
				<div className="grid grid-cols-[2.25fr_1fr] gap-4 mt-4">
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Calendar className="w-5 h-5 text-gray-400" />
								<CardTitle className="text-md font-bold text-gray-900">
									Agendamentos de hoje
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<DataTable
								data={todayAppointments}
								columns={appointmentsTableColumns}
							/>
						</CardContent>
					</Card>
					<TopSpecialties topSpecialties={appointmentsBySpecialty} />
				</div>
			</PageContent>
		</PageContainer>
	);
};

export default DashboardPage;
