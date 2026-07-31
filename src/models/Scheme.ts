import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IScheme extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;

  category: string;
  ministry: string;

  officialUrl: string;

  status: "Active" | "Upcoming" | "Expired";

  createdAt: Date;
  updatedAt: Date;
}

const SchemeSchema = new Schema<IScheme>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    ministry: {
      type: String,
      required: true,
      index: true,
    },

    officialUrl: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Upcoming", "Expired"],
      default: "Active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Scheme =
  models.Scheme || model<IScheme>("Scheme", SchemeSchema);

export default Scheme;