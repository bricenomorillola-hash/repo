const express = require("express");
const ctrl = require("../controllers/VistasController");
const { vistaRequiereLogin, vistaPermitirRoles } = require("../middlewares/auth");

const router = express.Router();

// públicas
router.get("/", ctrl.inicio);
router.get("/login", ctrl.login);
router.get("/registro", ctrl.registro);
router.get("/proveedores", ctrl.proveedores);
router.get("/marcas", ctrl.marcas);

// con login
router.get("/equipos", vistaRequiereLogin, ctrl.equipos);

// admin
router.get("/usuarios", vistaPermitirRoles("admin"), ctrl.usuarios);

module.exports = router;
