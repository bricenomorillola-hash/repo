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

export default router;
