import express from "express";
import { SendMessage } from "../Controllers/messageController";

const messageRouter = express.Router();

// user registration routes:
messageRouter.route("/sendmessage").post(SendMessage);

export default messageRouter;
