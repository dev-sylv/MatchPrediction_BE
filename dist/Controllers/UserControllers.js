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
exports.DeleteAUser = exports.updateOneUser = exports.RefreshUserToken = exports.UsersLogin = exports.UsersVerification = exports.UsersRegistration = exports.GetSingleUser = exports.GetUser = void 0;
const UserModels_1 = __importDefault(require("../Models/UserModels"));
const AppError_1 = require("../Utils/AppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const AsyncHandler_1 = __importDefault(require("../Utils/AsyncHandler"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EmailAuth_1 = require("../Emails/EmailAuth");
// Get all users:
const GetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModels_1.default.find();
        return res.status(200).json({
            message: "All users successfully gotten",
            data: user,
        });
    }
    catch (err) {
        return res.status(404).json({
            message: "An error occured in getting all users",
            data: err.message,
        });
    }
});
exports.GetUser = GetUser;
// Get a single User:
exports.GetSingleUser = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const singleuser = yield UserModels_1.default.findById(req.params.userID).populate({
        path: "predict",
    });
    if (!singleuser) {
        next(new AppError_1.AppError({
            message: "User not found",
            httpcode: AppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    return res.status(200).json({
        message: "Successfully got this single user",
        data: singleuser,
    });
}));
// Users Registration:
exports.UsersRegistration = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const token = crypto_1.default.randomBytes(48).toString("hex");
    const OTP = crypto_1.default.randomBytes(2).toString("hex");
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const findEmail = yield UserModels_1.default.findOne({ email });
    if (findEmail) {
        next(new AppError_1.AppError({
            message: "User with this account already exists",
            httpcode: AppError_1.HTTPCODES.FORBIDDEN,
        }));
    }
    const Users = yield UserModels_1.default.create({
        name,
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        status: "User",
        token,
        OTP,
        verified: false,
    });
    (0, EmailAuth_1.OTPAccountVerification)(Users);
    return res.status(201).json({
        message: "Successfully created User",
        data: Users,
    });
}));
// Once the user clicks on the activate button in the email, they are now verified users
// Verify a user:
exports.UsersVerification = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    const User = yield UserModels_1.default.findByIdAndUpdate(userID, {
        token: "",
        verified: true,
    }, { new: true });
    if (User) {
        return res.status(AppError_1.HTTPCODES.OK).json({
            message: "User Verification Successfull",
            data: User,
        });
    }
    else {
        next(new AppError_1.AppError({
            message: "Verification failed",
            httpcode: AppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
//  When users login, after 5 mins they are logged out
// Users Login:
exports.UsersLogin = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { userID } = req.params;
    const CheckUser = yield UserModels_1.default.findOne({ email });
    const CheckPassword = yield bcrypt_1.default.compare(password, CheckUser.password);
    if (CheckPassword) {
        if (CheckUser) {
            if ((CheckUser === null || CheckUser === void 0 ? void 0 : CheckUser.verified) && (CheckUser === null || CheckUser === void 0 ? void 0 : CheckUser.token) === "") {
                // The access token that expires every 2 mins
                const AccessToken = jsonwebtoken_1.default.sign({
                    id: CheckUser === null || CheckUser === void 0 ? void 0 : CheckUser._id,
                }, "AccessTokenSecret", {
                    expiresIn: "40s",
                });
                // The refresh token
                const RefreshToken = jsonwebtoken_1.default.sign({
                    id: CheckUser === null || CheckUser === void 0 ? void 0 : CheckUser._id,
                }, "RefreshTokenSecret", { expiresIn: "1m" });
                return res.status(AppError_1.HTTPCODES.OK).json({
                    message: "User Login successfull",
                    data: CheckUser,
                    AccessToken: AccessToken,
                    RefreshToken: RefreshToken,
                });
            }
            else {
                next(new AppError_1.AppError({
                    message: "User not Verified",
                    httpcode: AppError_1.HTTPCODES.NOT_FOUND,
                }));
            }
        }
        else {
            next(new AppError_1.AppError({
                message: "User not Found",
                httpcode: AppError_1.HTTPCODES.NOT_FOUND,
            }));
        }
    }
    else {
        next(new AppError_1.AppError({
            message: "Email or password not correct",
            httpcode: AppError_1.HTTPCODES.CONFLICT,
        }));
    }
}));
// Refresh the token again for every time they login:
exports.RefreshUserToken = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { RefreshToken } = req.body;
        jsonwebtoken_1.default.verify(RefreshToken, "RefreshTokenSecret", (err, payload) => {
            if (err) {
                throw err;
            }
            else {
                console.log(payload);
                const AccessToken = jsonwebtoken_1.default.sign({
                    id: payload.id,
                }, "AccessTokenSecret", {
                    expiresIn: "40s",
                });
                const RefreshToken = req.body.RefreshToken;
                return res.status(AppError_1.HTTPCODES.OK).json({
                    message: "New token generated",
                    AccessTokenData: AccessToken,
                    RefreshTokenData: RefreshToken,
                });
            }
        });
    }
    catch (error) {
        return res.status(AppError_1.HTTPCODES.INTERNAL_SERVER_ERROR).json({
            message: "An error occured in genertaing new token",
            data: error,
        });
    }
}));
// Update one user:
exports.updateOneUser = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const user = yield UserModels_1.default.findByIdAndUpdate(req.params.userID, { name }, { new: true });
    if (!user) {
        next(new AppError_1.AppError({
            message: "An error occured in updating name",
            httpcode: AppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
    return res.status(201).json({
        message: "Successfully updated the user's name",
        data: user,
    });
}));
// Delete a user:
exports.DeleteAUser = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModels_1.default.findByIdAndDelete(req.params.userID);
    if (!user) {
        next(new AppError_1.AppError({
            message: "An error occured in deleting this user",
            httpcode: AppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
    return res.status(201).json({
        message: "Successfully deleted this user",
        data: user,
    });
}));
