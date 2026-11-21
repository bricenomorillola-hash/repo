const pool = require("../db/conexion");

// base de las consultas, junta los nombres del proveedor y la marca
const BASE =
  "SELECT e.id, e.nombre, e.tipo, e.proveedor_id, p.nombre AS proveedor, " +
  "e.marca_id, m.nombre AS marca " +
  "FROM equipo e " +
  "JOIN proveedor p ON p.id = e.proveedor_id " +
  "LEFT JOIN marca m ON m.id = e.marca_id ";

class EquipoModel {
  static async todos() {
    const [filas] = await pool.query(BASE + "ORDER BY e.id");
    return filas;
  }

  static async porId(id) {
    const [filas] = await pool.query(BASE + "WHERE e.id = ?", [id]);
    return filas[0] || null;
  }

  static async porProveedor(idProveedor) {
    const [filas] = await pool.query(BASE + "WHERE e.proveedor_id = ? ORDER BY e.id", [idProveedor]);
    return filas;
  }

  static async porMarca(idMarca) {
    const [filas] = await pool.query(BASE + "WHERE e.marca_id = ? ORDER BY e.id", [idMarca]);
    return filas;
  }

  static async crear({ nombre, tipo, proveedor_id, marca_id }) {
    const [r] = await pool.query(
      "INSERT INTO equipo (nombre, tipo, proveedor_id, marca_id) VALUES (?, ?, ?, ?)",
      [nombre, tipo, proveedor_id, marca_id]
    );
    return this.porId(r.insertId);
  }

  static async actualizar(id, datos) {
    const campos = Object.keys(datos);
    const sets = campos.map((c) => c + " = ?").join(", ");
    await pool.query("UPDATE equipo SET " + sets + " WHERE id = ?", [
      ...campos.map((c) => datos[c]),
      id,
    ]);
    return this.porId(id);
  }

  static async eliminar(id) {
    const [r] = await pool.query("DELETE FROM equipo WHERE id = ?", [id]);
    return r.affectedRows > 0;
  }
}

module.exports = EquipoModel;
