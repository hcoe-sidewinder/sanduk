import mongoose from "mongoose";

const fcmTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fcmToken: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true },
);

fcmTokenSchema.index({ userId: 1 });

export const FCMToken = mongoose.model("FCMToken", fcmTokenSchema);
