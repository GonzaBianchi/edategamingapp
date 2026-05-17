import mongoose, { Schema, Document } from "mongoose";

export interface IGame {
  name: "League of Legends" | "Valorant";
  rank: string;
  role: string;
  server: string;
}

export interface IRiotAccount {
  gameName: string;
  tagLine: string;
  puuid: string;
  verified: boolean;
  showStats: boolean;
}

export interface IUser extends Document {
  discordId: string;
  username: string;
  avatar: string;
  photos: string[];
  bio: string;
  age: number;
  riotAccount?: IRiotAccount;
  games: IGame[];
  schedule: string[];
  lookingFor: ("duo" | "group")[];
  swipedRight: mongoose.Types.ObjectId[];
  swipedLeft: mongoose.Types.ObjectId[];
  matches: mongoose.Types.ObjectId[];
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>({
  name: { type: String, enum: ["League of Legends", "Valorant"], required: true },
  rank: { type: String, default: "" },
  role: { type: String, default: "" },
  server: { type: String, default: "" },
});

const RiotAccountSchema = new Schema<IRiotAccount>({
  gameName: { type: String, required: true },
  tagLine: { type: String, required: true },
  puuid: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  showStats: { type: Boolean, default: true },
});

const UserSchema = new Schema<IUser>(
  {
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    avatar: { type: String, default: "" },
    photos: { type: [String], default: [] },
    bio: { type: String, default: "", maxlength: 300 },
    age: { type: Number, min: 13 },
    riotAccount: { type: RiotAccountSchema },
    games: { type: [GameSchema], default: [] },
    schedule: { type: [String], default: [] },
    lookingFor: { type: [String], enum: ["duo", "group"], default: ["duo"] },
    swipedRight: [{ type: Schema.Types.ObjectId, ref: "User" }],
    swipedLeft: [{ type: Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: Schema.Types.ObjectId, ref: "User" }],
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
