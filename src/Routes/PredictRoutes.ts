import express from "express";
import {
  userPredictionTable,
  ViewAllPredictions,
  CreatePrediction,
  AllPredictions,
  PredictionTable,
} from "../Controllers/PredictController";

const router = express.Router();

router.route("/:userID/view-user-predictions").get(ViewAllPredictions);

router.route("/:userID/user-predictions").get(userPredictionTable);

router.route("/:userID/:matchID/create-prediction").post(CreatePrediction);

router.route("/prediction").get(AllPredictions);

router.route("/leader-table").get(PredictionTable);

export default router;
