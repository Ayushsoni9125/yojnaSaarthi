import mongoose, { Schema, model, models } from "mongoose";

const BookmarkSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate bookmarks
BookmarkSchema.index(
  { userId: 1, schemeId: 1 },
  { unique: true }
);

const Bookmark =
  models.Bookmark ||
  model("Bookmark", BookmarkSchema);

export default Bookmark;