import { Request, Response, NextFunction } from "express";
import MatchModels from "../Models/MatchModels";
import UserModels from "../Models/UserModels";
import { AppError, HTTPCODES } from "../Utils/AppError";
import AsyncHandler from "../Utils/AsyncHandler";

// ADMIN CREATE MATCHES && Allow an admin upload matches for the particular match week
export const CreateMatch = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamA, teamB, teamAScore, teamBScore, Odds, dateTime } = req.body;

    const user = await UserModels.findById(req.params.userID);

    const UploadMatchDate = new Date().toDateString();

    if (user?.isAdmin) {
      const Match = await MatchModels.create({
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

      return res.status(HTTPCODES.OK).json({
        message: "Successfully created Match",
        data: Match,
      });
    } else {
      next(
        new AppError({
          message: "You are not authorized to create match",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);

export const viewAllMatch = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const Match = await MatchModels.find();

    if (!Match) {
      next(
        new AppError({
          message: "Couldn't get all Match",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }

    return res.status(HTTPCODES.OK).json({
      message: "All Matches successfully gotten",
      data: Match,
    });
  }
);
