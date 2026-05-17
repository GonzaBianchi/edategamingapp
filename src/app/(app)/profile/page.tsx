"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Pencil, CheckCircle, User } from "lucide-react";
import { PhotoUpload } from "@/components/profile/PhotoUpload";

interface UserProfile {
  username: string;
  avatar: string;
  photos: string[];
  bio: string;
  age: number;
  riotAccount?: {
    gameName: string;
    tagLine: string;
    verified: boolean;
    showStats: boolean;
  };
  games: { name: string; rank: string; role: string; server: string }[];
  schedule: string[];
}

const SCHEDULE_LABELS: Record<string, string> = {
  mananas: "Mañanas",
  tardes: "Tardes",
  noches: "Noches",
  madrugadas: "Madrugadas",
  finde: "Fines de semana",
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((d) => { setProfile(d.user); setLoading(false); });
  }, []);

  const mainPhoto = profile?.avatar || session?.user?.image || null;

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <User className="animate-pulse text-zinc-600" size={36} />
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <Link href="/profile/edit">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200">
            <Pencil size={18} />
          </Button>
        </Link>
      </div>

      {/* Avatar y nombre */}
      <div className="flex items-center gap-4 rounded-xl bg-zinc-800/60 p-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-700">
          {mainPhoto ? (
            <Image src={mainPhoto} alt="Avatar" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-500">
              <User size={28} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold truncate">{profile?.username || session?.user?.name}</p>
          {profile?.age && (
            <p className="text-sm text-zinc-400">{profile.age} años</p>
          )}
          {profile?.bio && (
            <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Fotos */}
      {(profile?.photos?.length ?? 0) > 0 && (
        <div className="mt-4 rounded-xl bg-zinc-800/60 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Fotos</p>
          <PhotoUpload
            photos={profile?.photos ?? []}
            onChange={(photos) => setProfile((p) => p ? { ...p, photos } : p)}
          />
        </div>
      )}

      {/* Cuenta Riot */}
      <div className="mt-4 rounded-xl bg-zinc-800/60 p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Cuenta Riot</p>
        {profile?.riotAccount ? (
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400 shrink-0" />
            <span className="font-medium">
              {profile.riotAccount.gameName}
              <span className="text-zinc-500">#{profile.riotAccount.tagLine}</span>
            </span>
            {profile.riotAccount.showStats && (
              <Badge variant="secondary" className="ml-auto text-[10px]">Stats visibles</Badge>
            )}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No vinculada</p>
        )}
      </div>

      {/* Juegos */}
      {(profile?.games?.length ?? 0) > 0 && (
        <div className="mt-4 rounded-xl bg-zinc-800/60 p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Juegos</p>
          <div className="flex flex-col gap-3">
            {profile!.games.map((game) => (
              <div key={game.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {game.name === "League of Legends" ? "League of Legends" : "Valorant"}
                </span>
                <div className="flex gap-1.5">
                  {game.rank && <Badge variant="outline" className="border-zinc-600 text-xs">{game.rank}</Badge>}
                  {game.role && <Badge variant="outline" className="border-zinc-600 text-xs">{game.role}</Badge>}
                  {game.server && <Badge variant="outline" className="border-zinc-600 text-xs">{game.server}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Horarios */}
      {(profile?.schedule?.length ?? 0) > 0 && (
        <div className="mt-4 rounded-xl bg-zinc-800/60 p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Horarios</p>
          <div className="flex flex-wrap gap-2">
            {profile!.schedule.map((s) => (
              <Badge key={s} variant="secondary" className="bg-zinc-700 text-zinc-300">
                {SCHEDULE_LABELS[s] ?? s}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Button
          variant="ghost"
          className="w-full gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut size={16} />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
