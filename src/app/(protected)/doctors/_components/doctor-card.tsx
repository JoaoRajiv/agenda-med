"use client";
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
import { doctorsTable } from "@/db/schema";
import { Calendar, Clock, Clock1, ClockIcon, DollarSign } from "lucide-react";

interface DoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const doctorInitials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
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
      <CardContent className="flex flex-col gap-1">
        <Badge variant="outline">
          <Calendar />
          {`Disponível de ${doctor.availableFromWeekday} às ${doctor.availableToWeekday}`}
        </Badge>
        <Badge variant="outline">
          <ClockIcon />
          {`Disponível das ${doctor.availableFromTime} às ${doctor.availableToTime}`}
        </Badge>
        <Badge variant="outline">
          <DollarSign />
          {`Valor da consulta: R$ ${doctor.appointmentPriceInCents / 100},00`}
        </Badge>
        <Separator />
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-sm">Ver Detalhes</Button>
            </DialogTrigger>
          </Dialog>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
