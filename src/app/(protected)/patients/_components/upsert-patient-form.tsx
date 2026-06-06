"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpsertPatientSchema,
  upsertPatientSchema,
} from "@/actions/upsert-patient/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PatternFormat } from "react-number-format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "next-safe-action/hooks";
import { upsertPatient } from "@/actions/upsert-patient";
import { toast } from "sonner";
import { z } from "zod";
import { patientsTable } from "@/db/schema";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phoneNumber: z.string().trim().min(1, {
    message: "Número de telefone é obrigatório.",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Sexo é obrigatório.",
  }),
});

interface UpsertPatientFormProps {
  onSuccess: () => void;
  patient?: typeof patientsTable.$inferSelect;
}

export function UpsertPatientForm({
  onSuccess,
  patient,
}: UpsertPatientFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: patient || {
      name: "",
      email: "",
      phoneNumber: "",
      gender: "other",
    },
  });

  const { execute, status } = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success("Paciente salvo com sucesso!");
      onSuccess();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Ocorreu um erro ao salvar o paciente.");
    },
  });

  function onSubmit(values: UpsertPatientSchema) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do paciente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="E-mail do paciente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <PatternFormat
                  format="(##) #####-####"
                  placeholder="(00) 00000-0000"
                  customInput={Input}
                  onValueChange={(v) => field.onChange(v.value)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={status === "executing"}>
          {status === "executing" ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
