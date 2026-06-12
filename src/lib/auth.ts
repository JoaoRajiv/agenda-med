import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { usersTable, usersToClinicTable } from "@/db/schema";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
		schema,
	}),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	plugins: [
		customSession(async ({ user, session }) => {
			// Fetch the clinics associated with the user and include them in the session
			const [userData, clinics] = await Promise.all([
				db.query.usersTable.findFirst({
					where: eq(usersTable.id, user.id),
				}),
				db.query.usersToClinicTable.findMany({
					where: eq(usersToClinicTable.userId, user.id),
					with: {
						clinic: true,
						user: true,
					},
				}),
			]);
			// Alterar a quantidade quando for usar várias clínicas por usuário
			const clinic = clinics?.[0];
			return {
				user: {
					...user,
					plan: userData?.plan,
					clinic: clinic?.clinicId
						? {
								id: clinic?.clinic?.id,
								name: clinic?.clinic?.name,
							}
						: null,
				},
				session,
			};
		}),
	],
	user: {
		modelName: "usersTable",
		additionalFields: {
			stripeCustomerId: {
				type: "string",
				fieldName: "stripeCustomerId",
				required: false,
			},
			stripeSubscriptionId: {
				type: "string",
				fieldName: "stripeSubscriptionId",
				required: false,
			},
			plan: {
				type: "string",
				fieldName: "plan",
				required: false,
			},
		},
	},
	session: {
		modelName: "sessionsTable",
	},
	account: {
		modelName: "accountsTable",
	},
	verification: {
		modelName: "verificationsTable",
	},
	emailAndPassword: {
		enabled: true,
	},
});
