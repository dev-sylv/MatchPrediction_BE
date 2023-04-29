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

// Get a single User:
export const GetSingleUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const singleuser = await UserModels.findById(req.params.userID).populate({
      path: "predict",
    });

    if (!singleuser) {
      next(
        new AppError({
          message: "User not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    return res.status(200).json({
      message: "Successfully got this single user",
      data: singleuser,
    });
  }
);

// Users Registration:
export const UsersRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber, userName, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const findEmail = await UserModels.findOne({ email });

    if (findEmail) {
      next(
        new AppError({
          message: "User with this account already exists",
          httpcode: HTTPCODES.FORBIDDEN,
        })
      );
    }

    const Users = await UserModels.create({
      name,
      email,
      userName,
      phoneNumber: "234" + phoneNumber,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      status: "User",
    });

    return res.status(201).json({
      message: "Successfully created User",
      data: Users,
    });
  }
);
