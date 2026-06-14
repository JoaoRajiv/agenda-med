"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { activateFreePlan } from "@/actions/active-free-plan";
import { createStripeCheckout } from "@/actions/create-stripe-checkout";
import { openCustomerPortalAction } from "@/actions/stripe-portal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface SubscriptionPlanProps {
	active?: boolean;
	planKey: "free" | "essential" | "pro";
	planName: string;
	description: string;
	price: number;
	currency?: string;
	billingPeriod?: string;
	features: string[];
	userEmail?: string;
	onSubscribe?: () => void;
}

export function SubscriptionPlan({
	active,
	planKey,
	planName,
	description,
	price,
	currency = "R$",
	billingPeriod = "mês",
	features,
}: SubscriptionPlanProps) {
	const router = useRouter();
	const isFreePlan = price === 0; // Se o preço for 0, é garantido que é o plano grátis

	const createStripeCheckoutAction = useAction(createStripeCheckout, {
		onSuccess: async ({ data }) => {
			if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
				throw new Error("Stripe publishable key not found.");
			}
			const stripe = await loadStripe(
				process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
			);

			if (!stripe) {
				throw new Error("Failed to load Stripe.js");
			}
			if (!data?.sessionId) {
				throw new Error("Stripe session ID not found.");
			}
			await stripe.redirectToCheckout({ sessionId: data?.sessionId });
		},
	});

	const activateFreePlanAction = useAction(activateFreePlan, {
		onSuccess: () => {
			router.refresh();
		},
		onError: ({ error }) => {
			toast.error(`Erro ao ativar o plano gratuito: ${error}`);
		},
	});

	const { execute } = useAction(openCustomerPortalAction, {
		// Callbacks do next-safe-action
		onSuccess: ({ data }) => {
			if (data?.url) {
				// Redireciona o usuário para o portal assim que a URL chegar
				router.push(data.url);
			}
		},
		onError: ({ error }) => {
			// Captura a exceção disparada no servidor
			toast.error(`Erro ao abrir o portal de assinatura: ${error}`);
		},
	});

	const handleSubscribe = async () => {
		console.log("DEBUG: handleSubscribe chamado");
		createStripeCheckoutAction.execute();
	};

	const handleActivateFreePlan = () => {
		console.log("DEBUG: handleActivateFreePlan chamado para plano:", planKey);
		activateFreePlanAction.execute();
	};

	const isLoading =
		createStripeCheckoutAction.isExecuting ||
		activateFreePlanAction.isExecuting;
	const isCurrentFreePlan = active && isFreePlan;

	console.log("DEBUG SubscriptionPlan:", {
		planKey,
		active,
		isFreePlan,
		isCurrentFreePlan,
	});
	return (
		<Card className="relative flex flex-col h-full border-2 border-neutral-200 transition-all duration-300 hover:border-teal-500 hover:shadow-lg">
			{/* Badge/Status Area */}
			<div className="absolute -top-3 right-4">
				{active ? (
					<Badge
						variant="secondary"
						className="bg-teal-100 text-teal-700 px-3 py-1 font-semibold"
						role="status"
						aria-label="Plano atual"
					>
						Atual
					</Badge>
				) : null}
			</div>

			{/* Header */}
			<CardHeader className="">
				<CardTitle className="text-2xl font-bold text-neutral-900">
					{planName}
				</CardTitle>
				<CardDescription className="text-sm text-neutral-600 mt-2">
					{description}
				</CardDescription>
			</CardHeader>

			{/* Pricing */}
			<CardContent className="">
				<div className="flex items-baseline gap-1">
					<span className="text-4xl font-bold text-neutral-900">
						{currency}
						{price}
					</span>
					<span className="text-neutral-500 text-sm">/ {billingPeriod}</span>
				</div>
			</CardContent>

			{/* Features List */}
			<CardContent className="flex-1 pb-6">
				<ul className="space-y-3">
					{features.map((feature) => (
						<li key={feature} className="flex items-start gap-3">
							<div className="shrink-0 mt-0.5">
								<Check
									className="w-5 h-5 text-teal-500 font-bold"
									aria-hidden="true"
								/>
							</div>
							<span className="text-sm text-neutral-700">{feature}</span>
						</li>
					))}
				</ul>
			</CardContent>

			{/* Action Button */}
			<CardContent className="pt-0">
				{isCurrentFreePlan ? (
					<Button variant="outline" className="w-full" disabled>
						Plano atual
					</Button>
				) : active && !isFreePlan ? (
					<Button
						variant={"outline"}
						className="w-full"
						aria-label="Plano atual ativo"
						onClick={() => {
							console.log("DEBUG: Clicou em Gerenciar Plano");
							execute();
						}}
					>
						Gerenciar Plano
					</Button>
				) : isFreePlan ? (
					<Button
						onClick={() => {
							console.log("DEBUG: Clicou em Ativar Plano Grátis");
							handleActivateFreePlan();
						}}
						className="w-full bg-primary text-white  transition-colors"
						disabled={isLoading}
						aria-label={`Inscrever-se no plano ${planName}`}
					>
						{isLoading ? (
							<Loader2
								className="animate-spin h-5 w-5 text-white"
								aria-hidden="true"
							/>
						) : (
							"Ativar plano grátis"
						)}
					</Button>
				) : (
					<Button
						onClick={() => {
							console.log("DEBUG: Clicou em Assinar");
							handleSubscribe();
						}}
						className="w-full bg-primary text-white  transition-colors"
						disabled={isLoading}
						aria-label={`Inscrever-se no plano ${planName}`}
					>
						{isLoading ? (
							<Loader2
								className="animate-spin h-5 w-5 text-white"
								aria-hidden="true"
							/>
						) : (
							"Assinar"
						)}
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
