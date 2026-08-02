import mongoose, { Schema, model, models } from "mongoose";

const ActivitySchema = new Schema(
  {
    action: {
      type: String,
      required: true,
    },

    resource: {
      type: String,
      required: true,
    },

    resourceId: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    performedBy: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const Activity =
  models.Activity || model("Activity", ActivitySchema);

export default Activity;