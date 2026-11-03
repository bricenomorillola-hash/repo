import pool from "../db/conexion.js";

class marcaController {
  async mostrarTodo() {
    const [filas] = await pool.query("SELECT * FROM marca ORDER BY id");
    if (filas.length === 0) {
      return { status: 404, data: null, message: "No hay ninguna marca encontrada" };
    }
    return { status: 200, data: filas, message: "Marcas encontradas" };
  }

  async mostrarUno(idMarca) {
    const [filas] = await pool.query("SELECT * FROM marca WHERE id = ?", [idMarca]);
    if (filas.length === 0) {
      return { status: 404, data: null, message: "No se ha encontrado la marca" };
    }
    return { status: 200, data: filas[0], message: "Marca encontrada" };
  }

  async crearMarca(nuevaMarca) {
    const { nombre, fundacion, pais } = nuevaMarca;
    if (!nombre || !fundacion || !pais) {
      return { status: 400, data: null, message: "Faltan datos importantes" };
    }
    const [resultado] = await pool.query(
      "INSERT INTO marca (nombre, fundacion, pais) VALUES (?, ?, ?)",
      [nombre, fundacion, pais],
    );
    const [filas] = await pool.query("SELECT * FROM marca WHERE id = ?", [resultado.insertId]);
    return { status: 201, data: filas[0], message: "Marca creada con éxito" };
  }

  async actualizarUno(idMarca, nuevaMarca) {
    const [existe] = await pool.query("SELECT * FROM marca WHERE id = ?", [idMarca]);
    if (existe.length === 0) {
      return { status: 404, data: null, message: "No se ha encontrado la marca a actualizar" };
    }
    const actual = existe[0];
    const nombre = nuevaMarca.nombre || actual.nombre;
    const fundacion = nuevaMarca.fundacion || actual.fundacion;
    const pais = nuevaMarca.pais || actual.pais;

    await pool.query(
      "UPDATE marca SET nombre = ?, fundacion = ?, pais = ? WHERE id = ?",
      [nombre, fundacion, pais, idMarca],
    );
    const [filas] = await pool.query("SELECT * FROM marca WHERE id = ?", [idMarca]);
    return { status: 200, data: filas[0], message: "Marca actualizada" };
  }

  async eliminarUno(idMarca) {
    const [resultado] = await pool.query("DELETE FROM marca WHERE id = ?", [idMarca]);
    if (resultado.affectedRows === 0) {
      return { status: 404, data: null, message: "No se ha encontrado la marca a eliminar" };
    }
    return {
      status: 200,
      data: { idEliminado: Number(idMarca) },
      message: "Marca eliminada (y sus equipos)",
    };
  }
}

export default new marcaController();
