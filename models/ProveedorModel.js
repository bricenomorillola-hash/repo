const pool = require("../db/conexion");

class ProveedorModel {
  static async todos() {
    const [filas] = await pool.query("SELECT * FROM proveedor ORDER BY id");
    return filas;
  }

  static async porId(id) {
    const [filas] = await pool.query("SELECT * FROM proveedor WHERE id = ?", [id]);
    return filas[0] || null;
  }

  static async crear({ nombre, fundacion, ubicacion }) {
    const [r] = await pool.query(
      "INSERT INTO proveedor (nombre, fundacion, ubicacion) VALUES (?, ?, ?)",
      [nombre, fundacion, ubicacion]
    );
    return this.porId(r.insertId);
  }

  static async actualizar(id, datos) {
    const campos = Object.keys(datos);
    const sets = campos.map((c) => c + " = ?").join(", ");
    await pool.query("UPDATE proveedor SET " + sets + " WHERE id = ?", [
      ...campos.map((c) => datos[c]),
      id,
    ]);
    return this.porId(id);
  }

  static async eliminar(id) {
    const [r] = await pool.query("DELETE FROM proveedor WHERE id = ?", [id]);
    return r.affectedRows > 0;
  }
}

module.exports = ProveedorModel;
