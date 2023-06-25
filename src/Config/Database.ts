import mongoose from "mongoose";

import { EnvironmentalVariables } from "./EnvironmentVariables";

const LIVEURI = EnvironmentalVariables.MONGODB_STRING;
const LOCALURL = "mongodb://0.0.0.0:27017/FootballPredictionServer";
// done

export const DBCONNECTION = async () => {
  try {
    const conn = await mongoose.connect(LOCALURL);
    console.log("");
    console.log(`Database is connected to ${conn.connection.host}`);
  } catch (error) {
    console.log(`${error}`);
  }
};
