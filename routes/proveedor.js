const express = require("express");
const ctrl = require("../controllers/ProveedorController");
const { permitirRoles } = require("../middlewares/auth");
const { validarBody, validarParams } = require("../middlewares/validar");

const router = express.Router();

const esquema = {
  nombre: { tipo: "texto" },
  fundacion: { tipo: "anio" },
  ubicacion: { tipo: "texto" },
};

// públicas
router.get("/mostrarTodo", ctrl.mostrarTodo);
router.get("/mostrarUno/:id", validarParams("id"), ctrl.mostrarUno);

// editor
router.post("/crearUno", permitirRoles("editor"), validarBody(esquema, true), ctrl.crearUno);

// admin y editor
router.put("/actualizarUno/:id", permitirRoles("admin", "editor"), validarParams("id"), validarBody(esquema, false), ctrl.actualizarUno);

// admin
router.delete("/eliminarUno/:id", permitirRoles("admin"), validarParams("id"), ctrl.eliminarUno);

module.exports = router;
