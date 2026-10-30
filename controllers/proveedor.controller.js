import pool from "../db/conexion.js";

class proveedorController {
  async mostrarTodo() {
    const [filas] = await pool.query("SELECT * FROM proveedor ORDER BY id");
    if (filas.length === 0) {
      return { status: 404, data: null, message: "No hay ningún proveedor encontrado" };
    }
    return { status: 200, data: filas, message: "Proveedores encontrados" };
  }
}

export default new proveedorController();
