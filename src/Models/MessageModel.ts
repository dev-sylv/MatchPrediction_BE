import mongoose from "mongoose";

import isEmail from "validator/lib/isEmail";
import { IMessage } from "../Interfaces/AllInterfaces";

const messageSchema = new mongoose.Schema<IMessage>(
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
    message: {
      type: String,
      required: [true, "Please enter your message"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>(
  "message_matchPrediction",
  messageSchema
);
