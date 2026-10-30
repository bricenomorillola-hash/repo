import express from "express";
import proveedorController from "../controllers/proveedor.controller.js";
const router = express.Router();

// Las consultas a MySQL son asíncronas (tardan), por eso las rutas son "async"
// y usamos "await" para esperar la respuesta del controlador.
// Si algo falla (por ejemplo MySQL apagado), next(error) lo manda al manejador de errores de app.js.

export default router;
