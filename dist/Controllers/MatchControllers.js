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
exports.UpdateScoresOfMatches = exports.UpdateStartMatch = exports.viewAllMatch = exports.CreateMatch = void 0;
const MatchModels_1 = __importDefault(require("../Models/MatchModels"));
const UserModels_1 = __importDefault(require("../Models/UserModels"));
const AppError_1 = require("../Utils/AppError");
const AsyncHandler_1 = __importDefault(require("../Utils/AsyncHandler"));
// ADMIN CREATE MATCHES && Allow an admin upload matches for the particular match week
exports.CreateMatch = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamA, teamB, teamAScore, teamBScore, Odds } = req.body;
    const user = yield UserModels_1.default.findById(req.params.userID);
    const UploadMatchDate = new Date().toDateString();
    if (user === null || user === void 0 ? void 0 : user.isAdmin) {
        const Match = yield MatchModels_1.default.create({
            teamA,
            teamB,
            teamAScore: 0,
            teamBScore: 0,
            Odds,
            stopPlay: false,
            startPlay: false,
            scoreEntry: `${teamAScore} VS ${teamBScore}`,
            dateTime: UploadMatchDate,
        });
        return res.status(AppError_1.HTTPCODES.OK).json({
            message: "Successfully created Match",
            data: Match,
        });
    }
    else {
        next(new AppError_1.AppError({
            message: "You are not authorized to create match",
            httpcode: AppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
exports.viewAllMatch = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Match = yield MatchModels_1.default.find();
    if (!Match) {
        next(new AppError_1.AppError({
            message: "Couldn't get all Match",
            httpcode: AppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
    return res.status(AppError_1.HTTPCODES.OK).json({
        message: "All Matches successfully gotten",
        data: Match,
    });
}));
// Allow an admin start matches and for the matches to end automatically
exports.UpdateStartMatch = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamAScore, teamBScore, startPlay } = req.body;
    const GetAdmin = yield UserModels_1.default.findById(req.params.userID);
    if (GetAdmin === null || GetAdmin === void 0 ? void 0 : GetAdmin.isAdmin) {
        const Match = yield MatchModels_1.default.findByIdAndUpdate(req.params.matchID, {
            startPlay: true,
        }, { new: true });
        //   to stop the match after 2 mins instead of the normal 90 mins:
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield MatchModels_1.default.findByIdAndUpdate(req.params.matchID, {
                stopPlay: true,
            }, { new: true });
        }), 120000);
        return res.status(AppError_1.HTTPCODES.OK).json({
            message: "Match has started",
            data: Match,
        });
    }
    else {
        next(new AppError_1.AppError({
            message: "You are not an admin, you can't start a match",
            httpcode: AppError_1.HTTPCODES.UNAUTHORIZED,
        }));
    }
}));
// Allow an admin automatically update the scores in real time
exports.UpdateScoresOfMatches = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamAScore, teamBScore } = req.body;
    const GetAdmin = yield UserModels_1.default.findById(req.params.userID);
    const CurrentMatch = yield MatchModels_1.default.findById(req.params.matchID);
    if (GetAdmin === null || GetAdmin === void 0 ? void 0 : GetAdmin.isAdmin) {
        if (CurrentMatch && CurrentMatch.startPlay) {
            if (CurrentMatch === null || CurrentMatch === void 0 ? void 0 : CurrentMatch.stopPlay) {
                next(new AppError_1.AppError({
                    message: "Match has ended",
                    httpcode: AppError_1.HTTPCODES.BAD_REQUEST,
                }));
            }
            else {
                const Matchscores = yield MatchModels_1.default.findByIdAndUpdate(CurrentMatch, {
                    teamAScore,
                    teamBScore,
                    scoreEntry: `${teamAScore} VS ${teamBScore}`,
                }, { new: true });
                return res.status(AppError_1.HTTPCODES.OK).json({
                    message: "Match scores has been updated successfully",
                    data: Matchscores,
                });
            }
        }
        else {
            next(new AppError_1.AppError({
                message: "March has not started",
                httpcode: AppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
    }
    else {
        next(new AppError_1.AppError({
            message: "You are not an admin",
            httpcode: AppError_1.HTTPCODES.UNAUTHORIZED,
        }));
    }
}));
