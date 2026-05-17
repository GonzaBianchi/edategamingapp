import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "./LoginButton";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/discover");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="text-violet-400">E</span>date
        </h1>
        <p className="mt-3 text-zinc-400">Encontrá tu duo gamer ideal</p>
      </div>

      <div className="flex flex-col items-center gap-3 text-sm text-zinc-500">
        <span className="text-zinc-400">League of Legends · Valorant · y más</span>
      </div>

      <LoginButton />

      <p className="text-center text-xs text-zinc-600">
        Al continuar aceptás los términos y condiciones. Solo para mayores de 13 años.
      </p>
    </div>
  );
}
