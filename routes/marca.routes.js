import express from "express";
import marcaController from "../controllers/marca.controller.js";
const router = express.Router();

router.get("/mostrarTodo", async (req, res, next) => {
  try {
    const r = await marcaController.mostrarTodo();
    res.status(r.status).json({ data: r.data, message: r.message });
  } catch (error) {
    next(error);
  }
});

router.get("/mostrarUno/:id", async (req, res, next) => {
  try {
    const r = await marcaController.mostrarUno(req.params.id);
    res.status(r.status).json({ data: r.data, message: r.message });
  } catch (error) {
    next(error);
  }
});

router.post("/crearUno", async (req, res, next) => {
  try {
    const r = await marcaController.crearMarca(req.body);
    res.status(r.status).json({ data: r.data, message: r.message });
  } catch (error) {
    next(error);
  }
});

router.put("/actualizarUno/:id", async (req, res, next) => {
  try {
    const r = await marcaController.actualizarUno(req.params.id, req.body);
    res.status(r.status).json({ data: r.data, message: r.message });
  } catch (error) {
    next(error);
  }
});

router.delete("/eliminarUno/:id", async (req, res, next) => {
  try {
    const r = await marcaController.eliminarUno(req.params.id);
    res.status(r.status).json({ data: r.data, message: r.message });
  } catch (error) {
    next(error);
  }
});
export default router;
