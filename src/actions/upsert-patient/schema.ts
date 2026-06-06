import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório."),
  email: z.string().email("E-mail inválido."),
  phoneNumber: z.string().min(1, "Telefone é obrigatório."),
  gender: z.enum(["male", "female", "other"]),
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
