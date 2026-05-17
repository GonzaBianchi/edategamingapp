import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  users: [mongoose.Types.ObjectId, mongoose.Types.ObjectId];
  game: string;
  chatId: string | null;
  createdAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    users: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      validate: (v: unknown[]) => v.length === 2,
    },
    game: { type: String, default: "" },
    chatId: { type: String, default: null },
  },
  { timestamps: true }
);

export const Match = mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);
