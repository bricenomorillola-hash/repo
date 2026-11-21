const anioActual = new Date().getFullYear();

function validarCampo(nombre, valor, regla) {
  switch (regla.tipo) {
    case "texto":
      if (typeof valor !== "string" || valor.trim() === "") return nombre + " debe ser un texto no vacío";
      if (valor.trim().length > 100) return nombre + " es demasiado largo";
      break;
    case "anio":
      if (!Number.isInteger(valor) || valor < 1800 || valor > anioActual) {
        return nombre + " debe ser un año entero entre 1800 y " + anioActual;
      }
      break;
    case "id":
      if (!Number.isInteger(valor) || valor <= 0) return nombre + " debe ser un número entero positivo";
      break;
    case "email":
      if (typeof valor !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) {
        return nombre + " debe ser un correo válido";
      }
      break;
    case "clave":
      if (typeof valor !== "string" || valor.length < 6 || valor.length > 60) {
        return nombre + " debe tener entre 6 y 60 caracteres";
      }
      break;
    case "lista":
      if (!regla.opciones.includes(valor)) return nombre + " debe ser uno de: " + regla.opciones.join(", ");
      break;
  }
  return null;
}

// completo = true: todos los campos obligatorios (POST), false: basta con uno (PUT)
function validarBody(esquema, completo) {
  return (req, res, next) => {
    const body = req.body || {};
    const campos = Object.keys(esquema);
    const errores = [];
    const vacio = (v) => v === undefined || v === null || v === "";

    if (completo) {
      campos.forEach((c) => {
        if (vacio(body[c])) errores.push("Falta el dato obligatorio: " + c);
      });
    } else if (campos.every((c) => body[c] === undefined)) {
      errores.push("Envíe al menos uno de estos campos: " + campos.join(", "));
    }

    campos.forEach((c) => {
      if (!vacio(body[c])) {
        const error = validarCampo(c, body[c], esquema[c]);
        if (error) errores.push(error);
      }
    });

    if (errores.length > 0) {
      return res.status(400).json({ message: "Datos inválidos", errores });
    }

    // solo pasan los campos del esquema
    req.datos = {};
    campos.forEach((c) => {
      if (!vacio(body[c])) req.datos[c] = typeof body[c] === "string" ? body[c].trim() : body[c];
    });
    next();
  };
}

// revisa que los :id de la URL sean números enteros positivos
function validarParams(...nombres) {
  return (req, res, next) => {
    for (const n of nombres) {
      const num = Number(req.params[n]);
      if (!Number.isInteger(num) || num <= 0) {
        return res.status(400).json({ message: "El parámetro " + n + " debe ser un número entero positivo" });
      }
      req.params[n] = num;
    }
    next();
  };
}

module.exports = { validarBody, validarParams };
