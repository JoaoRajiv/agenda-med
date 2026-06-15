"use client";

import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs"; // 1. Mude para parseAsString
import type * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
	className,
}: React.HTMLAttributes<HTMLDivElement>) {
	// 2. Controlamos o estado da URL como string exata "YYYY-MM-DD"
	const [fromStr, setFromStr] = useQueryState(
		"from",
		parseAsString.withDefault(format(new Date(), "yyyy-MM-dd")),
	);
	const [toStr, setToStr] = useQueryState(
		"to",
		parseAsString.withDefault(format(addMonths(new Date(), 1), "yyyy-MM-dd")),
	);

	// 3. Forçamos a criação da data na meia-noite local anexando o T00:00:00
	const from = fromStr ? new Date(`${fromStr}T00:00:00`) : undefined;
	const to = toStr ? new Date(`${toStr}T00:00:00`) : undefined;

	const handleDateSelect = (dateRange: DateRange | undefined) => {
		if (dateRange?.from) {
			setFromStr(format(dateRange.from, "yyyy-MM-dd"), {
				shallow: false,
			});
		}
		if (dateRange?.to) {
			setToStr(format(dateRange.to, "yyyy-MM-dd"), {
				shallow: false,
			});
		}
	};

	const date = {
		from,
		to,
	};

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"justify-start text-left font-normal",
							!date.from && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y", {
										locale: ptBR,
									})}{" "}
									-{" "}
									{format(date.to, "LLL dd, y", {
										locale: ptBR,
									})}
								</>
							) : (
								// Adicionado a localidade ptBR aqui também por segurança
								format(date.from, "LLL dd, y", { locale: ptBR })
							)
						) : (
							<span>Selecione uma data</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={handleDateSelect}
						numberOfMonths={1}
						locale={ptBR}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
