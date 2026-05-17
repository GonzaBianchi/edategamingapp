import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await connectDB();

  const user = await User.findById(session.user.id)
    .populate("matches", "username avatar bio games riotAccount")
    .lean();

  return NextResponse.json({ matches: user?.matches ?? [] });
}
