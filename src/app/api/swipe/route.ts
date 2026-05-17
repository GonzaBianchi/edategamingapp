import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Match } from "@/lib/models/Match";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { targetUserId, direction, game } = await req.json();

  if (!targetUserId || !["left", "right"].includes(direction)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  await connectDB();

  const currentUserId = new mongoose.Types.ObjectId(session.user.id);
  const targetId = new mongoose.Types.ObjectId(targetUserId);

  if (direction === "left") {
    await User.findByIdAndUpdate(currentUserId, { $addToSet: { swipedLeft: targetId } });
    return NextResponse.json({ matched: false });
  }

  // Swipe right: registrar y verificar match mutuo
  await User.findByIdAndUpdate(currentUserId, { $addToSet: { swipedRight: targetId } });

  const targetUser = await User.findById(targetId).select("swipedRight").lean();
  const isMatch = targetUser?.swipedRight.some((id: mongoose.Types.ObjectId) => id.equals(currentUserId));

  if (isMatch) {
    const match = await Match.create({
      users: [currentUserId, targetId],
      game: game || "",
    });

    await User.findByIdAndUpdate(currentUserId, { $addToSet: { matches: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { matches: currentUserId } });

    return NextResponse.json({ matched: true, matchId: match._id });
  }

  return NextResponse.json({ matched: false });
}
