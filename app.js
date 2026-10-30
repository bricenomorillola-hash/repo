import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import proveedorrouter from "./routes/proveedor.routes.js";
import equiporouter from "./routes/equipo.routes.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "API de proveedores y equipos funcionando" });
});

app.use("/equipo", equiporouter);
app.use("/proveedor", proveedorrouter);

// Si ninguna ruta coincidió, se crea un error 404
app.use((req, res, next) => {
  next(createError(404, "Ruta no encontrada"));
});

// Manejador de errores: responde JSON (es una API, no hay páginas web que mostrar)
app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.status || 500;
  let message = err.message;
  // Errores típicos de MySQL, con mensaje entendible
  if (err.code === "ECONNREFUSED") message = "No hay conexión con MySQL. ¿Está encendido en XAMPP?";
  if (err.code === "ER_BAD_DB_ERROR") message = "La base de datos no existe. Importa db/schema.sql";
  res.status(status).json({ data: null, message });
});

export default app;
