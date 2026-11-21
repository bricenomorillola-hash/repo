const ProveedorModel = require("../models/ProveedorModel");

class ProveedorController {
  mostrarTodo = async (req, res, next) => {
    try {
      const data = await ProveedorModel.todos();
      res.json({ data, message: "Proveedores encontrados" });
    } catch (err) { next(err); }
  };

  mostrarUno = async (req, res, next) => {
    try {
      const data = await ProveedorModel.porId(req.params.id);
      if (!data) return res.status(404).json({ message: "No existe un proveedor con ese id" });
      res.json({ data, message: "Proveedor encontrado" });
    } catch (err) { next(err); }
  };

  crearUno = async (req, res, next) => {
    try {
      const data = await ProveedorModel.crear(req.datos);
      res.status(201).json({ data, message: "Proveedor creado" });
    } catch (err) { next(err); }
  };

  actualizarUno = async (req, res, next) => {
    try {
      if (!(await ProveedorModel.porId(req.params.id))) {
        return res.status(404).json({ message: "No existe un proveedor con ese id" });
      }
      const data = await ProveedorModel.actualizar(req.params.id, req.datos);
      res.json({ data, message: "Proveedor actualizado" });
    } catch (err) { next(err); }
  };

  eliminarUno = async (req, res, next) => {
    try {
      const borrado = await ProveedorModel.eliminar(req.params.id);
      if (!borrado) return res.status(404).json({ message: "No existe un proveedor con ese id" });
      res.json({ message: "Proveedor eliminado (y sus equipos)" });
    } catch (err) { next(err); }
  };
}

module.exports = new ProveedorController();
