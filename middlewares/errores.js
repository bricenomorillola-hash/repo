const config = require("../config/env");

// los navegadores piden html primero, Thunder Client pide */*
const quiereHtml = (req) => req.accepts(["json", "html"]) === "html";

function noEncontrada(req, res) {
  if (quiereHtml(req)) {
    return res.status(404).render("error", { titulo: "No encontrado", mensaje: "La página no existe." });
  }
  res.status(404).json({ message: "Ruta no encontrada" });
}

function manejarError(err, req, res, next) {
  let estado = 500;
  let mensaje = "Error interno del servidor (revise que MySQL esté encendido)";

  if (err.type === "entity.parse.failed") {
    estado = 400;
    mensaje = "El JSON enviado no tiene un formato válido";
  } else if (err.code === "ER_DUP_ENTRY") {
    estado = 409;
    mensaje = "Ya existe un registro con esos datos";
  } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
    estado = 400;
    mensaje = "El proveedor o la marca indicada no existe";
  } else {
    console.error(err);
    if (!config.produccion && err.message) mensaje += " | Detalle: " + err.message;
  }

  if (quiereHtml(req)) {
    return res.status(estado).render("error", { titulo: "Error " + estado, mensaje });
  }
  res.status(estado).json({ message: mensaje });
}

module.exports = { noEncontrada, manejarError };
