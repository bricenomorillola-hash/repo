import express from "express";
import equipoController from "../controllers/equipo.controller.js";
const router = express.Router();

router.get("/mostrarTodo", async (req, res, next) => {
  try {
    const r = await equipoController.mostrarTodo();
    res.status(r.status).json({ data: r.data, message: r.message });
  } catch (error) {
    next(error);
  }
});

router.get("/mostrarUno/:id", async (req, res, next) => {
  try {
    const r = await equipoController.mostrarUno(req.params.id);
    res.status(r.status).json({ data: r.data, message: r.message });
  } catch (error) {
    next(error);
  }
});

router.get("/mostrarxProv/:id", async (req, res, next) => {
  try {
    const r = await equipoController.mostrarETProv(req.params.id);
    res.status(r.status).json({ data: r.data, message: r.message });
  } catch (error) {
    next(error);
  }
});

router.post("/crearUno/:id", async (req, res, next) => {
  try {
    const r = await equipoController.crearEquipo(req.params.id, req.body);
    res.status(r.status).json({ data: r.data, message: r.message });
  } catch (error) {
    next(error);
  }
});

router.put("/actualizarUno/:id", async (req, res, next) => {
  try {
    const r = await equipoController.actualizarUno(req.params.id, req.body);
    res.status(r.status).json({ data: r.data, message: r.message });
  } catch (error) {
    next(error);
  }
});

export default router;
