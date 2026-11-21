const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
require("./config/env");

const { cargarUsuario } = require("./middlewares/auth");
const { noEncontrada, manejarError } = require("./middlewares/errores");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cargarUsuario);

app.use("/", require("./routes/vistas"));
app.use("/auth", require("./routes/auth"));
app.use("/proveedor", require("./routes/proveedor"));
app.use("/marca", require("./routes/marca"));
app.use("/equipo", require("./routes/equipo"));
app.use("/usuario", require("./routes/usuario"));

app.use(noEncontrada);
app.use(manejarError);

module.exports = app;
