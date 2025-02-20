import express from "express";
import { addPlaylist, deletePlaylist, getDevice, login } from "../controllers/device_controller.js";

const deviceRouter = express.Router();

deviceRouter.post("/login", login);
deviceRouter.get("/getUser", getDevice);
deviceRouter.post("/addPlayist", addPlaylist);
deviceRouter.post("/playlistDelete", deletePlaylist);

export default deviceRouter;