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

export default function PatientsLoading() {
	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Pacientes</PageTitle>
					<PageDescription>Gerencie seus pacientes</PageDescription>
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
