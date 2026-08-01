import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider: "google" | "credentials";
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    image: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: ["google", "credentials"],
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User =
  models.User || model<IUser>("User", UserSchema);

export default User;