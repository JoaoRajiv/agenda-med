"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import UpsertPatientForm from "./upsert-patient-form";
import { Plus } from "lucide-react";

const AddPatientButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Adicionar Paciente
        </Button>
      </DialogTrigger>
      <UpsertPatientForm onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddPatientButton;
