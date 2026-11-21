const EquipoModel = require("../models/EquipoModel");
const ProveedorModel = require("../models/ProveedorModel");

class EquipoController {
  mostrarTodo = async (req, res, next) => {
    try {
      const data = await EquipoModel.todos();
      res.json({ data, message: "Equipos encontrados" });
    } catch (err) { next(err); }
  };

  mostrarUno = async (req, res, next) => {
    try {
      const data = await EquipoModel.porId(req.params.id);
      if (!data) return res.status(404).json({ message: "No existe un equipo con ese id" });
      res.json({ data, message: "Equipo encontrado" });
    } catch (err) { next(err); }
  };

  mostrarxProv = async (req, res, next) => {
    try {
      if (!(await ProveedorModel.porId(req.params.idProv))) {
        return res.status(404).json({ message: "No existe un proveedor con ese id" });
      }
      const data = await EquipoModel.porProveedor(req.params.idProv);
      res.json({ data, message: "Equipos del proveedor" });
    } catch (err) { next(err); }
  };

  mostrarxMarca = async (req, res, next) => {
    try {
      const data = await EquipoModel.porMarca(req.params.idMarca);
      res.json({ data, message: "Equipos de la marca" });
    } catch (err) { next(err); }
  };

  crearUno = async (req, res, next) => {
    try {
      if (!(await ProveedorModel.porId(req.params.idProv))) {
        return res.status(404).json({ message: "No existe un proveedor con ese id" });
      }
      const data = await EquipoModel.crear({ ...req.datos, proveedor_id: req.params.idProv });
      res.status(201).json({ data, message: "Equipo creado" });
    } catch (err) { next(err); }
  };

  actualizarUno = async (req, res, next) => {
    try {
      if (!(await EquipoModel.porId(req.params.id))) {
        return res.status(404).json({ message: "No existe un equipo con ese id" });
      }
      const data = await EquipoModel.actualizar(req.params.id, req.datos);
      res.json({ data, message: "Equipo actualizado" });
    } catch (err) { next(err); }
  };

  eliminarUno = async (req, res, next) => {
    try {
      const borrado = await EquipoModel.eliminar(req.params.id);
      if (!borrado) return res.status(404).json({ message: "No existe un equipo con ese id" });
      res.json({ message: "Equipo eliminado" });
    } catch (err) { next(err); }
  };
}

module.exports = new EquipoController();
