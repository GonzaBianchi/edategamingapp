import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyRiotAccount } from "@/lib/riot";
import { getVerificationIconId, SERVER_TO_REGION } from "@/lib/constants/games";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

const RIOT_API_KEY = process.env.RIOT_API_KEY!;

// GET — Verifica que la cuenta existe y devuelve el ícono de verificación asignado
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");

  if (!gameName || !tagLine) {
    return NextResponse.json({ error: "gameName y tagLine son requeridos" }, { status: 400 });
  }

  try {
    const account = await verifyRiotAccount(gameName, tagLine);
    const verificationIconId = getVerificationIconId(session.user.id);
    return NextResponse.json({ puuid: account.puuid, verificationIconId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// POST — Comprueba si el usuario ya cambió su ícono al asignado
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { puuid, server, gameName, tagLine } = await req.json();
  if (!puuid || !server) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const region = SERVER_TO_REGION[server.toUpperCase()] ?? "la2";
  const verificationIconId = getVerificationIconId(session.user.id);

  try {
    const res = await fetch(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "No se pudo verificar el ícono. ¿El servidor es correcto?" }, { status: 400 });
    }

    const summoner = await res.json();
    const currentIcon: number = summoner.profileIconId;

    if (currentIcon !== verificationIconId) {
      return NextResponse.json({
        verified: false,
        currentIcon,
        requiredIcon: verificationIconId,
        error: `Tu ícono actual es el N°${currentIcon}, se esperaba el N°${verificationIconId}`,
      });
    }

    // ✅ Ícono coincide → guardar cuenta como verificada
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, {
      $set: {
        riotAccount: {
          gameName,
          tagLine,
          puuid,
          server,
          verified: true,
          showStats: true,
        },
      },
    });

    return NextResponse.json({ verified: true });
  } catch {
    return NextResponse.json({ error: "Error al verificar" }, { status: 500 });
  }
}
