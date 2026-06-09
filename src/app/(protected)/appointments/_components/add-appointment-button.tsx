"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { doctorsTable, patientsTable } from "@/db/schema";
import UpsertAppointmentForm from "./upsert-appointment-form";

type Doctor = typeof doctorsTable.$inferSelect;
type Patient = typeof patientsTable.$inferSelect;

interface AddAppointmentButtonProps {
	doctors: Doctor[];
	patients: Patient[];
}

export function AddAppointmentButton({
	doctors,
	patients,
}: AddAppointmentButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="sm">
					<Plus />
					Novo agendamento
				</Button>
			</DialogTrigger>
			<UpsertAppointmentForm
				doctors={doctors}
				patients={patients}
				isOpen={isOpen}
				onSuccess={() => setIsOpen(false)}
			/>
		</Dialog>
	);
}
