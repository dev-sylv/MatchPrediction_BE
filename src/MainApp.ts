import express, { Application, NextFunction, Request, Response } from "express";

import cors from "cors";

import morgan from "morgan";

import UserRouter from "./Routes/MatchRoutes";

import MatchRouter from "./Routes/MatchRoutes";

import PredictRouter from "./Routes/PredictRoutes";

import { AppError, HTTPCODES } from "./Utils/AppError";

import { ErrorHandler } from "./Middlewares/Errors/ErrorHandler";

import ejs from "ejs";

export const AppConfig = (app: Application) => {
  app.set("view engine", "ejs");
  app.use(express.static(`public`));
  app.use(express.static(`${__dirname} public/css`));
  app.use(express.static(`${__dirname} public/asset`));
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  app.get("/view", (req, res) => {
    res.render("start");
  });

  // Configuring the routes:
  app.use("/api", UserRouter);
  app.use("/api", MatchRouter);
  app.use("/api", PredictRouter);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(
      new AppError({
        message: `This router ${req.originalUrl} does not exist`,
        httpcode: HTTPCODES.NOT_FOUND,
        name: "Route Error",
        isOperational: false,
      })
    );
  });
  app.use(ErrorHandler);
};
