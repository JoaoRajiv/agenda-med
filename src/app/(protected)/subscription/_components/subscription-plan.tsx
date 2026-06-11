"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Check, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createStripeCheckout } from "@/actions/create-stripe-checkout";
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
	planName: string;
	description: string;
	price: number;
	currency?: string;
	billingPeriod?: string;
	features: string[];
	onSubscribe?: () => void;
}

export function SubscriptionPlan({
	active = false,
	planName,
	description,
	price,
	currency = "R$",
	billingPeriod = "mês",
	features,
}: SubscriptionPlanProps) {
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

	const handleSubscribe = async () => {
		createStripeCheckoutAction.execute();
	};
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
				{active ? (
					<Button
						disabled
						className="w-full bg-neutral-100 text-neutral-600 hover:bg-neutral-100 cursor-not-allowed"
						aria-label="Plano atual ativo"
					>
						Plano Ativo
					</Button>
				) : (
					<Button
						onClick={handleSubscribe}
						className="w-full bg-primary text-white hover:bg-neutral-800 transition-colors"
						disabled={createStripeCheckoutAction.isExecuting}
						aria-label={`Inscrever-se no plano ${planName}`}
					>
						{createStripeCheckoutAction.isExecuting ? (
							<Loader2
								className="animate-spin h-5 w-5 text-white"
								aria-hidden="true"
							/>
						) : active ? (
							"Plano Ativo"
						) : (
							"Assinar"
						)}
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
