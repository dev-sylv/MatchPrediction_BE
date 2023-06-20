"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PredictController_1 = require("../Controllers/PredictController");
const router = express_1.default.Router();
router.route("/:userID/view-user-predictions").get(PredictController_1.ViewAllPredictions);
router.route("/:userID/user-predictions").get(PredictController_1.userPredictionTable);
router.route("/:userID/:matchID/create-prediction").post(PredictController_1.CreatePrediction);
router.route("/prediction").get(PredictController_1.AllPredictions);
router.route("/leader-table").get(PredictController_1.PredictionTable);
exports.default = router;
