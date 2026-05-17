"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

interface MatchUser {
  _id: string;
  username: string;
  avatar: string;
  games: { name: string; rank: string; role: string }[];
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches")
      .then((r) => r.json())
      .then((d) => {
        setMatches(d.matches ?? []);
        setLoading(false);
      });
  }, []);

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
          <p className="text-sm text-zinc-600">
            Seguí explorando en Discover
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => (
            <Link
              key={match._id}
              href={`/chat/${match._id}`}
              className="flex items-center gap-4 rounded-xl bg-zinc-800/60 p-4 transition hover:bg-zinc-800"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={match.avatar || "/placeholder-avatar.png"}
                  alt={match.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{match.username}</p>
                <p className="text-sm text-zinc-400">
                  {match.games.map((g) => `${g.name === "League of Legends" ? "LoL" : "VAL"} ${g.rank}`).join(" · ")}
                </p>
              </div>
              <span className="text-xs text-zinc-600">Chat</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
