import express from "express";
import { addUser, getUser } from "../controllers/user_controller.js";

const userRouter = express.Router();

userRouter.post("/addUser", addUser);
userRouter.post("/getUser", getUser);

export default userRouter;