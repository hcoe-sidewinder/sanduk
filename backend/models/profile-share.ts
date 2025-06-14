import mongoose from "mongoose";

export interface IProfileShareSchema extends Document {
  member: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  expiresAt: Date;
}

const profileShareSchema = new mongoose.Schema(
  {
    paitent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who is sharing their profile
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the Doctor who is receiving the shared profile
      required: true,
    },
    // This is the key field for time-limiting
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      required: true,
    },
  },
  { timestamps: true }, // Good for tracking when the sharing was created
);

// **Crucial: Define a TTL index on the 'expiresAt' field**
profileShareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ProfileShare = mongoose.model("ProfileShare", profileShareSchema);
