// crea la base de datos y corre los .sql de db/migrations (cada uno una sola vez)
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const config = require("../config/env");

async function migrar() {
  const conexion = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });

  try {
    await conexion.query("CREATE DATABASE IF NOT EXISTS `" + config.db.database + "` CHARACTER SET utf8mb4");
    await conexion.query("USE `" + config.db.database + "`");
    await conexion.query(
      "CREATE TABLE IF NOT EXISTS migraciones (" +
        "archivo VARCHAR(150) PRIMARY KEY, " +
        "ejecutada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    );

    const carpeta = path.join(__dirname, "migrations");
    const archivos = fs.readdirSync(carpeta).filter((a) => a.endsWith(".sql")).sort();
    const [hechas] = await conexion.query("SELECT archivo FROM migraciones");
    const yaEjecutadas = hechas.map((f) => f.archivo);

    for (const archivo of archivos) {
      if (yaEjecutadas.includes(archivo)) {
        console.log("Ya aplicada: " + archivo);
        continue;
      }
      await conexion.query(fs.readFileSync(path.join(carpeta, archivo), "utf8"));
      await conexion.query("INSERT INTO migraciones (archivo) VALUES (?)", [archivo]);
      console.log("Aplicada:    " + archivo);
    }
    console.log('Migraciones listas en la base de datos "' + config.db.database + '"');
  } finally {
    await conexion.end();
  }
}

migrar().catch((err) => {
  console.error("Error en la migración: " + err.message);
  process.exit(1);
});
