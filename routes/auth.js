const express = require("express");
const ctrl = require("../controllers/AuthController");
const { requiereLogin } = require("../middlewares/auth");
const { validarBody } = require("../middlewares/validar");

const router = express.Router();

router.post(
  "/registro",
  validarBody({ nombre: { tipo: "texto" }, email: { tipo: "email" }, password: { tipo: "clave" } }, true),
  ctrl.registro
);
router.post("/login", validarBody({ email: { tipo: "email" }, password: { tipo: "texto" } }, true), ctrl.login);
router.post("/logout", ctrl.logout);
router.get("/logout", ctrl.logout);
router.get("/perfil", requiereLogin, ctrl.perfil);

module.exports = router;
