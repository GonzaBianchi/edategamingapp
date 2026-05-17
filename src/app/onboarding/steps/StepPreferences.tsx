"use client";

import { OnboardingData } from "../page";

interface Props {
  data: OnboardingData;
  update: (p: Partial<OnboardingData>) => void;
}

const SCHEDULE_OPTIONS = [
  { value: "mananas", label: "Mañanas" },
  { value: "tardes", label: "Tardes" },
  { value: "noches", label: "Noches" },
  { value: "madrugadas", label: "Madrugadas" },
  { value: "finde", label: "Fines de semana" },
];

export function StepPreferences({ data, update }: Props) {
  function toggleSchedule(value: string) {
    const current = data.schedule;
    if (current.includes(value)) {
      update({ schedule: current.filter((s) => s !== value) });
    } else {
      update({ schedule: [...current, value] });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">¿Cuándo jugás?</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Seleccioná los horarios en que solés jugar
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SCHEDULE_OPTIONS.map(({ value, label }) => {
          const selected = data.schedule.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggleSchedule(value)}
              className={`rounded-xl border-2 py-3 text-sm font-medium transition-all ${
                selected
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
        <p className="mb-1 text-sm font-medium text-zinc-300">¿Qué buscás?</p>
        <p className="text-sm text-zinc-400">
          Por ahora podés buscar <span className="text-violet-400 font-medium">duo o pareja</span>.
          La búsqueda de grupos llega próximamente.
        </p>
      </div>
    </div>
  );
}
