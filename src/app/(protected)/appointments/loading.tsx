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

export default function AppointmentsLoading() {
	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Agendamentos</PageTitle>
					<PageDescription>Gerencie seus agendamentos</PageDescription>
				</PageHeaderContent>
				<PageActions>
					<Skeleton className="h-8 w-36" />
				</PageActions>
			</PageHeader>
			<PageContent>
				<div className="space-y-3">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>
			</PageContent>
		</PageContainer>
	);
}
