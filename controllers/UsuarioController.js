const UsuarioModel = require("../models/UsuarioModel");

class UsuarioController {
  mostrarTodo = async (req, res, next) => {
    try {
      const data = await UsuarioModel.todos();
      res.json({ data, message: "Usuarios encontrados" });
    } catch (err) { next(err); }
  };

  cambiarRol = async (req, res, next) => {
    try {
      if (req.params.id === req.usuario.id) {
        return res.status(400).json({ message: "No puede cambiar su propio rol" });
      }
      const ok = await UsuarioModel.cambiarRol(req.params.id, req.datos.rol);
      if (!ok) return res.status(404).json({ message: "No existe un usuario con ese id" });
      const data = await UsuarioModel.porId(req.params.id);
      res.json({ data, message: "Rol actualizado" });
    } catch (err) { next(err); }
  };

  eliminarUno = async (req, res, next) => {
    try {
      if (req.params.id === req.usuario.id) {
        return res.status(400).json({ message: "No puede eliminar su propio usuario" });
      }
      const ok = await UsuarioModel.eliminar(req.params.id);
      if (!ok) return res.status(404).json({ message: "No existe un usuario con ese id" });
      res.json({ message: "Usuario eliminado" });
    } catch (err) { next(err); }
  };
}

module.exports = new UsuarioController();
