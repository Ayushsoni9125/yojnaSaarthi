import mongoose, { Schema, model, models } from "mongoose";

const RecentlyViewedSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schemeId: {
      type: Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index to prevent duplicate records per user-scheme pair
RecentlyViewedSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

const RecentlyViewed =
  models.RecentlyViewed || model("RecentlyViewed", RecentlyViewedSchema);

export default RecentlyViewed;
