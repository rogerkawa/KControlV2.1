import express from "express";
import UserController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import adminMiddleware from "../middlewares/adminMiddlwares";

const userRoutes = express.Router()

    userRoutes.get('/users',authMiddleware, adminMiddleware, UserController.listUsers)
    userRoutes.post('/users/registro', UserController.registerUser)
    userRoutes.post('/users/login', UserController.loginUser)
    userRoutes.get('/users/login/auth', authMiddleware,  UserController.userAuthenticator)

    userRoutes.put('/users/perfil',authMiddleware,UserController.updateProfile)
    userRoutes.put('/users/senha',authMiddleware,UserController.updatePassword);
    

export default userRoutes