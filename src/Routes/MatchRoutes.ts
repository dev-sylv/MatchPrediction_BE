import express from "express";
import {
  CreateMatch,
  UpdateScoresOfMatches,
  UpdateStartMatch,
  viewAllMatch,
} from "../Controllers/MatchControllers";

const MatchRouter = express.Router();

MatchRouter.route("/view-match").get(viewAllMatch);

MatchRouter.route("/:userID/create-match").post(CreateMatch);

MatchRouter.route("/:userID/:matchID/score-match").patch(UpdateScoresOfMatches);

MatchRouter.route("/:userID/:matchID/start-match").patch(UpdateStartMatch);

export default MatchRouter;
