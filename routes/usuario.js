const express = require("express");
const ctrl = require("../controllers/UsuarioController");
const { permitirRoles } = require("../middlewares/auth");
const { validarBody, validarParams } = require("../middlewares/validar");

const router = express.Router();

// todo esto es solo del admin
router.use(permitirRoles("admin"));

router.get("/mostrarTodo", ctrl.mostrarTodo);
router.put(
  "/cambiarRol/:id",
  validarParams("id"),
  validarBody({ rol: { tipo: "lista", opciones: ["admin", "editor", "usuario"] } }, true),
  ctrl.cambiarRol
);
router.delete("/eliminarUno/:id", validarParams("id"), ctrl.eliminarUno);

module.exports = router;
