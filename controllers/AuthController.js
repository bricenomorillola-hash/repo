const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const UsuarioModel = require("../models/UsuarioModel");

class AuthController {
  crearToken(usuario) {
    return jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      config.jwtSecret,
      { expiresIn: config.jwtExpira }
    );
  }

  // la cookie es para que funcionen las páginas EJS
  guardarCookie(res, token) {
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: config.produccion,
      maxAge: 2 * 60 * 60 * 1000,
    });
  }

  registro = async (req, res, next) => {
    try {
      const { nombre, email, password } = req.datos;
      const existente = await UsuarioModel.porEmailConClave(email.toLowerCase());
      if (existente) return res.status(409).json({ message: "Ya existe un usuario con ese correo" });

      const passwordHash = await bcrypt.hash(password, 10);
      const usuario = await UsuarioModel.crear({
        nombre,
        email: email.toLowerCase(),
        passwordHash,
        rol: "usuario",
      });
      res.status(201).json({ data: usuario, message: "Usuario registrado. Ya puede iniciar sesión" });
    } catch (err) { next(err); }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.datos;
      const usuario = await UsuarioModel.porEmailConClave(email.toLowerCase());
      const claveOk = usuario ? await bcrypt.compare(password, usuario.password) : false;
      if (!claveOk) return res.status(401).json({ message: "Correo o contraseña incorrectos" });

      const token = this.crearToken(usuario);
      this.guardarCookie(res, token);
      res.json({
        token,
        data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
        message: "Inicio de sesión correcto",
      });
    } catch (err) { next(err); }
  };

  logout = (req, res) => {
    res.clearCookie("token");
    if (req.method === "GET") return res.redirect("/");
    res.json({ message: "Sesión cerrada" });
  };

  perfil = async (req, res, next) => {
    try {
      const data = await UsuarioModel.porId(req.usuario.id);
      if (!data) return res.status(404).json({ message: "El usuario ya no existe" });
      res.json({ data, message: "Perfil del usuario" });
    } catch (err) { next(err); }
  };
}

module.exports = new AuthController();
