"use client";
import { Calendar, ClockIcon, DollarSign } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { doctorsTable } from "@/db/schema";

import { formatCurrencyInCents } from "../../../../helpers/currency";
import { getAvailability } from "../../_helpers/availability";
import UpsertDoctorForm from "./upsert-doctor-form";

interface DoctorCardProps {
	doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
	const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);
	const doctorInitials = doctor.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
	const availability = getAvailability(doctor);
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarFallback>{doctorInitials}</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="text-sm font-semibold">{doctor.name}</h3>
						<p className="text-muted-foreground text-sm">{doctor.specialty}</p>
					</div>
				</div>
			</CardHeader>
			<Separator />
			<CardContent className="flex flex-col gap-2">
				<Badge variant="outline">
					<Calendar className="mr-1" />
					{`${availability.from.format("ddd")} a ${availability.to.format("ddd")}`}
				</Badge>
				<Badge variant="outline">
					<ClockIcon className="mr-1" />
					{`${availability.from.format("HH:mm")} às ${availability.to.format("HH:mm")}`}
				</Badge>
				<Badge variant="outline">
					<DollarSign className="mr-1" />
					{formatCurrencyInCents(doctor.priceInCents)}
				</Badge>
			</CardContent>
			<Separator />
			<CardFooter>
				<Dialog open={isUpsertDialogOpen} onOpenChange={setIsUpsertDialogOpen}>
					<DialogTrigger asChild>
						<Button className="w-full text-sm">Ver Detalhes</Button>
					</DialogTrigger>
					<UpsertDoctorForm
						doctor={{
							...doctor,
							availableFromTime: availability.from.format("HH:mm:ss"),
							availableToTime: availability.to.format("HH:mm:ss"),
						}}
						onSuccess={() => setIsUpsertDialogOpen(false)}
					/>
				</Dialog>
			</CardFooter>
		</Card>
	);
};

export default DoctorCard;
