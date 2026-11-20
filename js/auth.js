const AUTH_KEY = "vivero_raiz_sesion";

const USUARIO_VALIDO = {
  email: "admin@viveroraiz.com",
  password: "admin123",
  nombre: "Nicolás",
  rol: "admin"
};

const Auth = {
  login(email, password) {
    if (email === USUARIO_VALIDO.email && password === USUARIO_VALIDO.password) {
      const sesion = {
        nombre: USUARIO_VALIDO.nombre,
        email: USUARIO_VALIDO.email,
        rol: USUARIO_VALIDO.rol
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(sesion));
      return sesion;
    } else {
      throw new Error("Correo electrónico o contraseña incorrectos.");
    }
  },

  obtenerUsuario() {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  cerrarSesion() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "index.html";
  },

  protegerRuta() {
    const usuario = this.obtenerUsuario();
    if (!usuario) {
      window.location.href = "login.html?redirigido=1";
    }
    return usuario;
  },

  actualizarHeader() {
    const navUl = document.querySelector("#nav-principal ul");
    if (!navUl) return;

    const usuario = this.obtenerUsuario();

    if (usuario) {
      navUl.innerHTML = `
        <li><a href="index.html">Inicio</a></li>
        <li><a href="catalogo.html">Catálogo</a></li>
        <li><a href="listado.html">Intranet</a></li>
        <li style="color: var(--verde-vivero); font-weight: bold;">Hola, ${usuario.nombre}</li>
        <li><a href="#" id="btn-cerrar-sesion" style="color: #c01d1d;">Salir</a></li>
      `;

      const btnSalir = document.getElementById("btn-cerrar-sesion");
      if (btnSalir) {
        btnSalir.addEventListener("click", (e) => {
          e.preventDefault();
          if (typeof Swal !== "undefined") {
            Swal.fire({
              title: "¿Cerrar sesión?",
              text: "Vas a salir del panel de administración.",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#1b3b22",
              cancelButtonColor: "#666",
              confirmButtonText: "Sí, salir",
              cancelButtonText: "Cancelar"
            }).then((res) => {
              if (res.isConfirmed) this.cerrarSesion();
            });
          } else {
            this.cerrarSesion();
          }
        });
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Auth.actualizarHeader();
});
