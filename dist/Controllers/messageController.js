"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessage = void 0;
const MessageModel_1 = __importDefault(require("../Models/MessageModel"));
const AsyncHandler_1 = __importDefault(require("../Utils/AsyncHandler"));
const AppError_1 = require("../Utils/AppError");
exports.SendMessage = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message } = req.body;
    const Message = yield MessageModel_1.default.create({
        name,
        email,
        message,
    });
    if (!Message) {
        next(new AppError_1.AppError({
            message: "Message Not sent",
            httpcode: AppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
    return res.status(AppError_1.HTTPCODES.OK).json({
        message: "Message Successfully sent",
        data: Message,
    });
}));
