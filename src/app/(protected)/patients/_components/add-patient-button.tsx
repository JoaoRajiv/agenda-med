"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { PlanUpsellModal } from "@/components/plan-upsell-modal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertPatientForm from "./upsert-patient-form";

const AddPatientButton = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [showUpsell, setShowUpsell] = useState(false);

	return (
		<>
			<Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
				<DialogTrigger asChild>
					<Button size="sm">
						<Plus />
						Adicionar Paciente
					</Button>
				</DialogTrigger>
				<UpsertPatientForm
					onSuccess={() => setIsOpen(false)}
					onLimitReached={() => setShowUpsell(true)}
				/>
			</Dialog>
			<PlanUpsellModal
				resourceType="patients"
				open={showUpsell}
				onOpenChange={setShowUpsell}
			/>
		</>
	);
};

export default AddPatientButton;
