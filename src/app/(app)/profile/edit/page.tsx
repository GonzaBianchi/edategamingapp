"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { PhotoUpload } from "@/components/profile/PhotoUpload";
import { RiotVerifySection } from "@/components/profile/RiotVerifySection";
import { GAME_NAMES, GAMES_CONFIG, GameName } from "@/lib/constants/games";
import { COUNTRIES, LOOKING_FOR_OPTIONS } from "@/lib/constants/countries";

interface GameData {
  name: GameName;
  rank: string;
  role: string;
  server: string;
}

interface RiotAccount {
  gameName: string;
  tagLine: string;
  puuid: string;
  verified: boolean;
  showStats: boolean;
}

interface ProfileData {
  photos: string[];
  bio: string;
  age: number | "";
  nationality: string;
  lookingFor: string;
  riotAccount: RiotAccount | null;
  games: GameData[];
  schedule: string[];
}

const SCHEDULE_OPTIONS = [
  { value: "mananas", label: "Mañanas" },
  { value: "tardes", label: "Tardes" },
  { value: "noches", label: "Noches" },
  { value: "madrugadas", label: "Madrugadas" },
  { value: "finde", label: "Fines de semana" },
];

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    photos: [], bio: "", age: "", nationality: "", lookingFor: "no_se", riotAccount: null, games: [], schedule: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setProfile({
            photos: d.user.photos ?? [],
            bio: d.user.bio ?? "",
            age: d.user.age ?? "",
            nationality: d.user.nationality ?? "",
            lookingFor: d.user.lookingFor ?? "no_se",
            riotAccount: d.user.riotAccount ?? null,
            games: d.user.games ?? [],
            schedule: d.user.schedule ?? [],
          });
        }
        setLoading(false);
      });
  }, []);

  function update(partial: Partial<ProfileData>) {
    setProfile((prev) => ({ ...prev, ...partial }));
  }

  function toggleGame(name: GameName) {
    const exists = profile.games.find((g) => g.name === name);
    if (exists) {
      update({ games: profile.games.filter((g) => g.name !== name) });
    } else {
      update({ games: [...profile.games, { name, rank: "", role: "", server: "" }] });
    }
  }

  function updateGame(name: GameName, field: keyof GameData, value: string) {
    update({
      games: profile.games.map((g) => (g.name === name ? { ...g, [field]: value } : g)),
    });
  }

  function toggleSchedule(value: string) {
    const current = profile.schedule;
    update({
      schedule: current.includes(value) ? current.filter((s) => s !== value) : [...current, value],
    });
  }

  async function handleSave() {
    if (profile.age !== "" && Number(profile.age) < 13) {
      toast.error("Debés tener al menos 13 años");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: profile.bio,
          age: profile.age !== "" ? Number(profile.age) : undefined,
          nationality: profile.nationality,
          lookingFor: profile.lookingFor,
          games: profile.games,
          schedule: profile.schedule,
          riotAccount: profile.riotAccount,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Perfil guardado");
      router.push("/profile");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const lolGame = profile.games.find((g) => g.name === "League of Legends");

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-zinc-600">Cargando...</div>;
  }

  return (
    <div className="px-5 py-6 pb-28">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-200">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">Editar perfil</h1>
      </div>

      <div className="flex flex-col gap-6">

        {/* Fotos */}
        <section>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Fotos</p>
          <PhotoUpload
            photos={profile.photos}
            onChange={(photos) => update({ photos })}
          />
        </section>

        {/* Datos personales */}
        <section className="rounded-xl bg-zinc-800/60 p-4">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Datos personales</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">País</label>
              <select
                value={profile.nationality}
                onChange={(e) => update({ nationality: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition-colors"
              >
                <option value="">Seleccioná tu país</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Edad</label>
              <input
                type="number"
                min={13}
                max={99}
                placeholder="Ej: 20"
                value={profile.age}
                onChange={(e) => update({ age: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">¿Qué buscás?</label>
              <div className="grid grid-cols-2 gap-2">
                {LOOKING_FOR_OPTIONS.map(({ value, label, description }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update({ lookingFor: value })}
                    className={`flex flex-col items-start rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                      profile.lookingFor === value
                        ? "border-violet-500 bg-violet-500/10 text-violet-300"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-xs opacity-70">{description}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Bio</label>
              <textarea
                rows={3}
                maxLength={300}
                placeholder="Contá algo sobre vos o tu estilo de juego..."
                value={profile.bio}
                onChange={(e) => update({ bio: e.target.value })}
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 transition-colors"
              />
              <p className="mt-1 text-right text-xs text-zinc-600">{profile.bio.length}/300</p>
            </div>
          </div>
        </section>

        {/* Cuenta Riot */}
        <section className="rounded-xl bg-zinc-800/60 p-4">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Cuenta Riot</p>
          <RiotVerifySection
            riotAccount={profile.riotAccount}
            lolServer={lolGame?.server ?? "LAS"}
            onVerified={(account) => update({ riotAccount: account })}
            onUnlink={() => update({ riotAccount: null })}
          />
        </section>

        {/* Juegos */}
        <section className="rounded-xl bg-zinc-800/60 p-4">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Juegos</p>

          <div className="mb-4 flex gap-2">
            {GAME_NAMES.map((name) => {
              const selected = profile.games.some((g) => g.name === name);
              return (
                <button
                  key={name}
                  onClick={() => toggleGame(name)}
                  className={`flex-1 rounded-lg border-2 py-2.5 text-sm font-medium transition-all ${
                    selected
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {name === "League of Legends" ? "LoL" : "Valorant"}
                </button>
              );
            })}
          </div>

          {profile.games.map((game) => {
            const config = GAMES_CONFIG[game.name];
            return (
              <div key={game.name} className="mb-3 rounded-lg border border-zinc-700 p-3">
                <p className="mb-2.5 text-sm font-semibold text-violet-400">
                  {game.name === "League of Legends" ? "League of Legends" : "Valorant"}
                </p>
                <div className="flex flex-col gap-2">
                  {(["rank", "role", "server"] as const).map((field) => (
                    <select
                      key={field}
                      value={game[field]}
                      onChange={(e) => updateGame(game.name, field, e.target.value)}
                      className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                    >
                      <option value="">
                        {field === "rank" ? "Rango" : field === "role" ? "Rol" : "Servidor"}
                      </option>
                      {config[`${field}s` as "ranks" | "roles" | "servers"].map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Horarios */}
        <section className="rounded-xl bg-zinc-800/60 p-4">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">¿Cuándo jugás?</p>
          <div className="grid grid-cols-2 gap-2">
            {SCHEDULE_OPTIONS.map(({ value, label }) => {
              const selected = profile.schedule.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleSchedule(value)}
                  className={`rounded-xl border-2 py-3 text-sm font-medium transition-all ${
                    selected
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Botón guardar fijo abajo */}
      <div className="fixed bottom-20 left-0 right-0 px-5">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full gap-2 bg-violet-500 hover:bg-violet-600 shadow-lg"
        >
          <Save size={16} />
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
