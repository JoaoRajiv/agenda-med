import { headers } from "next/headers";
import { SubscriptionPlan } from "@/app/(protected)/subscription/_components/subscription-plan";
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

const SubscriptionPage = async () => {
	const session = await auth.api.getSession({ headers: await headers() });
	const plan = session?.user?.plan;

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Assinatura</PageTitle>
					<PageDescription>Gerencie sua assinatura</PageDescription>
				</PageHeaderContent>
			</PageHeader>
			<PageContent>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<SubscriptionPlan
						description="Ideal para clínicas que estão começando e querem testar a plataforma."
						active={plan === "free"}
						features={["Acesso a funcionalidades básicas", "Suporte por email"]}
						planName="Plano Basic"
						price={0}
					/>
					<SubscriptionPlan
						description="Perfeito para clínicas de pequeno porte que precisam de mais funcionalidades e suporte dedicado."
						active={plan === "essential"}
						features={[
							"Acesso a todas as funcionalidades",
							"Suporte prioritário por email e chat",
							"Relatórios avançados",
						]}
						planName="Plano Essential"
						price={199.99}
					/>
					<SubscriptionPlan
						description="Perfeito para clínicas de médio porte que precisam de mais funcionalidades e suporte dedicado."
						active={plan === "pro"}
						features={[
							"Tudo do Plano Essential",
							"Integração com sistemas de terceiros",
							"Acesso a customizações",
							"Consultoria personalizada",
							"Treinamento para equipe",
							"Acesso antecipado a novas funcionalidades",
						]}
						planName="Plano Pro"
						price={499.99}
					/>
				</div>
			</PageContent>
		</PageContainer>
	);
};

export default SubscriptionPage;
