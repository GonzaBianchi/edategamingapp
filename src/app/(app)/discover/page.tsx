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
  lookingFor: string;
  games: { name: string; rank: string; role: string; server: string }[];
  riotAccount?: { gameName: string; tagLine: string; showStats: boolean };
}

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [gameFilter, setGameFilter] = useState<string>("all");
  const [matchData, setMatchData] = useState<{ matched: boolean; matchId?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    const params = gameFilter !== "all" ? `?game=${encodeURIComponent(gameFilter)}` : "";
    const res = await fetch(`/api/users/discover${params}`);
    const data = await res.json();
    setProfiles(data.profiles ?? []);
    setLoading(false);
  }, [gameFilter]);

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
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="text-xl font-bold">
          <span className="text-violet-400">E</span>date
        </h1>
        <GameFilter value={gameFilter} onChange={setGameFilter} />
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
