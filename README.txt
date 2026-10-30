================================================================
 ACTIVIDAD 2.1: API DE PROVEEDORES Y EQUIPOS
================================================================


Proyecto academico de Backend.
Universidad Valle del Momboy (UVM) - Ingenieria en Computacion.

Repositorio: https://github.com/bricenomorillola-hash/repo


----------------------------------------------------------------
 CONTENIDO
----------------------------------------------------------------
 1. Requisitos previos
 2. Como funciona el conjunto
 3. Instalacion (Pasos 1 a 5)
 4. Configuracion (Paso 6)
 5. Uso con Thunder Client (Paso 7)
 6. Verificar que los datos se guardan (Paso 8)
 7. Solucion de problemas
 8. Autores


----------------------------------------------------------------
 1. REQUISITOS PREVIOS
----------------------------------------------------------------
  - XAMPP ............... Proporciona el servidor MySQL (y Apache
                          para usar phpMyAdmin)
                          https://www.apachefriends.org
  - Node.js (LTS) ....... Ejecuta la API. Incluye el comando npm
                          https://nodejs.org
  - Visual Studio Code .. Editor donde se abre el proyecto y se
                          usa la terminal
                          https://code.visualstudio.com
  - Thunder Client ...... Extension de VS Code para enviar
                          peticiones a la API
  - Git (opcional) ...... Clonar el repositorio en lugar de
                          descargar el ZIP
                          https://git-scm.com


----------------------------------------------------------------
 2. COMO FUNCIONA EL CONJUNTO
----------------------------------------------------------------
    Thunder Client  ->  API (Node/Express)  ->  MySQL

  - Thunder Client ..... Envia las peticiones a la API (listar,
                         crear, editar y borrar datos).
  - API (Node/Express) . Recibe cada peticion, ejecuta la consulta
                         SQL y responde en formato JSON.
  - XAMPP (MySQL) ...... Debe tener MySQL encendido; es donde se
                         almacenan los datos.
  - phpMyAdmin ......... Opcional: permite ver las tablas y
                         comprobar que los cambios se guardaron.


----------------------------------------------------------------
 3. INSTALACION
----------------------------------------------------------------

PASO 1. Obtener el proyecto

  Opcion A: descargar el ZIP
    1. Abrir https://github.com/bricenomorillola-hash/repo
    2. Pulsar Code > Download ZIP.
    3. Descomprimir en una carpeta de facil acceso, por ejemplo
       C:\proyectos\E-Actividad-2.1

  Opcion B: clonar con Git

    git clone https://github.com/bricenomorillola-hash/repo

  Debe verse una carpeta con app.js, package.json y las carpetas
  bin, controllers, db y routes.

  IMPORTANTE: verifique que los archivos queden directamente dentro
  de la carpeta del proyecto y no dentro de una carpeta adicional
  con el mismo nombre. Los comandos posteriores se ejecutan en la
  carpeta donde esta package.json.

PASO 2. Encender MySQL en XAMPP

  1. Abrir el XAMPP Control Panel.
  2. Pulsar Start en MySQL.
  3. Pulsar Start tambien en Apache (solo se necesita para abrir
     phpMyAdmin).

  Resultado esperado: "MySQL" y "Apache" con fondo verde y el
  puerto 3306 para MySQL.

PASO 3. Crear la base de datos (una sola vez)

  1. Abrir http://localhost/phpmyadmin
  2. Pulsar la pestana "Importar".
  3. Pulsar "Seleccionar archivo" y elegir db/schema.sql
  4. Bajar hasta el final y pulsar "Importar" (o "Continuar").

  Resultado esperado: mensaje verde de importacion completada. En
  el panel izquierdo aparece "examen_proveedores" con las tablas
  "equipo" y "proveedor".

  Dato util: este paso puede repetirse en cualquier momento para
  dejar la base de datos como al inicio, ya que borra y vuelve a
  crear las tablas.

PASO 4. Instalar las dependencias

  1. Abrir la carpeta del proyecto en Visual Studio Code
     (Archivo > Abrir carpeta).
  2. Abrir la terminal integrada (Terminal > Nueva terminal).
  3. Ejecutar:

       npm install

  Resultado esperado: un mensaje similar a "added 100 packages" y
  "found 0 vulnerabilities" (el numero puede variar).

PASO 5. Encender el servidor (API)

    npm start

  Resultado esperado (dos lineas):

    Servidor listo en http://localhost:3010
    Conectado a MySQL (base de datos "examen_proveedores")

  La segunda linea confirma que la API ya se comunica con MySQL.

  Para apagar la API presione Ctrl + C. Si se modifica el codigo,
  apaguela y vuelva a ejecutar npm start.


----------------------------------------------------------------
 4. CONFIGURACION (PASO 6)
----------------------------------------------------------------
XAMPP viene con el usuario "root" SIN contrasena y el puerto 3306,
que es lo que usa el proyecto. Normalmente no hace falta modificar
nada.

Si el MySQL del equipo tiene contrasena, abrir db/conexion.js y
localizar la linea:

    password: process.env.DB_PASSWORD || "",

