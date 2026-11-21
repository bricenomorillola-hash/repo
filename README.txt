================================================================
 ACTIVIDAD 2.2: AUTENTICACIÓN CON JWT Y ROLES
 API de Proveedores, Equipos y Marcas
================================================================
Universidad Valle del Momboy (UVM) - Ingeniería en Computación
Docente: Prof. Anggelo Huz
Repositorio: https://github.com/bricenomorillola-hash/repo

Integrantes:
  - Luis A. Briceño M.
  - Luis F. Olivar V.
  - Victor H. Fernandez P.


----------------------------------------------------------------
 QUÉ HACE EL SISTEMA
----------------------------------------------------------------
Es una API con páginas web (EJS) para manejar proveedores, marcas
y equipos. Ahora tiene inicio de sesión: cada usuario tiene un rol
y el rol decide qué puede hacer. La sesión se maneja con JWT.

Entidades (5): roles, usuarios, proveedor, marca y equipo.


----------------------------------------------------------------
 PASOS PARA EJECUTARLO
----------------------------------------------------------------
1) Instalar Node.js (versión LTS) y XAMPP (para MySQL).

2) Encender MySQL en el panel de XAMPP (botón Start).

3) Abrir la carpeta del proyecto en la terminal e instalar:

       npm install

4) Crear el archivo .env (no está en GitHub). Se copia del ejemplo:

       Windows:   copy .env.example .env
       Mac/Linux: cp .env.example .env

   Abrir el .env y revisar estos datos:

       PORT=3010
       DB_HOST=localhost
       DB_PORT=3306
       DB_USER=root
       DB_PASSWORD=
       DB_NAME=examen_proveedores
       JWT_SECRET=una_frase_larga_y_secreta
       JWT_EXPIRA=2h

   En XAMPP el usuario es root y la contraseña va vacía.
   Cambie JWT_SECRET por una frase suya.

5) Crear las tablas y los datos de prueba (migraciones):

       npm run setup

   Ojo: si ya existía la base "examen_proveedores" de la
   actividad anterior, bórrela primero en phpMyAdmin.

6) Encender el servidor:

       npm start

   Debe verse:
       Servidor listo en http://localhost:3010
       Conectado a MySQL (base de datos "examen_proveedores")

7) Abrir en el navegador: http://localhost:3010


----------------------------------------------------------------
 USUARIOS DE PRUEBA
----------------------------------------------------------------
  Rol       Correo            Contraseña
  admin     admin@uvm.com     Admin123*
  editor    editor@uvm.com    Editor123*
  usuario   usuario@uvm.com   Usuario123*

Hay 7 usuarios más (maria, carlos, ana, jose, laura, pedro y
sofia @uvm.com). Los editores (maria y carlos) usan Editor123* y
los demás Usuario123*.

Quien se registra desde la página recibe el rol "usuario".
El admin puede cambiarlo en la página /usuarios.


----------------------------------------------------------------
 QUIÉN PUEDE HACER QUÉ
----------------------------------------------------------------
  Sin login (público):
    Ver proveedores y marcas, registrarse e iniciar sesión.

  Cualquier usuario con login (admin, editor, usuario):
    Ver los equipos y su perfil.

  Solo EDITOR:
    Crear proveedor, marca y equipo.

  ADMIN y EDITOR:
    Actualizar proveedor, marca y equipo.

  Solo ADMIN:
    Eliminar proveedor, marca y equipo.
    Ver usuarios, cambiar el rol de un usuario y eliminar usuarios.

Si un rol sin permiso intenta una operación recibe el código 403
con un mensaje que empieza con "ADVERTENCIA". Si no ha iniciado
sesión recibe 401.


----------------------------------------------------------------
 USO CON THUNDER CLIENT
----------------------------------------------------------------
1) Iniciar sesión:
     POST http://localhost:3010/auth/login
     Body (JSON): {"email":"admin@uvm.com","password":"Admin123*"}
   La respuesta trae un "token".

2) En las demás peticiones agregar este header:
     Authorization: Bearer <pegue_aquí_el_token>
   (En Thunder Client: pestaña Auth > Bearer)

RUTAS
  Auth
    POST   /auth/registro       {"nombre","email","password"}
    POST   /auth/login          {"email","password"}
    GET    /auth/logout
    GET    /auth/perfil         (con login)

  Proveedores
    GET    /proveedor/mostrarTodo             público
    GET    /proveedor/mostrarUno/:id          público
    POST   /proveedor/crearUno                editor
           {"nombre","fundacion","ubicacion"}
    PUT    /proveedor/actualizarUno/:id       admin, editor
    DELETE /proveedor/eliminarUno/:id         admin

  Marcas
    GET    /marca/mostrarTodo                 público
    GET    /marca/mostrarUno/:id              público
    POST   /marca/crearUno                    editor
           {"nombre","fundacion","pais"}
    PUT    /marca/actualizarUno/:id           admin, editor
    DELETE /marca/eliminarUno/:id             admin

  Equipos (todos requieren login)
    GET    /equipo/mostrarTodo
    GET    /equipo/mostrarUno/:id
    GET    /equipo/mostrarxProv/:idProv
    GET    /equipo/mostrarxMarca/:idMarca
    POST   /equipo/crearUno/:idProv           editor
           {"nombre","tipo","marca_id"}
    PUT    /equipo/actualizarUno/:id          admin, editor
    DELETE /equipo/eliminarUno/:id            admin

  Usuarios (solo admin)
    GET    /usuario/mostrarTodo
    PUT    /usuario/cambiarRol/:id            {"rol":"editor"}
    DELETE /usuario/eliminarUno/:id

PÁGINAS (EJS)
    /  /login  /registro  /proveedores  /marcas   (públicas)
    /equipos                                      (con login)
    /usuarios                                     (solo admin)


----------------------------------------------------------------
 ESTRUCTURA DEL PROYECTO
----------------------------------------------------------------
  app.js            Configura Express y conecta las rutas
  bin/www           Enciende el servidor
  config/env.js     Lee y revisa el .env
  db/               Conexión, migraciones (migrations/) y seed
  routes/           Define las URL y quién puede entrar
  middlewares/      auth.js (JWT y roles), validar.js, errores.js
  controllers/      Clases que atienden cada petición
  models/           Clases que hacen las consultas SQL
  views/            Páginas EJS
  public/           CSS y JS del navegador


----------------------------------------------------------------
 MIGRAR A OTRO SERVIDOR
----------------------------------------------------------------
1) Copiar el proyecto (git clone) en el nuevo servidor.
2) npm install
3) Crear el .env con los datos de MySQL de ese servidor.
4) npm run migrate   (crea la base y las tablas; si ya existen
                      no hace nada)
5) npm run seed      (opcional, datos de prueba)
6) npm start


----------------------------------------------------------------
 SOLUCIÓN DE PROBLEMAS
----------------------------------------------------------------
  "Faltan variables en el archivo .env"
      Falta crear el .env (paso 4).

  ECONNREFUSED / "No se pudo conectar a MySQL"
      MySQL está apagado en XAMPP (paso 2).

  "Access denied for user"
      DB_USER o DB_PASSWORD del .env están mal.

  "No hay roles. Ejecute primero npm run migrate"
      Corra npm run migrate antes de npm run seed.

  "Port 3010 is already in use"
      Hay otro servidor abierto. Ciérrelo con Ctrl + C.

  Cambié el código y no se nota
      Apague con Ctrl + C y vuelva a correr npm start.
