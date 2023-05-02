import mongoose from "mongoose";

import { Ipredict } from "../Interfaces/AllInterfaces";

interface predict extends Ipredict, mongoose.Document {}

const predictSchema = new mongoose.Schema(
  {
    teamA: {
      type: String,
    },
    teamB: {
      type: String,
    },

    teamAScore: {
      type: Number,
    },

    amount: {
      type: Number,
    },

    prize: {
      type: Number,
    },

    teamBScore: {
      type: Number,
    },

    dateTime: {
      type: String,
    },

    scoreEntry: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const PredictModel = mongoose.model<predict>("predicts", predictSchema);

export default PredictModel;
