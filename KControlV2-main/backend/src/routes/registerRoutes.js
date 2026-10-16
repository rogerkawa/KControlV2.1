import express from "express";
import registerKey from "../controllers/registerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddlwares.js";

const registerRoutes = express.Router()

    registerRoutes.get('/get/registro',authMiddleware,adminMiddleware, registerKey.getKeys)
    registerRoutes.post('/registro',authMiddleware, registerKey.registerKey)
    registerRoutes.put("/registro/update/:id", authMiddleware, adminMiddleware, registerKey.updateKey);
    registerRoutes.delete("/registro/delete/:id", authMiddleware, adminMiddleware, registerKey.deleteKey);


export default registerRoutes