"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { X, Heart } from "lucide-react";
import { getCountry } from "@/lib/constants/countries";

interface GameInfo {
  name: string;
  rank: string;
  role: string;
  server: string;
}

const LOOKING_FOR_LABELS: Record<string, string> = {
  duo: "Busca duo",
  pareja: "Busca pareja",
  ambos: "Duo o pareja",
  no_se: "Explorando",
};

interface Profile {
  _id: string;
  username: string;
  avatar: string;
  photos: string[];
  bio: string;
  age: number;
  nationality: string;
  lookingFor: string;
  games: GameInfo[];
  riotAccount?: { gameName: string; tagLine: string; showStats: boolean };
}

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 100;

export function SwipeCard({ profile, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const mainPhoto =
    profile.photos[0] || profile.avatar || "/placeholder-avatar.png";

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe("right");
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe("left");
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ scale: isTop ? 1 : 0.95 }}
      className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-zinc-800 shadow-2xl">
        {/* Foto principal */}
        <Image
          src={mainPhoto}
          alt={profile.username}
          fill
          className="object-cover"
          draggable={false}
        />

        {/* Overlays de like/pass */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute left-4 top-6 rotate-[-15deg] rounded-lg border-4 border-green-400 px-3 py-1 text-2xl font-black text-green-400"
        >
          LIKE
        </motion.div>
        <motion.div
          style={{ opacity: passOpacity }}
          className="absolute right-4 top-6 rotate-[15deg] rounded-lg border-4 border-red-400 px-3 py-1 text-2xl font-black text-red-400"
        >
          PASS
        </motion.div>

        {/* Info del perfil */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">
                  {profile.username}{profile.age ? `, ${profile.age}` : ""}
                </h2>
                {profile.nationality && (
                  <span className="text-xl leading-none">{getCountry(profile.nationality)?.flag}</span>
                )}
              </div>
              {profile.riotAccount && (
                <p className="text-sm text-zinc-300">
                  {profile.riotAccount.gameName}#{profile.riotAccount.tagLine}
                </p>
              )}
              {profile.lookingFor && (
                <p className="text-xs text-violet-300">{LOOKING_FOR_LABELS[profile.lookingFor]}</p>
              )}
              {profile.bio && (
                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Juegos y rangos */}
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.games.map((game, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-violet-500/20 text-violet-300 border-violet-500/30"
              >
                {game.name === "League of Legends" ? "LoL" : "VAL"} · {game.rank} · {game.role}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Botones de acción para swipe manual
export function SwipeActions({
  onPass,
  onLike,
}: {
  onPass: () => void;
  onLike: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-8">
      <button
        onClick={onPass}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500/50 bg-zinc-900 text-red-400 shadow-lg transition hover:bg-red-500/10 active:scale-95"
      >
        <X size={28} />
      </button>
      <button
        onClick={onLike}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-500/50 bg-zinc-900 text-green-400 shadow-lg transition hover:bg-green-500/10 active:scale-95"
      >
        <Heart size={28} />
      </button>
    </div>
  );
}
