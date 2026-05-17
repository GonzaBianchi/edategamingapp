import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id)
    .select("-swipedRight -swipedLeft -matches")
    .lean();

  return NextResponse.json({ user });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { age, bio, photos, nationality, riotAccount, games, schedule, lookingFor, onboardingComplete } = body;

  if (age !== undefined && age < 13) {
    return NextResponse.json({ error: "Debés tener al menos 13 años" }, { status: 400 });
  }

  await connectDB();

  const updated = await User.findByIdAndUpdate(
    session.user.id,
    { $set: { age, bio, photos, nationality, riotAccount, games, schedule, lookingFor, onboardingComplete } },
    { new: true, runValidators: true }
  ).lean();

  return NextResponse.json({ user: updated });
}
