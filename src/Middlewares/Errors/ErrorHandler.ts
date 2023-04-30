import { Request, Response, NextFunction } from "express";

import { AppError, HTTPCODES } from "../../Utils/AppError";

const DevError = (err: AppError, res: Response) => {
  return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
    error: err,
    message: err.message,
    stack: err.stack,
    status: err.httpcode,
  });
};

export const ErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  DevError(err, res);
};
