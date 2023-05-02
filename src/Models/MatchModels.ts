import mongoose, { Schema, model } from "mongoose";

import { iMatch } from "../Interfaces/AllInterfaces";

const MatchSchema: Schema<iMatch> = new Schema(
  {
    startPlay: {
      type: Boolean,
    },
    stopPlay: {
      type: Boolean,
    },
    teamA: {
      type: String,
    },
    teamB: {
      type: String,
    },

    teamAScore: {
      type: Number,
    },

    teamBScore: {
      type: Number,
    },

    Odds: {
      type: Number,
    },

    dateTime: {
      type: String,
    },

    scoreEntry: {
      type: String,
    },

    predict: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "predicts",
      },
    ],
  },
  { timestamps: true }
);

const MatchModels = model<iMatch>("Matches", MatchSchema);

export default MatchModels;
