document.addEventListener("DOMContentLoaded", function () {


  const btnMenu = document.getElementById("btn-menu");
  const navLista = document.querySelector("#nav-principal ul");

  if (btnMenu && navLista) {
    btnMenu.addEventListener("click", function () {
      navLista.classList.toggle("abierto");
    });
  }


  function mostrarError(contenedor, mensaje) {
    contenedor.textContent = mensaje;
    contenedor.style.display = "block";
  }

  function limpiarError(contenedor) {
    contenedor.textContent = "";
    contenedor.style.display = "none";
  }


  const formContacto = document.querySelector("form[action*='contacto']") || document.querySelector("main form");
  
  const inputMotivo = document.getElementById("motivo");
  
  if (formContacto && inputMotivo) {
    let errorBox = formContacto.querySelector(".mensaje-error");
    if (!errorBox) {
      errorBox = document.createElement("p");
      errorBox.className = "mensaje-error";
      errorBox.style.color = "#c01d1d";
      errorBox.style.fontWeight = "bold";
      errorBox.style.marginBottom = "15px";
      errorBox.style.display = "none";
      formContacto.prepend(errorBox);
    }

    formContacto.addEventListener("submit", function (e) {
      limpiarError(errorBox);

      const nombre = document.getElementById("nombre").value.trim();
      const correo = document.getElementById("correo").value.trim();
      const motivo = document.getElementById("motivo").value;
      const mensaje = document.getElementById("mensaje").value.trim();


      if (nombre === "" || correo === "" || motivo === "" || mensaje === "") {
        e.preventDefault();
        mostrarError(errorBox, "Por favor, completá todos los campos obligatorios.");
        return;
      }

      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(correo)) {
        e.preventDefault();
        mostrarError(errorBox, "Ingresá un correo electrónico válido (ej: nombre@correo.com).");
        return;
      }
    });
  }

  const formLogin = document.querySelector("main section:has(input[type='password']) form") || document.querySelector("form");
  const inputClaveLogin = document.getElementById("clave");
  const inputCorreoLogin = document.getElementById("correo") || document.getElementById("usuario") || document.getElementById("login-correo");

  const inputRepetirClave = document.getElementById("repetir-clave") || document.getElementById("confirmar-clave");

  if (formLogin && inputClaveLogin && inputCorreoLogin && !inputRepetirClave && !inputMotivo) {
    let errorBoxLogin = document.querySelector("aside[role='alert']") || formLogin.querySelector(".mensaje-error");

    if (errorBoxLogin) {
      errorBoxLogin.style.display = "none";
    }

    formLogin.addEventListener("submit", function (e) {
      const correo = inputCorreoLogin.value.trim();
      const clave = inputClaveLogin.value.trim();

      if (correo === "" || clave === "") {
        e.preventDefault();
        if (errorBoxLogin) {
          const texto = errorBoxLogin.querySelector("p") || errorBoxLogin;
          texto.innerHTML = "<strong>Error:</strong> Debés completar el correo y la contraseña para ingresar.";
          errorBoxLogin.style.display = "block";
        }
      }
    });
  }

  const formRegistro = document.querySelector(".caja-formulario form") || document.querySelector("form");
  const inputClave1 = document.querySelector("input[name='clave']") || document.getElementById("clave");
  const inputClave2 = document.querySelector("input[name='repetir-clave']") || document.querySelector("input[name='confirmar-clave']") || inputRepetirClave;
  const checkTerminos = document.querySelector("input[name='terminos']") || document.getElementById("terminos");

  if (formRegistro && inputClave1 && inputClave2) {
    let errorBoxRegistro = formRegistro.querySelector(".mensaje-error");
    if (!errorBoxRegistro) {
      errorBoxRegistro = document.createElement("p");
      errorBoxRegistro.className = "mensaje-error";
      errorBoxRegistro.style.color = "#c01d1d";
      errorBoxRegistro.style.fontWeight = "bold";
      errorBoxRegistro.style.marginBottom = "15px";
      errorBoxRegistro.style.display = "none";
      formRegistro.prepend(errorBoxRegistro);
    }

    formRegistro.addEventListener("submit", function (e) {
      limpiarError(errorBoxRegistro);

      const clave1 = inputClave1.value;
      const clave2 = inputClave2.value;

      if (clave1 !== clave2) {
        e.preventDefault();
        mostrarError(errorBoxRegistro, "Las contraseñas no coinciden. Revisalas e intentá de nuevo.");
        return;
      }

      if (checkTerminos && !checkTerminos.checked) {
        e.preventDefault();
        mostrarError(errorBoxRegistro, "Debés aceptar los términos y condiciones para crear la cuenta.");
        return;
      }
    });
  }

});

function validarFormularioPlanta(datos) {
  const errores = [];

  if (!datos.nombre || datos.nombre.trim().length < 2) {
    errores.push("El nombre de la planta es obligatorio (mínimo 2 caracteres).");
  }

  if (!datos.categoria || datos.categoria === "") {
    errores.push("Debés seleccionar una categoría válida.");
  }

  if (isNaN(datos.precio) || Number(datos.precio) <= 0) {
    errores.push("El precio debe ser un número mayor a 0.");
  }

  if (!datos.imagen || datos.imagen.trim() === "") {
    errores.push("Indicá la ruta de la imagen (ej: img/lavanda.jpg).");
  }

  if (!datos.descripcion || datos.descripcion.trim().length < 10) {
    errores.push("La descripción debe tener al menos 10 caracteres.");
  }

  return errores;
}
