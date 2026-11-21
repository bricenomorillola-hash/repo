const MarcaModel = require("../models/MarcaModel");

class MarcaController {
  mostrarTodo = async (req, res, next) => {
    try {
      const data = await MarcaModel.todas();
      res.json({ data, message: "Marcas encontradas" });
    } catch (err) { next(err); }
  };

  mostrarUno = async (req, res, next) => {
    try {
      const data = await MarcaModel.porId(req.params.id);
      if (!data) return res.status(404).json({ message: "No existe una marca con ese id" });
      res.json({ data, message: "Marca encontrada" });
    } catch (err) { next(err); }
  };

  crearUno = async (req, res, next) => {
    try {
      const data = await MarcaModel.crear(req.datos);
      res.status(201).json({ data, message: "Marca creada" });
    } catch (err) { next(err); }
  };

  actualizarUno = async (req, res, next) => {
    try {
      if (!(await MarcaModel.porId(req.params.id))) {
        return res.status(404).json({ message: "No existe una marca con ese id" });
      }
      const data = await MarcaModel.actualizar(req.params.id, req.datos);
      res.json({ data, message: "Marca actualizada" });
    } catch (err) { next(err); }
  };

  eliminarUno = async (req, res, next) => {
    try {
      const borrado = await MarcaModel.eliminar(req.params.id);
      if (!borrado) return res.status(404).json({ message: "No existe una marca con ese id" });
      res.json({ message: "Marca eliminada" });
    } catch (err) { next(err); }
  };
}

module.exports = new MarcaController();
