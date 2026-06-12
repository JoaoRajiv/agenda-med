"use client";

import { Shield, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PlanName = "Free" | "Essential" | "Pro";

export type PlanBadgeSize = "sm" | "md" | "lg";

interface PlanConfig {
	icon: React.ElementType;
	className: string;
	iconClassName: string;
}

const planConfig: Record<PlanName, PlanConfig> = {
	Free: {
		icon: Zap,
		className: "bg-slate-100 text-slate-700 border-slate-200",
		iconClassName: "text-slate-500",
	},
	Essential: {
		icon: Star,
		className: "bg-teal-50 text-teal-700 border-teal-200",
		iconClassName: "text-teal-500",
	},
	Pro: {
		icon: Shield,
		className: "bg-blue-50 text-blue-700 border-blue-200",
		iconClassName: "text-blue-500",
	},
};

const sizeConfig: Record<
	PlanBadgeSize,
	{ badge: string; icon: string; text: string }
> = {
	sm: {
		badge: "h-5 px-1.5 gap-1 text-[11px]",
		icon: "size-3",
		text: "",
	},
	md: {
		badge: "h-6 px-2 gap-1.5 text-xs",
		icon: "size-3.5",
		text: "",
	},
	lg: {
		badge: "h-7 px-3 gap-1.5 text-sm",
		icon: "size-4",
		text: "",
	},
};

interface PlanBadgeProps {
	plan: string;
	size?: PlanBadgeSize;
	showIcon?: boolean;
	className?: string;
}

export function PlanBadge({
	plan,
	size = "md",
	showIcon = true,
	className,
}: PlanBadgeProps) {
	const config = planConfig[plan as PlanName] || planConfig.Essential;
	const sizes = sizeConfig[size];
	const Icon = config.icon;

	return (
		<Badge
			variant="outline"
			className={cn(
				"inline-flex items-center font-semibold rounded-full border",
				config.className,
				sizes.badge,
				className,
			)}
			aria-label={`Plano ${plan}`}
			role="status"
		>
			{showIcon && (
				<Icon
					aria-hidden="true"
					className={cn(config.iconClassName, sizes.icon, "shrink-0")}
				/>
			)}
			{plan}
		</Badge>
	);
}
