import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { usersToClinicTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import SignOutButton from "./_components/sign-out-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/authentication");
  }
  const clinics = await db.query.usersToClinicTable.findMany({
    where: eq(usersToClinicTable.userId, session.user.id),
  });
  if (clinics.length === 0) {
    redirect("/clinic-form");
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">
        Bem-vindo {session?.user.name || "Usuário"}!
      </h1>
      <p className="text-lg text-gray-600">Esta é a sua área de controle.</p>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
