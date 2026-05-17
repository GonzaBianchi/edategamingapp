"use client";

import { OnboardingData, GameData } from "../page";

interface Props {
  data: OnboardingData;
  update: (p: Partial<OnboardingData>) => void;
}

const GAMES_CONFIG = {
  "League of Legends": {
    ranks: ["Hierro", "Bronce", "Plata", "Oro", "Platino", "Esmeralda", "Diamante", "Maestro", "Gran Maestro", "Desafiante"],
    roles: ["Top", "Jungla", "Mid", "ADC", "Support"],
    servers: ["LAS", "LAN", "NA", "EUW", "EUNE", "KR", "BR", "OCE"],
  },
  Valorant: {
    ranks: ["Hierro", "Bronce", "Plata", "Oro", "Platino", "Diamante", "Ascendente", "Inmortal", "Radiante"],
    roles: ["Duelista", "Iniciador", "Centinela", "Controlador"],
    servers: ["Santiago", "Bogotá", "Miami", "Chicago", "Ciudad de México"],
  },
} as const;

type GameName = keyof typeof GAMES_CONFIG;
const GAME_NAMES = Object.keys(GAMES_CONFIG) as GameName[];

export function StepGames({ data, update }: Props) {
  function toggleGame(name: GameName) {
    const exists = data.games.find((g) => g.name === name);
    if (exists) {
      update({ games: data.games.filter((g) => g.name !== name) });
    } else {
      update({
        games: [
          ...data.games,
          { name, rank: "", role: "", server: "" },
        ],
      });
    }
  }

  function updateGame(name: GameName, field: keyof GameData, value: string) {
    update({
      games: data.games.map((g) => (g.name === name ? { ...g, [field]: value } : g)),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Tus juegos</h2>
        <p className="mt-1 text-sm text-zinc-400">Seleccioná los juegos que jugás</p>
      </div>

      <div className="flex gap-3">
        {GAME_NAMES.map((name) => {
          const selected = data.games.some((g) => g.name === name);
          return (
            <button
              key={name}
              onClick={() => toggleGame(name)}
              className={`flex-1 rounded-xl border-2 py-3 text-sm font-medium transition-all ${
                selected
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {name === "League of Legends" ? "League of Legends" : "Valorant"}
            </button>
          );
        })}
      </div>

      {data.games.map((game) => {
        const config = GAMES_CONFIG[game.name];
        return (
          <div key={game.name} className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
            <p className="mb-3 font-semibold text-violet-400">
              {game.name === "League of Legends" ? "LoL" : "Valorant"}
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Rango</label>
                <select
                  value={game.rank}
                  onChange={(e) => updateGame(game.name, "rank", e.target.value)}
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                >
                  <option value="">Seleccioná tu rango</option>
                  {config.ranks.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Rol / Agente</label>
                <select
                  value={game.role}
                  onChange={(e) => updateGame(game.name, "role", e.target.value)}
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                >
                  <option value="">Seleccioná tu rol</option>
                  {config.roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Servidor</label>
                <select
                  value={game.server}
                  onChange={(e) => updateGame(game.name, "server", e.target.value)}
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                >
                  <option value="">Seleccioná tu servidor</option>
                  {config.servers.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      })}

      {data.games.length === 0 && (
        <p className="text-center text-sm text-zinc-600">Seleccioná al menos un juego para continuar</p>
      )}
    </div>
  );
}
