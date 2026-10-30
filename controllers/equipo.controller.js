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
      return {
        status: 404,
        data: null,
        message: "No hay ningún equipo encontrado",
      };
    }
    return { status: 200, data: filas, message: "Equipos encontrados" };
  }
  async mostrarUno(idEt) {
    const [filas] = await pool.query("SELECT * FROM equipo WHERE id = ?", [
      idEt,
    ]);
    if (filas.length === 0) {
      return {
        status: 404,
        data: null,
        message: "No se ha encontrado el equipo",
      };
    }
    return { status: 200, data: filas[0], message: "Equipo encontrado" };
  }
  async mostrarETProv(idProv) {
    const [proveedores] = await pool.query(
      "SELECT id FROM proveedor WHERE id = ?",
      [idProv],
    );
    if (proveedores.length === 0) {
      return {
        status: 404,
        data: null,
        message: "No se ha encontrado el proveedor",
      };
    }
    const [filas] = await pool.query(
      "SELECT * FROM equipo WHERE proveedor_id = ?",
      [idProv],
    );
    if (filas.length === 0) {
      return {
        status: 404,
        data: null,
        message: "Este proveedor no tiene equipos",
      };
    }
    return {
      status: 200,
      data: filas,
      message: "Equipos del proveedor encontrados",
    };
  }
  async crearEquipo(idProv, nuevoEquipo) {
    const { nombre, tipo } = nuevoEquipo;
    if (!nombre || !tipo) {
      return { status: 400, data: null, message: "Faltan datos importantes" };
    }
    const [proveedores] = await pool.query(
      "SELECT id FROM proveedor WHERE id = ?",
      [idProv],
    );
    if (proveedores.length === 0) {
      return {
        status: 404,
        data: null,
        message: "No se ha encontrado el proveedor",
      };
    }
    const [resultado] = await pool.query(
      "INSERT INTO equipo (proveedor_id, nombre, tipo) VALUES (?, ?, ?)",
      [idProv, nombre, tipo],
    );
    const [filas] = await pool.query("SELECT * FROM equipo WHERE id = ?", [
      resultado.insertId,
    ]);
    return { status: 201, data: filas[0], message: "Equipo creado con éxito" };
  }
  async actualizarUno(idEt, nuevoEquipo) {
    const [existe] = await pool.query("SELECT * FROM equipo WHERE id = ?", [
      idEt,
    ]);
    if (existe.length === 0) {
      return {
        status: 404,
        data: null,
        message: "No se ha encontrado el equipo a actualizar",
      };
    }
    const actual = existe[0];
    const nombre = nuevoEquipo.nombre || actual.nombre;
    const tipo = nuevoEquipo.tipo || actual.tipo;

    await pool.query("UPDATE equipo SET nombre = ?, tipo = ? WHERE id = ?", [
      nombre,
      tipo,
      idEt,
    ]);
    const [filas] = await pool.query("SELECT * FROM equipo WHERE id = ?", [
      idEt,
    ]);
    return { status: 200, data: filas[0], message: "Equipo actualizado" };
  }
}

export default new equiposController();
