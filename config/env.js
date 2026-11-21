// lee el .env y revisa que estén las variables obligatorias
require("dotenv").config();

const obligatorias = ["DB_USER", "DB_NAME", "JWT_SECRET"];
const faltantes = obligatorias.filter((n) => !process.env[n]);

if (faltantes.length > 0) {
  console.error("Faltan variables en el archivo .env: " + faltantes.join(", "));
  console.error("Copie .env.example como .env y complete los valores.");
  process.exit(1);
}

module.exports = {
  port: process.env.PORT || 3010,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpira: process.env.JWT_EXPIRA || "2h",
  produccion: process.env.NODE_ENV === "production",
};
