const ProveedorModel = require("../models/ProveedorModel");
const MarcaModel = require("../models/MarcaModel");
const EquipoModel = require("../models/EquipoModel");
const UsuarioModel = require("../models/UsuarioModel");

class VistasController {
  inicio = async (req, res, next) => {
    try {
      const [proveedores, marcas] = await Promise.all([ProveedorModel.todos(), MarcaModel.todas()]);
      res.render("index", { totalProveedores: proveedores.length, totalMarcas: marcas.length });
    } catch (err) { next(err); }
  };

  login = (req, res) => {
    if (req.usuario) return res.redirect("/");
    res.render("login", { aviso: req.query.aviso === "login" });
  };

  registro = (req, res) => {
    if (req.usuario) return res.redirect("/");
    res.render("registro");
  };

  proveedores = async (req, res, next) => {
    try {
      res.render("proveedores", { proveedores: await ProveedorModel.todos() });
    } catch (err) { next(err); }
  };

  marcas = async (req, res, next) => {
    try {
      res.render("marcas", { marcas: await MarcaModel.todas() });
    } catch (err) { next(err); }
  };

  equipos = async (req, res, next) => {
    try {
      const [equipos, proveedores, marcas] = await Promise.all([
        EquipoModel.todos(),
        ProveedorModel.todos(),
        MarcaModel.todas(),
      ]);
      res.render("equipos", { equipos, proveedores, marcas });
    } catch (err) { next(err); }
  };

  usuarios = async (req, res, next) => {
    try {
      res.render("usuarios", { usuarios: await UsuarioModel.todos() });
    } catch (err) { next(err); }
  };
}

module.exports = new VistasController();
