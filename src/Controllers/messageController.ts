import { NextFunction, Request, Response } from "express";
import MessageModel from "../Models/MessageModel";
import AsyncHandler from "../Utils/AsyncHandler";
import { AppError, HTTPCODES } from "../Utils/AppError";

export const SendMessage = AsyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { name, email, message } = req.body;

    const Message = await MessageModel.create({
      name,
      email,
      message,
    });

    if (!Message) {
      next(
        new AppError({
          message: "Message Not sent",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }

    return res.status(HTTPCODES.OK).json({
      message: "Message Successfully sent",
      data: Message,
    });
  }
);
