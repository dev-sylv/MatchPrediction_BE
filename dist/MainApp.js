"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const UserRoutes_1 = __importDefault(require("./Routes/UserRoutes"));
const MatchRoutes_1 = __importDefault(require("./Routes/MatchRoutes"));
const PredictRoutes_1 = __importDefault(require("./Routes/PredictRoutes"));
const AppError_1 = require("./Utils/AppError");
const ErrorHandler_1 = require("./Middlewares/Errors/ErrorHandler");
const AppConfig = (app) => {
    app.set("view engine", "ejs");
    app.use(express_1.default.json());
    app.use(express_1.default.static("public"));
    app.use(express_1.default.static(`${__dirname} public/css`));
    app.use(express_1.default.static(`${__dirname} public/asset`));
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.get("/views", (req, res) => {
        // res.render("AccountVerification");
        res.render("Otp");
    });
    app.get("/", (req, res) => {
        return res.status(200).json({
            message: "API READY FOR MATCHES PREDICTION",
        });
    });
    // Configuring the routes:
    app.use("/api/users", UserRoutes_1.default);
    app.use("/api", MatchRoutes_1.default);
    app.use("/api", PredictRoutes_1.default);
    app.all("*", (req, res, next) => {
        next(new AppError_1.AppError({
            message: `This router ${req.originalUrl} does not exist`,
            httpcode: AppError_1.HTTPCODES.NOT_FOUND,
            name: "Route Error",
            isOperational: false,
        }));
    });
    app.use(ErrorHandler_1.ErrorHandler);
};
exports.AppConfig = AppConfig;
