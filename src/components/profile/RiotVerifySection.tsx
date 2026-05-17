"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader, Unlink } from "lucide-react";
import { getIconImageUrl, LOL_SERVERS } from "@/lib/constants/games";
import { toast } from "sonner";

interface RiotAccount {
  gameName: string;
  tagLine: string;
  puuid: string;
  server: string;
  verified: boolean;
  showStats: boolean;
}

interface RiotVerifySectionProps {
  riotAccount: RiotAccount | null;
  lolServer: string;
  onVerified: (account: RiotAccount) => void;
  onUnlink: () => void;
}

type Step = "input" | "pending" | "checking";

export function RiotVerifySection({ riotAccount, lolServer, onVerified, onUnlink }: RiotVerifySectionProps) {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [server, setServer] = useState(lolServer || "LAS");
  const [step, setStep] = useState<Step>("input");
  const [puuid, setPuuid] = useState("");
  const [verificationIconId, setVerificationIconId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingError, setPendingError] = useState("");
  const [showStats, setShowStats] = useState(riotAccount?.showStats ?? true);

  async function handleStart() {
    if (!gameName || !tagLine) return;
    setStep("checking");
    setErrorMsg("");

    try {
      const res = await fetch(
        `/api/riot/verify-icon?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Cuenta no encontrada");
        setStep("input");
        return;
      }

      setPuuid(data.puuid);
      setVerificationIconId(data.verificationIconId);
      setPendingError("");
      setStep("pending");
    } catch {
      setErrorMsg("Error de conexión");
      setStep("input");
    }
  }

  async function handleVerifyIcon() {
    setStep("checking");

    try {
      const res = await fetch("/api/riot/verify-icon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ puuid, server, gameName, tagLine }),
      });
      const data = await res.json();

      if (data.verified) {
        onVerified({ gameName, tagLine, puuid, server, verified: true, showStats });
        toast.success("¡Cuenta de Riot verificada!");
        setStep("input");
        setGameName("");
        setTagLine("");
      } else {
        setPendingError(data.error ?? "El ícono no coincide");
        setStep("pending");
      }
    } catch {
      setPendingError("Error de conexión");
      setStep("pending");
    }
  }

  // Cuenta ya verificada
  if (riotAccount?.verified) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3">
          <CheckCircle size={18} className="text-green-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">
              {riotAccount.gameName}
              <span className="text-zinc-500">#{riotAccount.tagLine}</span>
            </p>
            <p className="text-xs text-zinc-500">Cuenta verificada</p>
          </div>
          <button
            onClick={onUnlink}
            className="text-zinc-500 hover:text-red-400 transition-colors"
            title="Desvincular"
          >
            <Unlink size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-zinc-800 px-4 py-3">
          <span className="text-sm text-zinc-300">Mostrar stats en perfil</span>
          <button
            onClick={() => setShowStats((s) => !s)}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${showStats ? "bg-violet-500" : "bg-zinc-600"}`}
          >
            <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${showStats ? "translate-x-[22px]" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
    );
  }

  // Paso: ingresar datos
  if (step === "input") {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-zinc-400">Riot ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="NombreJugador"
              value={gameName}
              onChange={(e) => { setGameName(e.target.value); setStep("input"); }}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 transition-colors"
            />
            <span className="flex items-center text-zinc-500 text-sm">#</span>
            <input
              type="text"
              placeholder="LAS"
              value={tagLine}
              onChange={(e) => { setTagLine(e.target.value); setStep("input"); }}
              className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-zinc-400">Servidor de LoL (para verificación)</label>
          <select
            value={server}
            onChange={(e) => setServer(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
          >
            {LOL_SERVERS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-sm text-red-400">
            <XCircle size={15} className="shrink-0" />
            {errorMsg}
          </div>
        )}

        <Button
          onClick={handleStart}
          disabled={!gameName || !tagLine}
          className="bg-violet-500 hover:bg-violet-600"
        >
          Iniciar verificación
        </Button>

        <p className="text-xs text-zinc-600 text-center">
          Vamos a pedirte que cambies temporalmente tu ícono de perfil en LoL para confirmar que es tu cuenta
        </p>
      </div>
    );
  }

  // Paso: verificando (loader)
  if (step === "checking") {
    return (
      <div className="flex items-center justify-center py-8 text-zinc-500">
        <Loader size={24} className="animate-spin" />
      </div>
    );
  }

  // Paso: esperando que el usuario cambie el ícono
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
        <p className="mb-1 text-sm font-semibold text-violet-300">Verificá que es tu cuenta</p>
        <p className="text-xs text-zinc-400">
          Abrí el cliente de LoL y cambiá tu ícono de perfil al siguiente. Una vez que lo hayas cambiado, volvé y hacé click en "Ya lo cambié".
        </p>
      </div>

      {verificationIconId !== null && (
        <div className="flex items-center gap-4 rounded-xl bg-zinc-800 p-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-violet-500">
            <Image
              src={getIconImageUrl(verificationIconId)}
              alt={`Ícono N°${verificationIconId}`}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Cambiá tu ícono al</p>
            <p className="text-xl font-bold">Ícono N°{verificationIconId}</p>
            <p className="text-xs text-zinc-500">Perfil → Colección → Íconos</p>
          </div>
        </div>
      )}

      {pendingError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-sm text-red-400">
          <XCircle size={15} className="shrink-0" />
          {pendingError}
        </div>
      )}

      <Button
        onClick={handleVerifyIcon}
        className="bg-violet-500 hover:bg-violet-600"
      >
        Ya lo cambié, verificar
      </Button>

      <button
        onClick={() => setStep("input")}
        className="text-center text-sm text-zinc-500 hover:text-zinc-300"
      >
        Cancelar
      </button>
    </div>
  );
}
