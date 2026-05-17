import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_PHOTOS = 5;
const MAX_SIZE_MB = 8;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No se encontró archivo" }, { status: 400 });

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Máximo ${MAX_SIZE_MB}MB por foto` }, { status: 400 });
  }

  // Verificar que no supere el límite de fotos
  await connectDB();
  const user = await User.findById(session.user.id).select("photos").lean();
  if ((user?.photos?.length ?? 0) >= MAX_PHOTOS) {
    return NextResponse.json({ error: `Máximo ${MAX_PHOTOS} fotos` }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `edate/users/${session.user.id}`,
            transformation: [
              { width: 800, height: 800, crop: "fill", gravity: "face", quality: "auto" },
            ],
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) reject(error ?? new Error("Upload failed"));
            else resolve(result as { secure_url: string; public_id: string });
          }
        )
        .end(buffer);
    }
  );

  // Guardar URL en la DB
  await User.findByIdAndUpdate(session.user.id, {
    $push: { photos: result.secure_url },
  });

  return NextResponse.json({ url: result.secure_url });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL requerida" }, { status: 400 });

  // Extraer public_id de la URL de Cloudinary para eliminarla
  const publicId = url.split("/upload/")[1]?.replace(/\.[^.]+$/, "");
  if (publicId) {
    await cloudinary.uploader.destroy(publicId).catch(() => null);
  }

  await connectDB();
  await User.findByIdAndUpdate(session.user.id, { $pull: { photos: url } });

  return NextResponse.json({ success: true });
}
