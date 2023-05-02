import express, { Application, Request, Response } from "express";
import { DBCONNECTION } from "./Config/Database";

import { AppConfig } from "./MainApp";
import { EnvironmentalVariables } from "./Config/EnvironmentVariables";

const port = EnvironmentalVariables.PORT;

const app: Application = express();
AppConfig(app);
DBCONNECTION();

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "API READY FOR MATCHES PREDICTION",
  });
});

const server = app.listen(port, () => {
  console.log("");
  console.log("Server is up and running on port", port);
});

// To protect my server from crashing when users do what they are not supposed to do
process.on("uncaughtException", (error: Error) => {
  process.exit(1);
});

process.on("unhandledRejection", (res) => {
  server.close(() => {
    process.exit(1);
  });
});
