import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
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
import { getDashboard } from "@/data/get-dashboard";
import { db } from "@/db";
import { usersToClinicTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import AppointmentsChart from "./_components/appointment-chart";
import { DatePicker } from "./_components/date-picker";
import StatsCards from "./_components/stats-card";
import { TopDoctors } from "./_components/top-doctors";
import { TopSpecialties } from "./_components/top-specialties";

dayjs.extend(utc);

interface DashboardPageProps {
	searchParams: Promise<{
		from: string;
		to: string;
	}>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
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

	// if (!session.user.plan) {
	// 	redirect("/new-subscription");
	// }

	const { from, to } = await searchParams;

	if (!from || !to) {
		const now = dayjs().utc().local();
		redirect(
			`/dashboard?from=${now.startOf("month").format("YYYY-MM-DD")}&to=${now.format("YYYY-MM-DD")}`,
		);
	}

	const {
		totalRevenue,
		totalAppointments,
		totalPatients,
		totalDoctors,
		topDoctors,
		topSpecialties,
		todayAppointments,
		dailyAppointmentsData,
	} = await getDashboard({
		from,
		to,
		session: {
			user: {
				clinic: {
					id: session.user.clinic.id,
				},
			},
		},
	});

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
					<AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
					<TopDoctors topDoctors={topDoctors} />
				</div>
				<div className="grid grid-cols-[2.25fr_1fr] max-h-50 gap-4 mt-4">
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
					<TopSpecialties topSpecialties={topSpecialties} />
				</div>
			</PageContent>
		</PageContainer>
	);
};

export default DashboardPage;
