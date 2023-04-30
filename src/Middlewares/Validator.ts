import { NextFunction } from "express";

import Joi from "joi";

import { AppError, HTTPCODES } from "../Utils/AppError";

export const Validator = (
  schemaName: Joi.ObjectSchema,
  body: object,
  next: NextFunction
) => {
  const value = schemaName.validate(body, {
    allowUnknown: true,
    abortEarly: false,
    stripUnknown: true,
  });
  try {
    value.error
      ? next(
          new AppError({
            httpcode: HTTPCODES.UNPROCESSABLE_IDENTITY,
            message: value.error.details[0].message,
          })
        )
      : next();
  } catch (error) {
    console.log(error);
  }
};
