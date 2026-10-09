import express from "express";
import registerKey from "../controllers/registerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddlwares.js";

const registerRoutes = express.Router()

    registerRoutes.get('/get/registro',authMiddleware,adminMiddleware, registerKey.getKeys)
    registerRoutes.post('/registro',authMiddleware, registerKey.registerKey)
    

export default registerRoutes