"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, UserX } from "lucide-react";
import { toast } from "sonner";
import { getCountry } from "@/lib/constants/countries";

interface MatchUser {
  _id: string;
  username: string;
  avatar: string;
  photos: string[];
  nationality: string;
  lookingFor: string;
  games: { name: string; rank: string; role: string }[];
}

const LOOKING_FOR_LABELS: Record<string, string> = {
  duo: "Busca duo",
  pareja: "Busca pareja",
  ambos: "Duo o pareja",
  no_se: "Explorando",
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmUnmatch, setConfirmUnmatch] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/matches")
      .then((r) => r.json())
      .then((d) => { setMatches(d.matches ?? []); setLoading(false); });
  }, []);

  async function handleUnmatch(userId: string) {
    const res = await fetch(`/api/matches/${userId}`, { method: "DELETE" });
    if (res.ok) {
      setMatches((prev) => prev.filter((m) => m._id !== userId));
      toast.success("Match cancelado");
    } else {
      toast.error("No se pudo cancelar el match");
    }
    setConfirmUnmatch(null);
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-zinc-500">
        <Heart className="animate-pulse" size={36} />
      </div>
    );
  }

  return (
    <div className="px-5 py-6">
      <h1 className="mb-6 text-2xl font-bold">Tus Matches</h1>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Heart size={48} className="text-zinc-600" />
          <p className="text-zinc-400">Todavía no tenés matches</p>
          <p className="text-sm text-zinc-600">Seguí explorando en Discover</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => {
            const photo = match.photos?.[0] || match.avatar;
            const country = getCountry(match.nationality);

            return (
              <div key={match._id} className="relative">
                <Link
                  href={`/chat/${match._id}`}
                  className="flex items-center gap-4 rounded-xl bg-zinc-800/60 p-4 pr-14 transition hover:bg-zinc-800"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-700">
                    {photo && (
                      <Image src={photo} alt={match.username} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold truncate">{match.username}</p>
                      {country && <span className="text-base">{country.flag}</span>}
                    </div>
                    <p className="text-xs text-zinc-400">
                      {match.games.map((g) =>
                        `${g.name === "League of Legends" ? "LoL" : "VAL"}${g.rank ? ` ${g.rank}` : ""}`
                      ).join(" · ")}
                    </p>
                    {match.lookingFor && (
                      <p className="mt-0.5 text-xs text-violet-400">
                        {LOOKING_FOR_LABELS[match.lookingFor] ?? ""}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Botón de cancelar match */}
                <button
                  onClick={() => setConfirmUnmatch(match._id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  title="Cancelar match"
                >
                  <UserX size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación */}
      {confirmUnmatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold">¿Cancelar match?</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Se va a eliminar el match y no van a poder comunicarse más.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmUnmatch(null)}
                className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUnmatch(confirmUnmatch)}
                className="flex-1 rounded-lg bg-red-500/20 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/30 transition"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
