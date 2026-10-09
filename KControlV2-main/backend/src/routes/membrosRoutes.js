
import express from "express";

import membrosController from "../controllers/membrosController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddlwares.js";

const membrosRoutes = express.Router();


membrosRoutes.get("/membros", authMiddleware, adminMiddleware, membrosController.findAll);
membrosRoutes.get("/membros/:id", authMiddleware, adminMiddleware, membrosController.findById);
membrosRoutes.put("/membros/update/:id", authMiddleware, adminMiddleware, membrosController.updateMembers);
membrosRoutes.delete("/membros/delete/:id", authMiddleware, adminMiddleware, membrosController.removeMembers);

export default membrosRoutes;
