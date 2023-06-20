"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const predictSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
    },
}, { timestamps: true });
const PredictModel = mongoose_1.default.model("predicts", predictSchema);
exports.default = PredictModel;
