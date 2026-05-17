// Chat — UI placeholder. La lógica real (Pusher/Socket.io) va en una próxima implementación.

import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="flex h-[100dvh] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
        <Link href="/matches" className="text-zinc-400 hover:text-zinc-200">
          <ArrowLeft size={22} />
        </Link>
        <div className="h-9 w-9 rounded-full bg-zinc-700" />
        <div>
          <p className="font-semibold">Usuario</p>
          <p className="text-xs text-zinc-500">Match</p>
        </div>
      </div>

      {/* Mensajes — placeholder */}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-8">
        <div className="rounded-xl bg-zinc-800/60 px-6 py-4">
          <p className="text-sm text-zinc-400">
            El chat estará disponible próximamente.
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Por ahora usá Discord para comunicarte con tu match.
          </p>
        </div>
      </div>

      {/* Input — placeholder */}
      <div className="flex items-center gap-3 border-t border-zinc-800 px-4 py-3">
        <div className="flex-1 rounded-full bg-zinc-800 px-4 py-2.5 text-sm text-zinc-500">
          Escribí un mensaje...
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white opacity-50">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
