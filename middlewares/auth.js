const jwt = require("jsonwebtoken");
const config = require("../config/env");

const MSG_SIN_SESION = "Debe iniciar sesión para realizar esta operación (token faltante o inválido)";

// el token puede venir en la cookie (páginas) o en el header Authorization (Thunder Client)
function leerToken(req) {
  if (req.cookies && req.cookies.token) return req.cookies.token;
  const cabecera = req.headers.authorization || "";
  if (cabecera.startsWith("Bearer ")) return cabecera.slice(7);
  return null;
}

// corre en todas las peticiones, si el token sirve deja el usuario en req.usuario
function cargarUsuario(req, res, next) {
  req.usuario = null;
  const token = leerToken(req);
  if (token) {
    try {
      const datos = jwt.verify(token, config.jwtSecret);
      req.usuario = { id: datos.id, nombre: datos.nombre, rol: datos.rol };
    } catch (err) {
      req.usuario = null;
    }
  }
  res.locals.usuario = req.usuario;
  next();
}

function requiereLogin(req, res, next) {
  if (!req.usuario) return res.status(401).json({ message: MSG_SIN_SESION });
  next();
}

function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ message: MSG_SIN_SESION });
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        message:
          "ADVERTENCIA: su rol (" + req.usuario.rol + ") no tiene permiso para esta operación. " +
          "Roles permitidos: " + roles.join(", "),
      });
    }
    next();
  };
}

// lo mismo pero para las páginas EJS
function vistaRequiereLogin(req, res, next) {
  if (!req.usuario) return res.redirect("/login?aviso=login");
  next();
}

function vistaPermitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario) return res.redirect("/login?aviso=login");
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).render("error", {
        titulo: "Acceso denegado",
        mensaje: "ADVERTENCIA: su rol (" + req.usuario.rol + ") no tiene permiso para ver esta página.",
      });
    }
    next();
  };
}

module.exports = { cargarUsuario, requiereLogin, permitirRoles, vistaRequiereLogin, vistaPermitirRoles };
