"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MatchControllers_1 = require("../Controllers/MatchControllers");
const MatchRouter = express_1.default.Router();
MatchRouter.route("/view-match").get(MatchControllers_1.viewAllMatch);
MatchRouter.route("/:userID/create-match").post(MatchControllers_1.CreateMatch);
MatchRouter.route("/:userID/:matchID/score-match").patch(MatchControllers_1.UpdateScoresOfMatches);
MatchRouter.route("/:userID/:matchID/start-match").patch(MatchControllers_1.UpdateStartMatch);
exports.default = MatchRouter;
