"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, X, Loader, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onChange, maxPhotos = 5 }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Máximo 8MB por foto");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Error al subir la foto");
        return;
      }

      onChange([...photos, data.url]);
    } catch {
      toast.error("Error de conexión");
    } finally {
      setUploading(false);
      // Reset input para poder subir el mismo archivo de nuevo
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(url: string) {
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      onChange(photos.filter((p) => p !== url));
    } catch {
      toast.error("Error al eliminar la foto");
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((url, i) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-xl bg-zinc-800">
            <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" />
            <button
              onClick={() => handleDelete(url)}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition"
            >
              <X size={12} />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                Principal
              </span>
            )}
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition",
              uploading
                ? "border-zinc-600 bg-zinc-800/30"
                : "border-zinc-600 bg-zinc-800/30 hover:border-violet-500/60 hover:bg-violet-500/5"
            )}
          >
            {uploading ? (
              <Loader size={20} className="animate-spin text-zinc-500" />
            ) : (
              <>
                <Plus size={20} className="text-zinc-500" />
                <span className="text-[11px] text-zinc-600">Agregar</span>
              </>
            )}
          </button>
        )}

        {/* Slots vacíos para mostrar la cuadrícula completa */}
        {Array.from({ length: Math.max(0, 3 - photos.length - (photos.length < maxPhotos ? 1 : 0)) }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-800/20" />
        ))}
      </div>

      {photos.length === 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
          <ImageIcon size={12} />
          <span>La primera foto es la que aparece en las cards</span>
        </div>
      )}

      <p className="mt-2 text-right text-xs text-zinc-600">
        {photos.length}/{maxPhotos} fotos
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
