// Grupos/LFG — UI placeholder. La lógica completa va en una próxima implementación.

import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GroupsPage() {
  return (
    <div className="px-5 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Grupos</h1>
        <Button
          size="sm"
          className="gap-2 bg-violet-500 hover:bg-violet-600"
          disabled
        >
          <Plus size={16} />
          Crear
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Users size={52} className="text-zinc-600" />
        <div>
          <p className="font-semibold text-zinc-300">Próximamente</p>
          <p className="mt-1 text-sm text-zinc-500">
            Buscá o creá grupos para rankear, casual y más.
          </p>
        </div>
        <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-xs text-zinc-600 max-w-xs">
          <p className="font-medium text-zinc-500 mb-1">Roadmap:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Publicar búsqueda de grupo</li>
            <li>Aplicar a grupos existentes</li>
            <li>Filtro por juego y rol</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
