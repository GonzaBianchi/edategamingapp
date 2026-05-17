"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StepPersonal } from "./steps/StepPersonal";
import { StepRiot } from "./steps/StepRiot";
import { StepGames } from "./steps/StepGames";
import { StepPreferences } from "./steps/StepPreferences";

export interface GameData {
  name: "League of Legends" | "Valorant";
  rank: string;
  role: string;
  server: string;
}

export interface RiotAccountData {
  gameName: string;
  tagLine: string;
  puuid: string;
  verified: boolean;
  showStats: boolean;
}

export interface OnboardingData {
  age: string;
  bio: string;
  photos: string[];
  riotAccount: RiotAccountData | null;
  games: GameData[];
  schedule: string[];
  lookingFor: string[];
}

const STEPS = ["Sobre vos", "Cuenta Riot", "Tus juegos", "¿Qué buscás?"];

const INITIAL: OnboardingData = {
  age: "",
  bio: "",
  photos: [],
  riotAccount: null,
  games: [],
  schedule: [],
  lookingFor: ["duo"],
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL);
  const [saving, setSaving] = useState(false);

  function update(partial: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function canAdvance() {
    if (step === 0) return Number(data.age) >= 13;
    if (step === 2) return data.games.length > 0;
    return true;
  }

  async function handleFinish() {
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(data.age),
          bio: data.bio,
          photos: data.photos,
          riotAccount: data.riotAccount,
          games: data.games,
          schedule: data.schedule,
          lookingFor: data.lookingFor,
          onboardingComplete: true,
        }),
      });

      if (!res.ok) throw new Error();
      router.push("/discover");
    } catch {
      toast.error("Hubo un error. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  const stepProps = { data, update };

  return (
    <div className="flex min-h-screen flex-col px-5 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-center text-2xl font-bold">
          <span className="text-violet-400">E</span>date
        </h1>
        <div className="mb-2 flex justify-between text-xs text-zinc-500">
          <span>{STEPS[step]}</span>
          <span>{step + 1} / {STEPS.length}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-violet-500 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1">
        {step === 0 && <StepPersonal {...stepProps} />}
        {step === 1 && <StepRiot {...stepProps} />}
        {step === 2 && <StepGames {...stepProps} />}
        {step === 3 && <StepPreferences {...stepProps} />}
      </div>

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            className="flex-1 border-zinc-700"
            onClick={() => setStep((s) => s - 1)}
          >
            Atrás
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button
            className="flex-1 bg-violet-500 hover:bg-violet-600"
            disabled={!canAdvance()}
            onClick={() => setStep((s) => s + 1)}
          >
            Siguiente
          </Button>
        ) : (
          <Button
            className="flex-1 bg-violet-500 hover:bg-violet-600"
            disabled={saving || !canAdvance()}
            onClick={handleFinish}
          >
            {saving ? "Guardando..." : "Empezar"}
          </Button>
        )}
      </div>
    </div>
  );
}
