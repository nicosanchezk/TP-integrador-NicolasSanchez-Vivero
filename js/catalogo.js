document.addEventListener("DOMContentLoaded", async function () {
  const contenedorPlantas = document.getElementById("contenedor-plantas");
  const contador = document.getElementById("contador-resultados");
  const mensajeSinResultados = document.getElementById("sin-resultados");
  const inputBuscar = document.getElementById("buscar");
  const selectCategoria = document.getElementById("categoria");
  const selectOrden = document.getElementById("orden");
  const btnLimpiar = document.getElementById("btn-limpiar");

  if (!contenedorPlantas) return;

  let listaPlantasActual = [];

  function crearTarjetaHTML(planta) {
    const article = document.createElement("article");
    article.className = "tarjeta-planta";

    article.innerHTML = `
      <img src="${planta.imagen}" alt="Planta ${planta.nombre} en maceta">
      <span class="tag-categoria">${planta.categoria.toUpperCase()}</span>
      <h3>${planta.nombre}</h3>
      <p class="precio">$ ${planta.precio.toLocaleString("es-AR")}</p>
      <a href="planta.html?id=${planta.id}">VER FICHA &rarr;</a>
    `;

    return article;
  }

  function renderizarCatalogo(lista) {
    contenedorPlantas.innerHTML = "";

    if (lista.length === 0) {
      if (mensajeSinResultados) {
        mensajeSinResultados.style.display = "block";
        contenedorPlantas.appendChild(mensajeSinResultados);
      }
      if (contador) contador.textContent = "Mostrando 0 plantas disponibles.";
      return;
    }

    if (mensajeSinResultados) mensajeSinResultados.style.display = "none";

    lista.forEach(function (planta) {
      const tarjeta = crearTarjetaHTML(planta);
      contenedorPlantas.appendChild(tarjeta);
    });

    if (contador) {
      contador.textContent = lista.length === 1 
        ? "Mostrando 1 planta disponible." 
        : `Mostrando ${lista.length} plantas disponibles.`;
    }
  }

  function filtrarYOrdenar() {
    const texto = inputBuscar ? inputBuscar.value.toLowerCase().trim() : "";
    const categoria = selectCategoria ? selectCategoria.value : "todas";
    const orden = selectOrden ? selectOrden.value : "defecto";

    let filtradas = listaPlantasActual.filter(function (planta) {
      const coincideTexto = planta.nombre.toLowerCase().includes(texto);
      const coincideCat = (categoria === "todas" || planta.categoria === categoria);
      return coincideTexto && coincideCat;
    });

    if (orden === "precio-asc") {
      filtradas.sort((a, b) => a.precio - b.precio);
    } else if (orden === "precio-desc") {
      filtradas.sort((a, b) => b.precio - a.precio);
    } else if (orden === "nombre-asc") {
      filtradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === "nombre-desc") {
      filtradas.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    renderizarCatalogo(filtradas);
  }

  contenedorPlantas.innerHTML = `
    <p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #555; font-size: 15px;">
      Cargando catálogo de plantas desde el servidor...
    </p>
  `;

  try {
    listaPlantasActual = await ServicioPlantas.obtenerTodas();
    renderizarCatalogo(listaPlantasActual);
  } catch (error) {
    contenedorPlantas.innerHTML = `
      <p style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #c01d1d; font-weight: bold;">
        Ocurrió un error al cargar las plantas desde el servidor. Por favor, intentá nuevamente más tarde.
      </p>
    `;
    if (contador) contador.textContent = "Error de conexión.";
  }

  if (inputBuscar) inputBuscar.addEventListener("input", filtrarYOrdenar);
  if (selectCategoria) selectCategoria.addEventListener("change", filtrarYOrdenar);
  if (selectOrden) selectOrden.addEventListener("change", filtrarYOrdenar);

  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", function () {
      if (inputBuscar) inputBuscar.value = "";
      if (selectCategoria) selectCategoria.value = "todas";
      if (selectOrden) selectOrden.value = "defecto";
      renderizarCatalogo(listaPlantasActual);
    });
  }
});
