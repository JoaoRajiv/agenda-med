"use client";

import { Gem } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const RESOURCE_LABELS: Record<string, string> = {
	doctors: "médicos",
	patients: "pacientes",
	appointments: "consultas",
};

interface PlanUpsellModalProps {
	resourceType: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function PlanUpsellModal({
	resourceType,
	open,
	onOpenChange,
}: PlanUpsellModalProps) {
	const router = useRouter();
	const label = RESOURCE_LABELS[resourceType] || resourceType;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-2">
						<Gem className="size-6 text-teal-500" />
						<DialogTitle>Limite do plano Free</DialogTitle>
					</div>
					<DialogDescription className="pt-2">
						Você atingiu o limite de {label} do seu plano Free. Faça upgrade
						para continuar cadastrando.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Entendi
					</Button>
					<Button onClick={() => router.push("/new-subscription")}>
						Fazer Upgrade
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
