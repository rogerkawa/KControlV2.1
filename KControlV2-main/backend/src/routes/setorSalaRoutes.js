import express from "express";
import setorSalaController from "../controllers/setorSalaController.js";

const setorSalaRoutes = express.Router()

    setorSalaRoutes.get('/salas', setorSalaController.listSalas)
    setorSalaRoutes.get('/setores', setorSalaController.listSetores)

    

export default setorSalaRoutes