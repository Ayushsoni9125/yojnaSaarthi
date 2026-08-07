import mongoose, { Schema, model, models } from "mongoose";
import "@/models/Scheme";
import "@/models/User";

export interface INotification {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "new_scheme" | "updated_scheme" | "system";
  schemeId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["new_scheme", "updated_scheme", "system"],
      default: "system",
    },

    schemeId: {
      type: Schema.Types.ObjectId,
      ref: "Scheme",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification =
  models.Notification ||
  model<INotification>("Notification", NotificationSchema);

export default Notification;