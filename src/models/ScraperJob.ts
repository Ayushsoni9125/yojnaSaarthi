import { Schema, model, models, Document } from "mongoose";

export interface IScraperJob extends Document {
  source: string;
  status: "Running" | "Completed" | "Failed";

  startedAt: Date;
  finishedAt?: Date;

  totalSchemes: number;
  importedSchemes: number;
  failedSchemes: number;

  currentOffset: number;

  error?: string;
}

const ScraperJobSchema = new Schema<IScraperJob>(
  {
    source: {
      type: String,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Running", "Completed", "Failed"],
      default: "Running",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    finishedAt: Date,

    totalSchemes: {
      type: Number,
      default: 0,
    },

    importedSchemes: {
      type: Number,
      default: 0,
    },

    failedSchemes: {
      type: Number,
      default: 0,
    },

    currentOffset: {
      type: Number,
      default: 0,
    },

    error: String,
  },
  {
    timestamps: true,
  }
);

export default models.ScraperJob ||
  model<IScraperJob>("ScraperJob", ScraperJobSchema);