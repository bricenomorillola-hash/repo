import mysql from "mysql2/promise";

// Datos de conexión. Los valores por defecto son los de XAMPP recién instalado:
// usuario "root" y SIN contraseña. Si cambiaste algo, ajusta aquí
// (o define variables de entorno DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT).
const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "examen_proveedores",
};

// Un "pool" mantiene varias conexiones abiertas y las reutiliza,
// en vez de abrir y cerrar una conexión nueva en cada petición.
const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
});

// Se llama al arrancar el servidor para avisar enseguida si MySQL no responde.
export async function probarConexion() {
  try {
    const conexion = await pool.getConnection();
    await conexion.ping();
    conexion.release();
    console.log(`✔ Conectado a MySQL (base de datos "${config.database}")`);
  } catch (error) {
    console.error("✘ No se pudo conectar a MySQL:", error.code || error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("  → ¿Está MySQL en verde (Start) en el panel de XAMPP?");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error('  → La base de datos no existe. Importa db/schema.sql en phpMyAdmin.');
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("  → Usuario o contraseña incorrectos en db/conexion.js");
    }
  }
}

export default pool;
