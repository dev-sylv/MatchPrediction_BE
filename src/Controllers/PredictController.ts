import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import MatchModels from "../Models/MatchModels";
import PredictModel from "../Models/PredictModels";
import UserModels from "../Models/UserModels";
import { AppError, HTTPCODES } from "../Utils/AppError";
import AsyncHandler from "../Utils/AsyncHandler";

// After users have signed up, they have the ability to upload their predicted score per match by a certain time deadline
export const CreatePrediction = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userID, matchID } = req.params;
    const { teamAScore, teamBScore, amount } = req.body;
    const user = await UserModels.findById(userID);
    const match = await MatchModels.findById(matchID);

    if (user) {
      // If the match has ended, the users can't predict again.
      if (match?.stopPlay) {
        return res.status(HTTPCODES.BAD_REQUEST).json({
          message: "The match has ended",
        });
      } else {
        // Here they can upload their prediction for a march
        const PredictMatch = await PredictModel.create({
          teamA: match?.teamA,
          teamB: match?.teamB,
          teamAScore,
          teamBScore,
          amount,
          prize: match?.Odds! * amount,
          scoreEntry: `${teamAScore} VS ${teamBScore}`,
        });

        user.predict.push(new mongoose.Types.ObjectId(PredictMatch?._id));
        user.save();

        match?.predict.push(new mongoose.Types.ObjectId(PredictMatch?._id));
        match?.save();

        return res.status(HTTPCODES.OK).json({
          message: "Prediction entry successful",
          data: PredictMatch,
        });
      }
    } else {
      next(
        new AppError({
          message: "User can't be found",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);

// Users can view his/her predictions
export const ViewAllPredictions = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.params;
      const user = await UserModels.findById(userID).populate({
        path: "predict",
        options: {
          sort: { createdAt: -1 },
        },
      });

      if (!user) {
        next(
          new AppError({
            message: "User not found",
            httpcode: HTTPCODES.NOT_FOUND,
          })
        );
      }
      return res.status(HTTPCODES.OK).json({
        message: "User prediction",
        data: user?.predict,
      });
    } catch (error) {
      return res.status(HTTPCODES.BAD_REQUEST).json({
        message: "Error occurred in the view user prediction logic",
      });
    }
  }
);

// (the admin is able to view all predictions)
export const AllPredictions = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { adminID } = req.params;

      const GetAdmin = await UserModels.findById(adminID);

      const predictions = await PredictModel.find();

      if (GetAdmin?.isAdmin) {
        if (!predictions) {
          next(
            new AppError({
              message: "User not found",
              httpcode: HTTPCODES.NOT_FOUND,
            })
          );
        }
      } else {
        next(
          new AppError({
            message: "You can't view others predictions",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }

      return res.status(HTTPCODES.OK).json({
        message: "All User Predictions",
        data: predictions,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Error",
      });
    }
  }
);

//the leaderboard, making comparisons between the user predict scores and the admin actual set score
export const PredictionTable = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // To get all predictions
      const predict = await PredictModel.find();
      if (!predict) {
        next(
          new AppError({
            message: "Couldn't find the Prediction ",
            httpcode: HTTPCODES.FORBIDDEN,
          })
        );
      }
      // To get all matches
      const match = await MatchModels.find();
      if (!match) {
        next(
          new AppError({
            message: "Couldn't get a match ",
            httpcode: HTTPCODES.FORBIDDEN,
          })
        );
      }

      // For admin to filter the predictions scores of users with the actual scores of the match
      const table = match.filter((el) => {
        return predict.some((props) => el.scoreEntry === props.scoreEntry);
      });
      if (!table) {
        next(
          new AppError({
            message: "Couldn't get a correct prediction ",
            httpcode: HTTPCODES.FORBIDDEN,
          })
        );
      }

      return res.status(200).json({
        message: "Prediction table",
        data: table,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Error",
      });
    }
  }
);

//user prediction
export const userPredictionTable = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.params;
      const prediction = await UserModels.findById(userID).populate({
        path: "predict",
      });
      const match = await MatchModels.find();
      if (!match) {
        next(
          new AppError({
            message: "couldn't get match model",
            httpcode: HTTPCODES.FORBIDDEN,
          })
        );
      }
      const table = match.filter((el) => {
        return prediction!.predict.some(
          (props) => el.scoreEntry === props.scoreEntry
        );
      });

      //new model will contain what is inside our predict model

      if (!table) {
        next(
          new AppError({
            message: "couldn't get user prediction",
            httpcode: HTTPCODES.FORBIDDEN,
          })
        );
      }

      return res.status(HTTPCODES.OK).json({
        message: " Prediction table",
        data: table,
      });
    } catch (error) {
      return res.status(HTTPCODES.BAD_GATEWAY).json({
        message: "Error",
      });
    }
  }
);
