"use client";

import { useEffect, useState, useCallback } from "react";
import { SwipeCard, SwipeActions } from "@/components/discover/SwipeCard";
import { GameFilter } from "@/components/discover/GameFilter";
import { MatchModal } from "@/components/discover/MatchModal";
import { Gamepad2 } from "lucide-react";

interface Profile {
  _id: string;
  username: string;
  avatar: string;
  photos: string[];
  bio: string;
  age: number;
  nationality: string;
  lookingFor: string[];
  games: { name: string; rank: string; roles: string[]; servers: string[] }[];
  riotAccount?: { gameName: string; tagLine: string; showStats: boolean };
}

const LOOKING_FOR_LABELS: Record<string, string> = {
  duo: "Duo",
  pareja: "Pareja",
  ambos: "Duo/pareja",
  no_se: "No sé",
};

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [gameFilter, setGameFilter] = useState<string>("all");
  const [lookingForFilter, setLookingForFilter] = useState<string>("all");
  const [serverFilter, setServerFilter] = useState<string>("all");
  const [matchData, setMatchData] = useState<{ matched: boolean; matchId?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (gameFilter !== "all") params.set("game", gameFilter);
    if (lookingForFilter !== "all") params.set("lookingFor", lookingForFilter);
    if (serverFilter !== "all") params.set("server", serverFilter);
    const query = params.toString();
    const res = await fetch(`/api/users/discover${query ? `?${query}` : ""}`);
    const data = await res.json();
    setProfiles(data.profiles ?? []);
    setLoading(false);
  }, [gameFilter, lookingForFilter, serverFilter]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  async function handleSwipe(direction: "left" | "right") {
    const current = profiles[0];
    if (!current) return;

    setProfiles((prev) => prev.slice(1));

    const res = await fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetUserId: current._id,
        direction,
        game: current.games[0]?.name ?? "",
      }),
    });

    const data = await res.json();
    if (data.matched) setMatchData(data);

    // Recargar cuando quedan pocos perfiles
    if (profiles.length <= 3) fetchProfiles();
  }

  return (
    <div className="flex h-[100dvh] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h1 className="text-xl font-bold">
          <span className="text-violet-400">E</span>date
        </h1>
        <GameFilter value={gameFilter} onChange={setGameFilter} />
      </div>

      {/* Filtros secundarios */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-none">
        {/* Qué buscan */}
        {[
          { value: "all", label: "Todos" },
          ...Object.entries(LOOKING_FOR_LABELS).map(([value, label]) => ({ value, label })),
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setLookingForFilter(value)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              lookingForFilter === value
                ? "border-violet-500 bg-violet-500/20 text-violet-300"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {label}
          </button>
        ))}
        <div className="mx-1 h-5 self-center border-l border-zinc-700" />
        {/* Servidor */}
        {["all", "LAS", "LAN", "NA", "EUW", "EUNE", "KR", "BR", "OCE", "Santiago", "Bogotá", "Miami", "Chicago", "Ciudad de México"].map((s) => (
          <button
            key={s}
            onClick={() => setServerFilter(s)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              serverFilter === s
                ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {s === "all" ? "Svr: Todos" : s}
          </button>
        ))}
      </div>

      {/* Stack de cards */}
      <div className="relative flex-1 px-4">
        {loading ? (
          <div className="flex h-full items-center justify-center text-zinc-500">
            <Gamepad2 className="animate-pulse" size={40} />
          </div>
        ) : profiles.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <Gamepad2 size={48} className="text-zinc-600" />
            <p className="text-zinc-400">No hay más perfiles por ahora</p>
            <p className="text-sm text-zinc-600">Volvé más tarde o cambiá el filtro</p>
          </div>
        ) : (
          profiles
            .slice(0, 3)
            .reverse()
            .map((profile, i) => (
              <SwipeCard
                key={profile._id}
                profile={profile}
                isTop={i === profiles.slice(0, 3).length - 1}
                onSwipe={handleSwipe}
              />
            ))
        )}
      </div>

      {/* Botones de acción */}
      {profiles.length > 0 && !loading && (
        <div className="py-6">
          <SwipeActions
            onPass={() => handleSwipe("left")}
            onLike={() => handleSwipe("right")}
          />
        </div>
      )}

      {/* Modal de match */}
      {matchData?.matched && (
        <MatchModal
          matchId={matchData.matchId!}
          onClose={() => setMatchData(null)}
        />
      )}
    </div>
  );
}
