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

export default function DoctorsLoading() {
	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Médicos</PageTitle>
					<PageDescription>Gerencie seus médicos</PageDescription>
				</PageHeaderContent>
				<PageActions>
					<Skeleton className="h-8 w-36" />
				</PageActions>
			</PageHeader>
			<PageContent>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<Skeleton className="h-40" />
					<Skeleton className="h-40" />
					<Skeleton className="h-40" />
				</div>
			</PageContent>
		</PageContainer>
	);
}
