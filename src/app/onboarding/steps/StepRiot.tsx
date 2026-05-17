"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { OnboardingData, RiotAccountData } from "../page";

interface Props {
  data: OnboardingData;
  update: (p: Partial<OnboardingData>) => void;
}

export function StepRiot({ data, update }: Props) {
  const [gameName, setGameName] = useState(data.riotAccount?.gameName ?? "");
  const [tagLine, setTagLine] = useState(data.riotAccount?.tagLine ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function verify() {
    if (!gameName || !tagLine) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(
        `/api/riot/verify?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
      );
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "Error al verificar");
        return;
      }

      const account: RiotAccountData = {
        gameName: json.account.gameName,
        tagLine: json.account.tagLine,
        puuid: json.account.puuid,
        verified: true,
        showStats: true,
      };
      update({ riotAccount: account });
      setStatus("ok");
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión");
    }
  }

  function skip() {
    update({ riotAccount: null });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold">Tu cuenta de Riot</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Vinculá tu cuenta para mostrar tu nick y stats
          </p>
        </div>
        <button
          onClick={skip}
          className="shrink-0 text-sm text-zinc-500 underline underline-offset-2 hover:text-zinc-300"
        >
          Saltar
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Riot ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="NombreJugador"
              value={gameName}
              onChange={(e) => { setGameName(e.target.value); setStatus("idle"); }}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 transition-colors"
            />
            <span className="flex items-center text-zinc-500">#</span>
            <input
              type="text"
              placeholder="LAS"
              value={tagLine}
              onChange={(e) => { setTagLine(e.target.value); setStatus("idle"); }}
              className="w-24 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <p className="mt-1.5 text-xs text-zinc-600">
            El tag es lo que aparece después del # en tu nick (ej: LAS, NA1, EUW)
          </p>
        </div>

        <Button
          onClick={verify}
          disabled={!gameName || !tagLine || status === "loading"}
          className="bg-violet-500 hover:bg-violet-600"
        >
          {status === "loading" ? (
            <><Loader size={16} className="animate-spin mr-2" /> Verificando...</>
          ) : "Verificar cuenta"}
        </Button>

        {status === "ok" && (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-400">
            <CheckCircle size={16} />
            <span>Cuenta verificada: <strong>{data.riotAccount?.gameName}#{data.riotAccount?.tagLine}</strong></span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            <XCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {status === "ok" && (
          <div className="flex items-center justify-between rounded-lg bg-zinc-800 px-4 py-3">
            <span className="text-sm text-zinc-300">Mostrar stats en mi perfil</span>
            <button
              onClick={() =>
                update({
                  riotAccount: data.riotAccount
                    ? { ...data.riotAccount, showStats: !data.riotAccount.showStats }
                    : null,
                })
              }
              className={`relative h-6 w-11 rounded-full transition-colors ${
                data.riotAccount?.showStats ? "bg-violet-500" : "bg-zinc-600"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  data.riotAccount?.showStats ? "translate-x-[22px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
