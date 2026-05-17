"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface MatchModalProps {
  matchId: string;
  onClose: () => void;
}

export function MatchModal({ matchId, onClose }: MatchModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl bg-zinc-900 p-8 text-center shadow-2xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/20">
          <Heart className="fill-violet-400 text-violet-400" size={40} />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-violet-400">Match!</h2>
          <p className="mt-2 text-zinc-400">Les gustaron mutuamente. Ya pueden hablar.</p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button
            className="w-full bg-violet-500 hover:bg-violet-600"
            onClick={() => {
              onClose();
              router.push(`/chat/${matchId}`);
            }}
          >
            Ir al chat
          </Button>
          <Button variant="ghost" className="w-full text-zinc-400" onClick={onClose}>
            Seguir explorando
          </Button>
        </div>
      </div>
    </div>
  );
}
