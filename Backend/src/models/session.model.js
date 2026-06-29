import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },

    refreshToken: {
      type: String,
    },

    device: {
      type: String,
      default: "unknown",
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel;
