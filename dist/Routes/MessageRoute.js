"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../Controllers/messageController");
const messageRouter = express_1.default.Router();
// user registration routes:
messageRouter.route("/sendmessage").post(messageController_1.SendMessage);
exports.default = messageRouter;
