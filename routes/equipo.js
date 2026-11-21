const express = require("express");
const ctrl = require("../controllers/EquipoController");
const { requiereLogin, permitirRoles } = require("../middlewares/auth");
const { validarBody, validarParams } = require("../middlewares/validar");

const router = express.Router();

const esquemaCrear = {
  nombre: { tipo: "texto" },
  tipo: { tipo: "texto" },
  marca_id: { tipo: "id" },
};
const esquemaEditar = { ...esquemaCrear, proveedor_id: { tipo: "id" } };

// cualquiera con sesión iniciada
router.get("/mostrarTodo", requiereLogin, ctrl.mostrarTodo);
router.get("/mostrarUno/:id", requiereLogin, validarParams("id"), ctrl.mostrarUno);
router.get("/mostrarxProv/:idProv", requiereLogin, validarParams("idProv"), ctrl.mostrarxProv);
router.get("/mostrarxMarca/:idMarca", requiereLogin, validarParams("idMarca"), ctrl.mostrarxMarca);

// editor
router.post("/crearUno/:idProv", permitirRoles("editor"), validarParams("idProv"), validarBody(esquemaCrear, true), ctrl.crearUno);

// admin y editor
router.put("/actualizarUno/:id", permitirRoles("admin", "editor"), validarParams("id"), validarBody(esquemaEditar, false), ctrl.actualizarUno);

// admin
router.delete("/eliminarUno/:id", permitirRoles("admin"), validarParams("id"), ctrl.eliminarUno);

module.exports = router;
