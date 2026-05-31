import { Button } from "@/components/ui/button";
import {
  PageContainer,
  PageHeader,
  PageHeaderContent,
  PageTitle,
  PageDescription,
  PageContent,
  PageActions,
} from "@/components/ui/page-container";
import { Plus } from "lucide-react";

const DoctorsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie seus médicos</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Adicionar Médico
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>Doctors Page</h1>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
