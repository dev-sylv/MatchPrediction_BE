import mongoose from "mongoose";

import isEmail from "validator/lib/isEmail";
import { iUser } from "../Interfaces/AllInterfaces";

const UserSchema = new mongoose.Schema<iUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter your email"],
      lowercase: true,
      trim: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
    },

    predict: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "predicts",
      },
    ],
    OTP: {
      type: String,
    },
    token: {
      type: String,
    },
    verified: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model<iUser>("Users", UserSchema);