Colocar la contrasena entre las comillas finales, por ejemplo:

    || "miClave123"

Guardar el archivo y reiniciar la API (Ctrl + C y luego npm start).


----------------------------------------------------------------
 5. USO CON THUNDER CLIENT (PASO 7)
----------------------------------------------------------------
Abrir Thunder Client (icono del rayo en VS Code) y pulsar
"New Request". Direccion base:

    http://localhost:3010

En las peticiones POST y PUT, ir a la pestana Body > JSON y pegar
el texto indicado en "Body".

PROVEEDORES

  Listar todos   GET     http://localhost:3010/proveedor/mostrarTodo
  Ver uno        GET     http://localhost:3010/proveedor/mostrarUno/3
  Crear          POST    http://localhost:3010/proveedor/crearUno
                 Body:   {"nombre":"Mi Proveedor","fundacion":2020,
                          "ubicacion":"Caracas"}
  Editar         PUT     http://localhost:3010/proveedor/actualizarUno/3
                 Body:   {"ubicacion":"Valencia"}
  Borrar         DELETE  http://localhost:3010/proveedor/eliminarUno/3

EQUIPOS

  Listar todos   GET     http://localhost:3010/equipo/mostrarTodo
  Ver uno        GET     http://localhost:3010/equipo/mostrarUno/101
  Ver los de un
  proveedor      GET     http://localhost:3010/equipo/mostrarxProv/1
  Crear          POST    http://localhost:3010/equipo/crearUno/1
  (el numero de  Body:   {"nombre":"Laptop","tipo":"Hardware"}
  la URL es el
  id del
  proveedor)
  Editar         PUT     http://localhost:3010/equipo/actualizarUno/101
                 Body:   {"tipo":"Servidores"}
  Borrar         DELETE  http://localhost:3010/equipo/eliminarUno/101

Notas:
  - Los ids usados en las URL (3, 101, 1) son solo ejemplos. Si
    algun id no existe, ejecute primero el listado correspondiente
    y use un id que aparezca en el.
  - En PUT solo es necesario enviar los campos que se desean
    cambiar; los demas conservan su valor.

Resultado esperado: una respuesta JSON con "data" y "message", y el
codigo 200 (o 201 al crear). Ejemplo al listar proveedores:

  { "data": [ { "id": 1, "nombre": "TechCorp Solutions", ... } ],
    "message": "Proveedores encontrados" }

CODIGOS DE ESTADO

  200 / 201  Todo correcto (201 = se creo un registro nuevo)
  400        Faltan datos en el body de la peticion
  404        No existe ese id (o esa ruta)
  500        Error interno, normalmente MySQL apagado. Revise el
             mensaje en la terminal


----------------------------------------------------------------
 6. VERIFICAR QUE LOS DATOS SE GUARDAN (PASO 8)
----------------------------------------------------------------
  1. En Thunder Client crear un proveedor (POST) y anotar el "id"
     que devuelve.
  2. Abrir phpMyAdmin > examen_proveedores > tabla proveedor >
     pestana Examinar.
  3. El proveedor nuevo debe aparecer. Apagar la API (Ctrl + C),
     volver a encenderla (npm start) y listar los proveedores: el
     registro sigue ahi.

Esto demuestra que los datos quedan almacenados de forma
permanente en MySQL.

Prueba adicional: eliminar un proveedor que tenga equipos
asociados (por ejemplo el 1) y luego listar los equipos. Los
equipos de ese proveedor tambien habran desaparecido, gracias a la
regla ON DELETE CASCADE definida en schema.sql.


----------------------------------------------------------------
 7. SOLUCION DE PROBLEMAS
----------------------------------------------------------------
  MySQL en rojo o "port 3306 in use"
      Hay otro MySQL ocupando el puerto. Abrir services.msc,
      detener el servicio "MySQL" (o "MySQL80") y pulsar Start de
      nuevo en XAMPP.

  Apache no arranca (puerto 80 ocupado)
      Cerrar programas que usen ese puerto (por ejemplo Skype) o
      reiniciar el equipo. Apache solo sirve para phpMyAdmin; la
      API funciona sin el.

  phpMyAdmin no abre
      Apache no esta en verde (revisar el Paso 2).

  "Access denied" al importar
      El MySQL local tiene contrasena. Configurarla en
      db/conexion.js

  "npm" no se reconoce como comando
      Instalar Node.js (LTS) o cerrar y volver a abrir VS Code.

  ECONNREFUSED
      MySQL esta apagado. Volver al Paso 2.

  ER_BAD_DB_ERROR
      La base de datos no existe. Realizar el Paso 3.

  ER_ACCESS_DENIED_ERROR
      Usuario o contrasena incorrectos. Ver seccion 4.

  Port 3010 is already in use
      Ya hay una instancia de la API abierta en otra terminal.
      Cerrarla con Ctrl + C.


----------------------------------------------------------------
 8. AUTORES
----------------------------------------------------------------
  - Luis A. Briceno M.     C.I: 32.550.750
  - Luis F. Olivar V.      C.I: 32.668.592
  - Victor H. Fernandez P. C.I: 32.462.505

  Tutor: Prof. Anggelo Huz
