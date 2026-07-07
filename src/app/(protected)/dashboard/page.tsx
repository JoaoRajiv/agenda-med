import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
	PageActions,
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from "@/components/ui/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db";
import { usersToClinicTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import ChartsSection from "./_components/charts-section";
import { DatePicker } from "./_components/date-picker";
import StatsCardsSection from "./_components/stats-cards-section";
import TodaySection from "./_components/today-section";

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

	const { from, to } = await searchParams;

	if (!from || !to) {
		const now = dayjs().utc().local();
		redirect(
			`/dashboard?from=${now.startOf("month").format("YYYY-MM-DD")}&to=${now.format("YYYY-MM-DD")}`,
		);
	}

	const clinicId = session.user.clinic.id;

	return (
		<PageContainer className="flex h-full min-h-0 flex-col overflow-hidden">
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Dashboard</PageTitle>
					<PageDescription>Tenha controle sobre suas consultas</PageDescription>
				</PageHeaderContent>
				<PageActions>
					<DatePicker />
				</PageActions>
			</PageHeader>
			<PageContent className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<Suspense
					fallback={
						<div className="animate-fade-in grid grid-cols-2 gap-4 lg:grid-cols-4">
							<Skeleton className="h-24" />
							<Skeleton className="h-24" />
							<Skeleton className="h-24" />
							<Skeleton className="h-24" />
						</div>
					}
				>
					<StatsCardsSection clinicId={clinicId} from={from} to={to} />
				</Suspense>
				<Suspense
					fallback={
						<div className="animate-fade-in grid min-h-0 grid-rows-2 lg:grid-rows-1 lg:grid-cols-[2.25fr_1fr] gap-4">
							<Skeleton className="min-h-[300px]" />
							<Skeleton className="min-h-[300px]" />
						</div>
					}
				>
					<ChartsSection clinicId={clinicId} from={from} to={to} />
				</Suspense>
				<Suspense
					fallback={
						<div className="animate-fade-in grid min-h-0 flex-1 lg:grid-cols-[2.25fr_1fr] gap-4">
							<Skeleton className="min-h-[200px]" />
							<Skeleton className="min-h-[200px]" />
						</div>
					}
				>
					<TodaySection clinicId={clinicId} from={from} to={to} />
				</Suspense>
			</PageContent>
		</PageContainer>
	);
};

export default DashboardPage;
