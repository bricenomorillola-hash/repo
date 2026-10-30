import pool from "../db/conexion.js";

class equiposController {
  async mostrarTodo() {
    const [filas] = await pool.query(
      `SELECT e.id, e.proveedor_id, e.nombre, e.tipo, p.nombre AS proveedor
       FROM equipo e
       JOIN proveedor p ON p.id = e.proveedor_id
       ORDER BY e.id`,
    );
    if (filas.length === 0) {
      return { status: 404, data: null, message: "No hay ningún equipo encontrado" };
    }
    return { status: 200, data: filas, message: "Equipos encontrados" };
  }
   async mostrarUno(idEt) {
    const [filas] = await pool.query("SELECT * FROM equipo WHERE id = ?", [idEt]);
    if (filas.length === 0) {
      return { status: 404, data: null, message: "No se ha encontrado el equipo" };
    }
    return { status: 200, data: filas[0], message: "Equipo encontrado" };
  }
}

export default new equiposController();
