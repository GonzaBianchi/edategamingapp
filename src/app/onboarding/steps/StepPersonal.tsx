"use client";

import { PhotoUpload } from "@/components/profile/PhotoUpload";
import { COUNTRIES } from "@/lib/constants/countries";
import { OnboardingData } from "../page";

interface Props {
  data: OnboardingData;
  update: (p: Partial<OnboardingData>) => void;
}

export function StepPersonal({ data, update }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Contanos sobre vos</h2>
        <p className="mt-1 text-sm text-zinc-400">Esta info va a aparecer en tu perfil</p>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Fotos <span className="text-zinc-500 font-normal">(opcional, hasta 5)</span>
          </label>
          <PhotoUpload
            photos={data.photos}
            onChange={(photos) => update({ photos })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            País
          </label>
          <select
            value={data.nationality}
            onChange={(e) => update({ nationality: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition-colors"
          >
            <option value="">Seleccioná tu país</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Edad <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            min={13}
            max={99}
            placeholder="Ej: 20"
            value={data.age}
            onChange={(e) => update({ age: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 transition-colors"
          />
          {Number(data.age) > 0 && Number(data.age) < 13 && (
            <p className="mt-1 text-xs text-red-400">Debés tener al menos 13 años</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Bio <span className="text-zinc-500 font-normal">(opcional)</span>
          </label>
          <textarea
            rows={3}
            maxLength={300}
            placeholder="Contá algo sobre vos o tu estilo de juego..."
            value={data.bio}
            onChange={(e) => update({ bio: e.target.value })}
            className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 transition-colors"
          />
          <p className="mt-1 text-right text-xs text-zinc-600">{data.bio.length}/300</p>
        </div>
      </div>
    </div>
  );
}
