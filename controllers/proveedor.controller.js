import pool from "../db/conexion.js";

// Cada método devuelve { status, data, message }.
// La ruta solo se encarga de enviar eso como JSON.
// Los "?" en las consultas son parámetros: MySQL los rellena de forma segura
// (así nadie puede colar código SQL malicioso, lo que se llama "SQL injection").

export default new proveedorController();
