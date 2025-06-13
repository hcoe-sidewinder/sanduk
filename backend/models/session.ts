import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true },
);

sessionSchema.index({ userId: 1 });

export const Session = mongoose.model("Session", sessionSchema);
