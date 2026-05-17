"use client";

const GAMES = [
  { value: "all", label: "Todos" },
  { value: "League of Legends", label: "LoL" },
  { value: "Valorant", label: "VAL" },
];

interface GameFilterProps {
  value: string;
  onChange: (val: string) => void;
}

export function GameFilter({ value, onChange }: GameFilterProps) {
  return (
    <div className="flex gap-1 rounded-full bg-zinc-800 p-1">
      {GAMES.map((g) => (
        <button
          key={g.value}
          onClick={() => onChange(g.value)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            value === g.value
              ? "bg-violet-500 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}
