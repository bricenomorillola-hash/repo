// datos de prueba (10 o más por entidad, roles tiene solo los 3 del sistema)
// se puede correr varias veces, solo agrega lo que falte
const bcrypt = require("bcryptjs");
const pool = require("./conexion");

const USUARIOS = [
  ["Administrador", "admin@uvm.com", "admin", "ADMIN"],
  ["Editor Demo", "editor@uvm.com", "editor", "EDITOR"],
  ["Usuario Demo", "usuario@uvm.com", "usuario", "USUARIO"],
  ["María Fernández", "maria@uvm.com", "editor", "EDITOR"],
  ["Carlos Pérez", "carlos@uvm.com", "editor", "EDITOR"],
  ["Ana Rodríguez", "ana@uvm.com", "usuario", "USUARIO"],
  ["José González", "jose@uvm.com", "usuario", "USUARIO"],
  ["Laura Mendoza", "laura@uvm.com", "usuario", "USUARIO"],
  ["Pedro Sánchez", "pedro@uvm.com", "usuario", "USUARIO"],
  ["Sofía Ramírez", "sofia@uvm.com", "usuario", "USUARIO"],
];

const MARCAS = [
  ["Dell", 1984, "Estados Unidos"],
  ["HP", 1939, "Estados Unidos"],
  ["Lenovo", 1984, "China"],
  ["Acer", 1976, "Taiwán"],
  ["Asus", 1989, "Taiwán"],
  ["Apple", 1976, "Estados Unidos"],
  ["Samsung", 1938, "Corea del Sur"],
  ["Cisco", 1984, "Estados Unidos"],
  ["Huawei", 1987, "China"],
  ["Logitech", 1981, "Suiza"],
];

const PROVEEDORES = [
  ["TechCorp Solutions", 2010, "Caracas"],
  ["Distribuidora Andina", 2005, "Valera"],
  ["Servicios Informáticos Trujillo", 2008, "Trujillo"],
  ["Redes y Sistemas C.A.", 2014, "Maracaibo"],
  ["Tecnomundo", 2001, "Valencia"],
  ["DataCenter Occidente", 2016, "Barquisimeto"],
  ["Suministros Carvajal", 2009, "Carvajal"],
  ["Electro Sistemas", 1998, "Mérida"],
  ["Compunet Venezuela", 2011, "Caracas"],
  ["Soluciones Digitales", 2018, "Puerto Ordaz"],
];

const EQUIPOS = [
  ["Laptop Latitude", "Hardware", "TechCorp Solutions", "Dell"],
  ["Servidor ProLiant", "Servidores", "TechCorp Solutions", "HP"],
  ["Desktop ThinkCentre", "Hardware", "Distribuidora Andina", "Lenovo"],
  ["Laptop Aspire", "Hardware", "Distribuidora Andina", "Acer"],
  ["Monitor ProArt", "Periféricos", "Servicios Informáticos Trujillo", "Asus"],
  ["MacBook Air", "Hardware", "Tecnomundo", "Apple"],
  ["Tablet Galaxy Tab", "Móviles", "Tecnomundo", "Samsung"],
  ["Switch Catalyst", "Redes", "Redes y Sistemas C.A.", "Cisco"],
  ["Router Catalyst", "Redes", "Redes y Sistemas C.A.", "Cisco"],
  ["Access Point AirEngine", "Redes", "DataCenter Occidente", "Huawei"],
  ["Servidor PowerEdge", "Servidores", "DataCenter Occidente", "Dell"],
  ["Teclado MX Keys", "Periféricos", "Suministros Carvajal", "Logitech"],
  ["Mouse MX Master", "Periféricos", "Suministros Carvajal", "Logitech"],
  ["Impresora LaserJet", "Impresión", "Electro Sistemas", "HP"],
  ["Celular Galaxy S", "Móviles", "Compunet Venezuela", "Samsung"],
  ["Laptop IdeaPad", "Hardware", "Soluciones Digitales", "Lenovo"],
];

async function sembrar() {
  const [roles] = await pool.query("SELECT id, nombre FROM roles");
  if (roles.length === 0) {
    throw new Error('No hay roles. Ejecute primero "npm run migrate".');
  }
  const rolId = (n) => roles.find((r) => r.nombre === n).id;

  const claves = {
    ADMIN: process.env.SEED_ADMIN_PASSWORD || "Admin123*",
    EDITOR: process.env.SEED_EDITOR_PASSWORD || "Editor123*",
    USUARIO: process.env.SEED_USUARIO_PASSWORD || "Usuario123*",
  };

  for (const [nombre, email, rol, tipoClave] of USUARIOS) {
    const [existe] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (existe.length > 0) continue;
    const hash = await bcrypt.hash(claves[tipoClave], 10);
    await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)",
      [nombre, email, hash, rolId(rol)]
    );
  }

  for (const [nombre, fundacion, pais] of MARCAS) {
    await pool.query(
      "INSERT INTO marca (nombre, fundacion, pais) SELECT ?, ?, ? " +
        "WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nombre = ?)",
      [nombre, fundacion, pais, nombre]
    );
  }

  for (const [nombre, fundacion, ubicacion] of PROVEEDORES) {
    await pool.query(
      "INSERT INTO proveedor (nombre, fundacion, ubicacion) SELECT ?, ?, ? " +
        "WHERE NOT EXISTS (SELECT 1 FROM proveedor WHERE nombre = ?)",
      [nombre, fundacion, ubicacion, nombre]
    );
  }

  for (const [nombre, tipo, proveedor, marca] of EQUIPOS) {
    await pool.query(
      "INSERT INTO equipo (nombre, tipo, proveedor_id, marca_id) " +
        "SELECT ?, ?, p.id, m.id FROM proveedor p, marca m " +
        "WHERE p.nombre = ? AND m.nombre = ? " +
        "AND NOT EXISTS (SELECT 1 FROM equipo WHERE nombre = ?)",
      [nombre, tipo, proveedor, marca, nombre]
    );
  }

  console.log("Datos de prueba listos.");
}

sembrar()
  .catch((err) => {
    console.error("Error en el seed: " + err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
