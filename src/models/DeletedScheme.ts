import { Schema, Document, models, model } from "mongoose";

export interface IDeletedScheme extends Document {
  title: string;
  slug: string;
  category?: string;
  ministry?: string;
  shortDescription?: string;
  officialUrl?: string;
  sources: {
    name: string;
    url: string;
    scrapedAt?: Date;
  }[];
  reason: string;
  deletedBy: string;
  deletedAt: Date;
  originalCreatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DeletedSchemeSchema = new Schema<IDeletedScheme>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      default: "General",
    },
    ministry: {
      type: String,
      default: "Government of India",
    },
    shortDescription: {
      type: String,
      default: "",
    },
    officialUrl: {
      type: String,
      default: "",
    },
    sources: {
      type: [
        {
          name: String,
          url: String,
          scrapedAt: Date,
        },
      ],
      default: [],
    },
    reason: {
      type: String,
      default: "Delisted or removed",
    },
    deletedBy: {
      type: String,
      default: "System",
    },
    deletedAt: {
      type: Date,
      default: Date.now,
      expires: 10 * 24 * 60 * 60, // Automatically deletes document from MongoDB after 10 days (864,000 seconds)
    },
    originalCreatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const DeletedScheme =
  models.DeletedScheme || model<IDeletedScheme>("DeletedScheme", DeletedSchemeSchema);

export default DeletedScheme;
