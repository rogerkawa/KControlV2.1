import avatarController from "../controllers/avatarController.js";
import uploadAvatar from "../middlewares/avatarMiddlewares.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import express from "express";

const avatarRoutes = express.Router();

avatarRoutes.get("/avatar", authMiddleware, avatarController.buscarPerfil);
avatarRoutes.put("/avatar/update", authMiddleware, uploadAvatar.single("avatar"), avatarController.atualizarAvatar);

export default avatarRoutes;