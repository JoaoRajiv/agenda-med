"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpsertPatientForm } from "./upsert-patient-form";
import { useState } from "react";

const AddPatientButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Paciente</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo paciente</DialogTitle>
        </DialogHeader>
        <UpsertPatientForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientButton;
