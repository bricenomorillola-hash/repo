const pool = require("../db/conexion");

const BASE =
  "SELECT u.id, u.nombre, u.email, r.nombre AS rol, u.creado_en " +
  "FROM usuarios u JOIN roles r ON r.id = u.rol_id ";

class UsuarioModel {
  static async todos() {
    const [filas] = await pool.query(BASE + "ORDER BY u.id");
    return filas;
  }

  static async porId(id) {
    const [filas] = await pool.query(BASE + "WHERE u.id = ?", [id]);
    return filas[0] || null;
  }

  // esta trae el hash, solo se usa en el login
  static async porEmailConClave(email) {
    const [filas] = await pool.query(
      "SELECT u.id, u.nombre, u.email, u.password, r.nombre AS rol " +
        "FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.email = ?",
      [email]
    );
    return filas[0] || null;
  }

  static async crear({ nombre, email, passwordHash, rol }) {
    const [r] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol_id) " +
        "SELECT ?, ?, ?, id FROM roles WHERE nombre = ?",
      [nombre, email, passwordHash, rol]
    );
    return this.porId(r.insertId);
  }

  static async cambiarRol(id, rol) {
    const [r] = await pool.query(
      "UPDATE usuarios SET rol_id = (SELECT id FROM roles WHERE nombre = ?) WHERE id = ?",
      [rol, id]
    );
    return r.affectedRows > 0;
  }

  static async eliminar(id) {
    const [r] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    return r.affectedRows > 0;
  }
}

module.exports = UsuarioModel;
