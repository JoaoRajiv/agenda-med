"use client";
import { Plus } from "lucide-react";
import { useState } from "react";

import { PlanUpsellModal } from "@/components/plan-upsell-modal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertDoctorForm from "./upsert-doctor-form";

const AddDoctorButton = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [showUpsell, setShowUpsell] = useState(false);

	return (
		<>
			<Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
				<DialogTrigger asChild>
					<Button size="sm">
						<Plus />
						Adicionar Médico
					</Button>
				</DialogTrigger>
				<UpsertDoctorForm
					onSuccess={() => setIsOpen(false)}
					onLimitReached={() => setShowUpsell(true)}
				/>
			</Dialog>
			<PlanUpsellModal
				resourceType="doctors"
				open={showUpsell}
				onOpenChange={setShowUpsell}
			/>
		</>
	);
};

export default AddDoctorButton;
