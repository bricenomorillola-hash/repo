-- ============================================================
-- Base de datos del examen de proveedores y equipos
-- Se ejecuta UNA vez en phpMyAdmin (pestaña "Importar" o "SQL")
-- ============================================================

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS examen_proveedores
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE examen_proveedores;

-- Si ya existían, se borran para empezar limpio (primero equipo, porque depende de proveedor)
DROP TABLE IF EXISTS equipo;
DROP TABLE IF EXISTS proveedor;

CREATE TABLE proveedor (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(150) NOT NULL,
  fundacion  SMALLINT     NOT NULL,
  ubicacion  VARCHAR(150) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE equipo (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  proveedor_id INT          NOT NULL,
  nombre       VARCHAR(150) NOT NULL,
  tipo         VARCHAR(100) NOT NULL,
  -- Si se borra un proveedor, se borran sus equipos automáticamente
  CONSTRAINT fk_equipo_proveedor
    FOREIGN KEY (proveedor_id) REFERENCES proveedor(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Datos de ejemplo (los mismos del examen)
INSERT INTO proveedor (id, nombre, fundacion, ubicacion) VALUES
  (1,  'TechCorp Solutions',               2005, 'Madrid, España'),
  (2,  'Global Industrial S.A.',           1998, 'Ciudad de México, México'),
  (3,  'Innovaciones Médicas del Sur',     2012, 'Buenos Aires, Argentina'),
  (4,  'Equipamientos y Servitech',        2010, 'Bogotá, Colombia'),
  (5,  'Logística y Maquinaria Avanzada',  1985, 'Santiago, Chile'),
  (6,  'Soluciones Digitales del Norte',   2018, 'Monterrey, México'),
  (7,  'Sistemas de Potencia S.L.',        1995, 'Barcelona, España'),
  (8,  'Constructora e Inversiones Andinas', 2002, 'Lima, Perú'),
  (9,  'Tecnología y Redes del Caribe',    2015, 'San Juan, Puerto Rico'),
  (10, 'Automatización Industrial Total',  2008, 'Valencia, Venezuela');

INSERT INTO equipo (id, proveedor_id, nombre, tipo) VALUES
  (101, 1,  'Servidor Rack Pro X',            'Hardware'),
  (102, 2,  'Torno CNC de Alta Precisión',    'Maquinaria'),
  (103, 3,  'Ecógrafo Portátil 4D',           'Médico'),
  (104, 5,  'Transpaleta Hidráulica 2T',      'Logística'),
  (105, 7,  'Generador Diésel 50kW',          'Energía'),
  (106, 1,  'Switch Administrable 24 Puertos','Redes'),
  (107, 10, 'Compresor de Aire Industrial',   'Neumática'),
  (108, 8,  'Estación Total Geodésica',       'Topografía'),
  (109, 4,  'Impresora 3D Industrial FDM',    'Manufactura'),
  (110, 7,  'Sistema de UPS Trifásico 10kVA', 'Energía');
