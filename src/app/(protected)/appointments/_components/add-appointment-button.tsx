"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { doctorsTable, patientsTable } from "@/db/schema";

import UpsertAppointmentForm from "./upsert-appointment-form";

type Doctor = typeof doctorsTable.$inferSelect;
type Patient = typeof patientsTable.$inferSelect;

interface AddScheduleButtonProps {
  doctors: Doctor[];
  patients: Patient[];
}

export function AddScheduleButton({
  doctors,
  patients,
}: AddScheduleButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Novo agendamento</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <UpsertAppointmentForm doctors={doctors} patients={patients} isOpen />
      </DialogContent>
    </Dialog>
  );
}
