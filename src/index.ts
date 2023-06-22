import express, { Application, Request, Response } from "express";
import { DBCONNECTION } from "./Config/Database";

import { AppConfig } from "./MainApp";
import { EnvironmentalVariables } from "./Config/EnvironmentVariables";

const port = EnvironmentalVariables.PORT || 2001;

const app: Application = express();
AppConfig(app);
DBCONNECTION();

const server = app.listen(port, () => {
  console.log("");
  console.log(`Server is running and listening on port ${port}`);
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
