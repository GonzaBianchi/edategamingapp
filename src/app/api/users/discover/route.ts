import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const game = searchParams.get("game"); // filtro opcional por juego

  await connectDB();

  const currentUser = await User.findById(session.user.id)
    .select("swipedRight swipedLeft matches")
    .lean();

  if (!currentUser) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const excludeIds = [
    new mongoose.Types.ObjectId(session.user.id),
    ...currentUser.swipedRight,
    ...currentUser.swipedLeft,
    ...currentUser.matches,
  ];

  const filter: Record<string, unknown> = {
    _id: { $nin: excludeIds },
    onboardingComplete: true,
    lookingFor: "duo",
  };

  if (game) {
    filter["games.name"] = game;
  }

  const profiles = await User.find(filter)
    .select("username avatar photos bio age games riotAccount schedule")
    .limit(20)
    .lean();

  return NextResponse.json({ profiles });
}
