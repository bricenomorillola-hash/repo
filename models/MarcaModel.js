const pool = require("../db/conexion");

class MarcaModel {
  static async todas() {
    const [filas] = await pool.query("SELECT * FROM marca ORDER BY id");
    return filas;
  }

  static async porId(id) {
    const [filas] = await pool.query("SELECT * FROM marca WHERE id = ?", [id]);
    return filas[0] || null;
  }

  static async crear({ nombre, fundacion, pais }) {
    const [r] = await pool.query(
      "INSERT INTO marca (nombre, fundacion, pais) VALUES (?, ?, ?)",
      [nombre, fundacion, pais]
    );
    return this.porId(r.insertId);
  }

  static async actualizar(id, datos) {
    const campos = Object.keys(datos);
    const sets = campos.map((c) => c + " = ?").join(", ");
    await pool.query("UPDATE marca SET " + sets + " WHERE id = ?", [
      ...campos.map((c) => datos[c]),
      id,
    ]);
    return this.porId(id);
  }

  static async eliminar(id) {
    const [r] = await pool.query("DELETE FROM marca WHERE id = ?", [id]);
    return r.affectedRows > 0;
  }
}

module.exports = MarcaModel;
