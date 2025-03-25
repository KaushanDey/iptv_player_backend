import express from "express";
import { addPlaylist, deletePlaylist, editPlaylist, getDevice, login } from "../controllers/device_controller.js";

const deviceRouter = express.Router();

deviceRouter.post("/login", login);
deviceRouter.get("/getDevice", getDevice);
deviceRouter.post("/addPlaylist", addPlaylist);
deviceRouter.post("/deletePlaylist", deletePlaylist);
deviceRouter.post("/editPlaylist", editPlaylist);

export default deviceRouter;