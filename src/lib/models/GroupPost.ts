import mongoose, { Schema, Document } from "mongoose";

// Modelo listo para implementación futura de grupos/LFG
export interface IGroupPost extends Document {
  createdBy: mongoose.Types.ObjectId;
  game: string;
  description: string;
  lookingFor: { role: string; spots: number }[];
  members: mongoose.Types.ObjectId[];
  status: "open" | "full" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const GroupPostSchema = new Schema<IGroupPost>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    game: { type: String, required: true },
    description: { type: String, default: "", maxlength: 500 },
    lookingFor: [
      {
        role: { type: String, required: true },
        spots: { type: Number, default: 1 },
      },
    ],
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["open", "full", "closed"], default: "open" },
  },
  { timestamps: true }
);

export const GroupPost =
  mongoose.models.GroupPost || mongoose.model<IGroupPost>("GroupPost", GroupPostSchema);
