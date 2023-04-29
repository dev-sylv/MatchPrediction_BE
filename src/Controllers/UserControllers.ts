import { NextFunction, Request, Response } from "express";
import UserModels from "../Models/UserModels";
import { AppError, HTTPCODES } from "../Utils/AppError";
import bcrypt from "bcrypt";
import AsyncHandler from "../Utils/AsyncHandler";

// Get all users:
export const GetUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModels.find();

    return res.status(200).json({
      message: "All users successfully gotten",
      data: user,
    });
  } catch (err: any) {
    return res.status(404).json({
      message: "An error occured in getting all users",
      data: err.message,
    });
  }
};
