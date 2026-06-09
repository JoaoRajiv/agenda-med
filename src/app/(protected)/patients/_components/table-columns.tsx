"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { patientsTable } from "@/db/schema";
import { formatPhoneNumber } from "@/helpers/format-number-phone";

import PatientsTableActions from "./table-actions";

type Patient = typeof patientsTable.$inferSelect;

export const patientsTableColumns: ColumnDef<Patient>[] = [
	{
		id: "name",
		accessorKey: "name",
		header: "Nome",
	},
	{
		id: "email",
		accessorKey: "email",
		header: "Email",
	},
	{
		id: "phoneNumber",
		accessorKey: "phoneNumber",
		header: "Telefone",
		cell: (params) => {
			const patient = params.row.original;
			const phoneNumber = patient.phoneNumber;
			if (!phoneNumber) return "";
			return formatPhoneNumber(phoneNumber);
		},
	},
	{
		id: "sex",
		accessorKey: "sex",
		header: "Sexo",
		cell: (params) => {
			const { sex } = params.row.original;
			return (
				<Badge
					variant="outline"
					className={`${sex === "male" ? "bg-blue-100 text-blue-800" : sex === "female" ? "bg-pink-100 text-pink-800" : "bg-gray-100 text-gray-800"}`}
				>
					{sex === "male"
						? "Masculino"
						: sex === "female"
							? "Feminino"
							: "Outro"}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		header: "Ações",
		cell: (params) => {
			const patient = params.row.original;
			return <PatientsTableActions patient={patient} />;
		},
	},
];
