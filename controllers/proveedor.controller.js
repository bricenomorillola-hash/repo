import pool from "../db/conexion.js";

class proveedorController {
  async mostrarTodo() {
    const [filas] = await pool.query("SELECT * FROM proveedor ORDER BY id");
    if (filas.length === 0) {
      return { status: 404, data: null, message: "No hay ningún proveedor encontrado" };
    }
    return { status: 200, data: filas, message: "Proveedores encontrados" };
  }
   async mostrarUno(idProv) {
    const [filas] = await pool.query("SELECT * FROM proveedor WHERE id = ?", [idProv]);
    if (filas.length === 0) {
      return { status: 404, data: null, message: "No se ha encontrado el proveedor" };
    }
    return { status: 200, data: filas[0], message: "Proveedor encontrado" };
  }
 
  async crearProveedor(nuevoProveedor) {
    const { nombre, fundacion, ubicacion } = nuevoProveedor;
    if (!nombre || !fundacion || !ubicacion) {
      return { status: 400, data: null, message: "Faltan datos importantes" };
    }
    const [resultado] = await pool.query(
      "INSERT INTO proveedor (nombre, fundacion, ubicacion) VALUES (?, ?, ?)",
      [nombre, fundacion, ubicacion],
    );
    const [filas] = await pool.query("SELECT * FROM proveedor WHERE id = ?", [resultado.insertId]);
    return { status: 201, data: filas[0], message: "Proveedor creado con éxito" };
  }

}

export default new proveedorController();
