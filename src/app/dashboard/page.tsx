import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "./components/sign-out-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/authentication");
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
