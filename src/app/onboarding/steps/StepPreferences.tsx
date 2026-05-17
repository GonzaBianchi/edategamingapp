"use client";

import { LOOKING_FOR_OPTIONS } from "@/lib/constants/countries";
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
    update({
      schedule: current.includes(value)
        ? current.filter((s) => s !== value)
        : [...current, value],
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Preferencias</h2>
        <p className="mt-1 text-sm text-zinc-400">Casi terminamos...</p>
      </div>

      {/* ¿Qué buscás? */}
      <div>
        <p className="mb-3 text-sm font-medium text-zinc-300">¿Qué buscás?</p>
        <div className="grid grid-cols-2 gap-2">
          {LOOKING_FOR_OPTIONS.map(({ value, label, description }) => {
            const selected = data.lookingFor === value;
            return (
              <button
                key={value}
                onClick={() => update({ lookingFor: value })}
                className={`flex flex-col items-start rounded-xl border-2 px-4 py-3 text-left transition-all ${
                  selected
                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-xs opacity-70">{description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Horarios */}
      <div>
        <p className="mb-3 text-sm font-medium text-zinc-300">¿Cuándo jugás?</p>
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
      </div>
    </div>
  );
}
