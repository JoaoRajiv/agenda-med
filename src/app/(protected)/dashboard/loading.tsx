import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from "@/components/ui/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<PageContainer className="flex h-full min-h-0 flex-col overflow-hidden">
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Dashboard</PageTitle>
					<PageDescription>Tenha controle sobre suas consultas</PageDescription>
				</PageHeaderContent>
			</PageHeader>
			<PageContent className="flex min-h-0 flex-1 flex-col overflow-hidden gap-4">
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					<Skeleton className="h-24" />
					<Skeleton className="h-24" />
					<Skeleton className="h-24" />
					<Skeleton className="h-24" />
				</div>
				<div className="grid min-h-0 grid-rows-2 lg:grid-rows-1 lg:grid-cols-[2.25fr_1fr] gap-4">
					<Skeleton className="min-h-[300px]" />
					<Skeleton className="min-h-[300px]" />
				</div>
				<div className="grid min-h-0 flex-1 lg:grid-cols-[2.25fr_1fr] gap-4">
					<Skeleton className="min-h-[200px]" />
					<Skeleton className="min-h-[200px]" />
				</div>
			</PageContent>
		</PageContainer>
	);
}
