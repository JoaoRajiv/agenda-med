import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface Doctor {
	id: string;
	name: string;
	avatarImageUrl: string | null;
	specialty: string;
	appointments: number;
}

interface TopDoctorsProps {
	topDoctors: Doctor[];
}

export function TopDoctors({ topDoctors }: TopDoctorsProps) {
	return (
		<Card className="bg-white rounded-lg">
			{/* Header */}
			<CardHeader className="flex items-center justify-between ">
				<CardTitle className="flex items-center gap-2">
					<Heart className="w-5 h-5 text-gray-400" />
					<h2 className="text-md font-bold text-gray-900">Médicos</h2>
				</CardTitle>
				<CardAction>
					<Link
						href="/doctors"
						className="text-sm text-gray-400 hover:text-gray-600"
					>
						Ver todos
					</Link>
				</CardAction>
			</CardHeader>

			{/* Doctors List */}
			<CardContent className="space-y-4">
				{topDoctors.map((doctor) => (
					<div key={doctor.id} className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{/* Avatar */}
							<div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
								{doctor.avatarImageUrl ? (
									<Image
										src={doctor.avatarImageUrl}
										alt={doctor.name}
										fill
										className="object-cover"
									/>
								) : (
									<div className="w-full h-full bg-gray-300 flex items-center justify-center">
										<span className="text-xs font-semibold text-primary">
											{doctor.name.charAt(0)}
										</span>
									</div>
								)}
							</div>

							{/* Doctor Info */}
							<div>
								<p className="font-medium text-gray-900">{doctor.name}</p>
								<p className="text-sm text-gray-400">{doctor.specialty}</p>
							</div>
						</div>

						{/* Appointments Count */}
						<div className="text-right">
							<p className="text-sm text-gray-600">
								<span className="font-semibold">{doctor.appointments}</span>
								<span className="text-gray-400"> agend.</span>
							</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
