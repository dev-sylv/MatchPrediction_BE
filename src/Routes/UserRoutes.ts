import express from "express";
import {
  DeleteAUser,
  GetSingleUser,
  GetUser,
  updateOneUser,
  UsersLogin,
  UsersRegistration,
} from "../Controllers/UserControllers";

import {
  UserRegisterValidation,
  UserLoginValidation,
} from "../Middlewares/Validation/UserValidation";
import { UsersVerification } from "../Controllers/UserControllers";

const UserRouter = express.Router();

// user registration routes:
UserRouter.route("/registeruser").post(
  UserRegisterValidation,
  UsersRegistration
);

// User verification routes:
UserRouter.route("/verifyuser").get(UsersVerification);

// user login routes:
UserRouter.route("/loginuser").post(UserLoginValidation, UsersLogin);

// get single user:
UserRouter.route("/getsingleuser/:userID").get(GetSingleUser);

// All user routes:
UserRouter.route("/getsingleuser").get(GetUser);

// Update user routes:
UserRouter.route("/updateuser/:userID").patch(updateOneUser);

// Delete user routes:
UserRouter.route("/deleteuser/:userID").delete(DeleteAUser);

export default UserRouter;
