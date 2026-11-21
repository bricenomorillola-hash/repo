// manda los formularios y botones a la API con fetch (la cookie con el JWT viaja sola)

function mostrarMensaje(texto, esError) {
  const caja = document.getElementById("mensaje");
  if (!caja) return alert(texto);
  caja.textContent = texto;
  caja.className = "mensaje " + (esError ? "error" : "ok");
}

async function llamarApi(url, metodo, cuerpo) {
  const opciones = { method: metodo, headers: { Accept: "application/json" } };
  if (cuerpo) {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(cuerpo);
  }
  const respuesta = await fetch(url, opciones);
  let datos = {};
  try { datos = await respuesta.json(); } catch (e) { /* sin cuerpo */ }
  if (!respuesta.ok) {
    const detalle = datos.errores ? " (" + datos.errores.join("; ") + ")" : "";
    throw new Error((datos.message || "Error " + respuesta.status) + detalle);
  }
  return datos;
}

// formularios: login, registro y crear proveedor/marca/equipo
document.querySelectorAll("form.formulario").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cuerpo = {};
    let url = form.dataset.api;

    new FormData(form).forEach((valor, nombre) => {
      const campo = form.elements[nombre];
      const esNumero = campo.type === "number" || campo.dataset.numero;
      if (nombre === form.dataset.sufijo) {
        url += valor; // para equipos: /equipo/crearUno/ + id del proveedor
      } else {
        cuerpo[nombre] = esNumero && valor !== "" ? Number(valor) : valor;
      }
    });

    try {
      const datos = await llamarApi(url, form.dataset.metodo, cuerpo);
      if (form.dataset.ir) window.location.href = form.dataset.ir;
      else if (form.dataset.recargar) window.location.reload();
      else mostrarMensaje(datos.message, false);
    } catch (err) {
      mostrarMensaje(err.message, true);
    }
  });
});

document.querySelectorAll(".btn-borrar").forEach((btn) => {
  btn.addEventListener("click", async () => {
    if (btn.dataset.confirmar && !confirm(btn.dataset.confirmar)) return;
    try {
      await llamarApi(btn.dataset.api, "DELETE");
      window.location.reload();
    } catch (err) {
      mostrarMensaje(err.message, true);
    }
  });
});

// editar: va pidiendo cada dato con prompt
document.querySelectorAll(".btn-editar").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const actuales = JSON.parse(btn.dataset.campos);
    const nuevos = {};
    for (const campo of Object.keys(actuales)) {
      const valor = prompt("Nuevo valor para " + campo + ":", actuales[campo]);
      if (valor === null) return;
      nuevos[campo] = typeof actuales[campo] === "number" ? Number(valor) : valor;
    }
    try {
      await llamarApi(btn.dataset.api, "PUT", nuevos);
      window.location.reload();
    } catch (err) {
      mostrarMensaje(err.message, true);
    }
  });
});

// cambiar el rol de un usuario (admin)
document.querySelectorAll(".cambiar-rol").forEach((sel) => {
  sel.addEventListener("change", async () => {
    try {
      await llamarApi(sel.dataset.api, "PUT", { rol: sel.value });
      mostrarMensaje("Rol actualizado", false);
    } catch (err) {
      mostrarMensaje(err.message, true);
      window.location.reload();
    }
  });
});
