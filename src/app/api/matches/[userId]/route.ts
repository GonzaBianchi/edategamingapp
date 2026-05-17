import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Match } from "@/lib/models/Match";
import mongoose from "mongoose";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { userId: targetUserId } = await params;

  await connectDB();

  const currentId = new mongoose.Types.ObjectId(session.user.id);
  const targetId = new mongoose.Types.ObjectId(targetUserId);

  await Promise.all([
    User.findByIdAndUpdate(currentId, { $pull: { matches: targetId } }),
    User.findByIdAndUpdate(targetId, { $pull: { matches: currentId } }),
    Match.deleteOne({ users: { $all: [currentId, targetId] } }),
  ]);

  return NextResponse.json({ success: true });
}
