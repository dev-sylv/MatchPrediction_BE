"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPredictionTable = exports.PredictionTable = exports.AllPredictions = exports.ViewAllPredictions = exports.CreatePrediction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MatchModels_1 = __importDefault(require("../Models/MatchModels"));
const PredictModels_1 = __importDefault(require("../Models/PredictModels"));
const UserModels_1 = __importDefault(require("../Models/UserModels"));
const AppError_1 = require("../Utils/AppError");
const AsyncHandler_1 = __importDefault(require("../Utils/AsyncHandler"));
// After users have signed up, they have the ability to upload their predicted score per match by a certain time deadline
exports.CreatePrediction = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID, matchID } = req.params;
    const { teamAScore, teamBScore, amount } = req.body;
    const user = yield UserModels_1.default.findById(userID);
    const match = yield MatchModels_1.default.findById(matchID);
    if (user) {
        // If the match has ended, the users can't predict again.
        if (match === null || match === void 0 ? void 0 : match.stopPlay) {
            return res.status(AppError_1.HTTPCODES.BAD_REQUEST).json({
                message: "The match has ended",
            });
        }
        else {
            // Here they can upload their prediction for a march
            const PredictMatch = yield PredictModels_1.default.create({
                teamA: match === null || match === void 0 ? void 0 : match.teamA,
                teamB: match === null || match === void 0 ? void 0 : match.teamB,
                teamAScore,
                teamBScore,
                amount,
                prize: (match === null || match === void 0 ? void 0 : match.Odds) * amount,
                scoreEntry: `${teamAScore} VS ${teamBScore}`,
            });
            user.predict.push(new mongoose_1.default.Types.ObjectId(PredictMatch === null || PredictMatch === void 0 ? void 0 : PredictMatch._id));
            user.save();
            match === null || match === void 0 ? void 0 : match.predict.push(new mongoose_1.default.Types.ObjectId(PredictMatch === null || PredictMatch === void 0 ? void 0 : PredictMatch._id));
            match === null || match === void 0 ? void 0 : match.save();
            return res.status(AppError_1.HTTPCODES.OK).json({
                message: "Prediction entry successful",
                data: PredictMatch,
            });
        }
    }
    else {
        next(new AppError_1.AppError({
            message: "User can't be found",
            httpcode: AppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
// Users can view his/her predictions
exports.ViewAllPredictions = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield UserModels_1.default.findById(userID).populate({
            path: "predict",
            options: {
                sort: { createdAt: -1 },
            },
        });
        if (!user) {
            next(new AppError_1.AppError({
                message: "User not found",
                httpcode: AppError_1.HTTPCODES.NOT_FOUND,
            }));
        }
        return res.status(AppError_1.HTTPCODES.OK).json({
            message: "User prediction",
            data: user === null || user === void 0 ? void 0 : user.predict,
        });
    }
    catch (error) {
        return res.status(AppError_1.HTTPCODES.BAD_REQUEST).json({
            message: "Error occurred in the view user prediction logic",
        });
    }
}));
// (the admin is able to view all predictions)
exports.AllPredictions = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const GetAdmin = yield UserModels_1.default.findById(adminID);
        const predictions = yield PredictModels_1.default.find();
        if (GetAdmin === null || GetAdmin === void 0 ? void 0 : GetAdmin.isAdmin) {
            if (!predictions) {
                next(new AppError_1.AppError({
                    message: "User not found",
                    httpcode: AppError_1.HTTPCODES.NOT_FOUND,
                }));
            }
        }
        else {
            next(new AppError_1.AppError({
                message: "You can't view others predictions",
                httpcode: AppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        return res.status(AppError_1.HTTPCODES.OK).json({
            message: "All User Predictions",
            data: predictions,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
}));
//the leaderboard, making comparisons between the user predict scores and the admin actual set score
exports.PredictionTable = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // To get all predictions
        const predict = yield PredictModels_1.default.find();
        if (!predict) {
            next(new AppError_1.AppError({
                message: "Couldn't find the Prediction ",
                httpcode: AppError_1.HTTPCODES.FORBIDDEN,
            }));
        }
        // To get all matches
        const match = yield MatchModels_1.default.find();
        if (!match) {
            next(new AppError_1.AppError({
                message: "Couldn't get a match ",
                httpcode: AppError_1.HTTPCODES.FORBIDDEN,
            }));
        }
        // For admin to filter the predictions scores of users with the actual scores of the match
        const table = match.filter((el) => {
            return predict.some((props) => el.scoreEntry === props.scoreEntry);
        });
        if (!table) {
            next(new AppError_1.AppError({
                message: "Couldn't get a correct prediction ",
                httpcode: AppError_1.HTTPCODES.FORBIDDEN,
            }));
        }
        return res.status(200).json({
            message: "Prediction table",
            data: table,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
}));
//user prediction
exports.userPredictionTable = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const prediction = yield UserModels_1.default.findById(userID).populate({
            path: "predict",
        });
        const match = yield MatchModels_1.default.find();
        if (!match) {
            next(new AppError_1.AppError({
                message: "couldn't get match model",
                httpcode: AppError_1.HTTPCODES.FORBIDDEN,
            }));
        }
        const table = match.filter((el) => {
            return prediction.predict.some((props) => el.scoreEntry === props.scoreEntry);
        });
        //new model will contain what is inside our predict model
        if (!table) {
            next(new AppError_1.AppError({
                message: "couldn't get user prediction",
                httpcode: AppError_1.HTTPCODES.FORBIDDEN,
            }));
        }
        return res.status(AppError_1.HTTPCODES.OK).json({
            message: " Prediction table",
            data: table,
        });
    }
    catch (error) {
        return res.status(AppError_1.HTTPCODES.BAD_GATEWAY).json({
            message: "Error",
        });
    }
}));
