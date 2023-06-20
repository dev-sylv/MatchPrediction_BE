"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserControllers_1 = require("../Controllers/UserControllers");
const UserControllers_2 = require("../Controllers/UserControllers");
const UserRouter = express_1.default.Router();
// user registration routes:
UserRouter.route("/registeruser").post(UserControllers_1.UsersRegistration);
// User verification routes:
UserRouter.route("/:userID/verifyuser").get(UserControllers_2.UsersVerification);
// user login routes:
// UserRouter.route("/loginuser").post(UserLoginValidation, UsersLogin);
// User refresh routes:
// UserRouter.route("/refresh-token").post(RefreshUserToken);
// get single user:
UserRouter.route("/getsingleuser/:userID").get(UserControllers_1.GetSingleUser);
// All user routes:
UserRouter.route("/getsingleuser").get(UserControllers_1.GetUser);
// Update user routes:
UserRouter.route("/updateuser/:userID").patch(UserControllers_1.updateOneUser);
// Delete user routes:
UserRouter.route("/deleteuser/:userID").delete(UserControllers_1.DeleteAUser);
exports.default = UserRouter;
