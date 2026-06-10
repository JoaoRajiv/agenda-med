import { Hospital } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Doctor {
	specialty: string;
	totalAppointments: number;
}

interface TopSpecialtiesProps {
	topSpecialties: Doctor[];
}

export function TopSpecialties({ topSpecialties }: TopSpecialtiesProps) {
	const maxAppointments =
		Math.max(...topSpecialties.map((s) => s.totalAppointments), 0) || 1;
	return (
		<Card className="bg-white rounded-lg">
			{/* Header */}
			<CardHeader className="flex items-center justify-between ">
				<CardTitle className="flex items-center gap-2">
					<Hospital className="w-5 h-5 text-gray-400" />
					<h2 className="text-xl font-semibold text-gray-900">
						Especialidades
					</h2>
				</CardTitle>
			</CardHeader>

			{/* Specialist List */}
			<CardContent className="space-y-4">
				{topSpecialties.map((specialty) => {
					const progressValue =
						(specialty.totalAppointments / maxAppointments) * 100; // Assuming 100 is the max for progress bar
					return (
						<div
							key={specialty.specialty}
							className="flex items-center justify-between"
						>
							<div className="flex items-center gap-2">
								{/* Avatar */}
								<div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
									<div className="w-full h-full bg-gray-300 flex items-center justify-center">
										<span className="text-xs font-semibold text-primary">
											{specialty.specialty.toUpperCase().charAt(0)}
										</span>
									</div>
								</div>

								{/* Specialist Info */}
								<div>
									<p className="font-medium text-gray-900">
										{specialty.specialty}
									</p>
									<Progress value={progressValue} className="w-24 h-2 mt-1" />
								</div>
							</div>

							{/* Appointments Count */}
							<div className="text-right">
								<p className="text-sm text-gray-600">
									<span className="font-semibold">
										{specialty.totalAppointments}
									</span>
									<span className="text-gray-400"> agend.</span>
								</p>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
