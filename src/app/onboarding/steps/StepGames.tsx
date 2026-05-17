"use client";

import { GAMES_CONFIG, GAME_NAMES, GameName } from "@/lib/constants/games";
import { OnboardingData } from "../page";

interface Props {
  data: OnboardingData;
  update: (p: Partial<OnboardingData>) => void;
}

export function StepGames({ data, update }: Props) {
  function toggleGame(name: GameName) {
    const exists = data.games.find((g) => g.name === name);
    if (exists) {
      update({ games: data.games.filter((g) => g.name !== name) });
    } else {
      update({ games: [...data.games, { name, rank: "", roles: [], servers: [] }] });
    }
  }

  function updateGame(name: GameName, field: "rank", value: string) {
    update({ games: data.games.map((g) => (g.name === name ? { ...g, [field]: value } : g)) });
  }

  function toggleRole(name: GameName, role: string) {
    update({
      games: data.games.map((g) => {
        if (g.name !== name) return g;
        const roles = g.roles.includes(role)
          ? g.roles.filter((r) => r !== role)
          : [...g.roles, role];
        return { ...g, roles };
      }),
    });
  }

  function toggleServer(name: GameName, server: string) {
    update({
      games: data.games.map((g) => {
        if (g.name !== name) return g;
        const servers = g.servers.includes(server)
          ? g.servers.filter((s) => s !== server)
          : [...g.servers, server];
        return { ...g, servers };
      }),
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
                <label className="mb-1.5 block text-xs text-zinc-400">
                  {game.name === "League of Legends" ? "Roles" : "Agentes"}{" "}
                  <span className="text-zinc-600">(podés elegir varios)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {config.roles.map((r) => {
                    const active = (game.roles ?? []).includes(r);
                    return (
                      <button
                        key={r}
                        onClick={() => toggleRole(game.name, r)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          active
                            ? "border-violet-500 bg-violet-500/15 text-violet-300"
                            : "border-zinc-600 text-zinc-400 hover:border-zinc-500"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400">
                  Servidores <span className="text-zinc-600">(podés elegir varios)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {config.servers.map((s) => {
                    const active = game.servers.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleServer(game.name, s)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          active
                            ? "border-violet-500 bg-violet-500/15 text-violet-300"
                            : "border-zinc-600 text-zinc-400 hover:border-zinc-500"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
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
