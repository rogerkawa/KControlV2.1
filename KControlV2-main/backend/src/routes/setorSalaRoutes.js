
import express from "express";
import setorSalaController from "../controllers/setorSalaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddlwares.js";

const setorSalaRoutes = express.Router();

// Consultas
setorSalaRoutes.get("/salas", setorSalaController.listSalas);
setorSalaRoutes.get("/setores", setorSalaController.listSetores);

// Gerenciamento de salas: somente administradores
setorSalaRoutes.post(
  "/salas",
  authMiddleware,
  adminMiddleware,
  setorSalaController.createSala,
);

setorSalaRoutes.patch(
  "/salas/:id/status",
  authMiddleware,
  adminMiddleware,
  setorSalaController.updateStatusSala,
);

setorSalaRoutes.delete(
  "/salas/:id",
  authMiddleware,
  adminMiddleware,
  setorSalaController.removeSala,
);

/* Gerenciamento de Setores */
setorSalaRoutes.post(
  "/setores",
  authMiddleware,
  adminMiddleware,
  setorSalaController.createSetor,
);

setorSalaRoutes.put(
  "/setores/:id",
  authMiddleware,
  adminMiddleware,
  setorSalaController.updateSetor,
);

setorSalaRoutes.patch(
  "/setores/:id/status",
  authMiddleware,
  adminMiddleware,
  setorSalaController.updateStatusSetor,
);


export default setorSalaRoutes;
