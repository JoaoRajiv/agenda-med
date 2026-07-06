import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

type ResourceType = "doctors" | "patients" | "appointments";

const FREE_LIMITS: Record<ResourceType, number> = {
	doctors: 1,
	patients: 1,
	appointments: 1,
};

export async function checkPlanLimit(
	clinicId: string,
	type: ResourceType,
): Promise<{ allowed: boolean; limit: number; count: number }> {
	const session = await auth.api.getSession({ headers: await headers() });
	const plan = session?.user?.plan || "free";

	if (plan !== "free") {
		return { allowed: true, limit: 0, count: 0 };
	}

	const limit = FREE_LIMITS[type];
	const count = await countResources(clinicId, type);

	return { allowed: count < limit, limit, count };
}

async function countResources(
	clinicId: string,
	type: ResourceType,
): Promise<number> {
	const tableMap = {
		doctors: doctorsTable,
		patients: patientsTable,
		appointments: appointmentsTable,
	};

	const table = tableMap[type];
	const rows = await db
		.select({ id: table.id })
		.from(table)
		.where(eq(table.clinicId, clinicId));

	return rows.length;
}
