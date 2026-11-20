const API_URL = "https://mocki.io/v1/plantas";
const STORAGE_KEY = "vivero_raiz_plantas";

function obtenerRespaldoLocal() {
  const guardado = localStorage.getItem(STORAGE_KEY);
  if (guardado) {
    return JSON.parse(guardado);
  }
  if (typeof plantas !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plantas));
    return [...plantas];
  }
  return [];
}

function guardarRespaldoLocal(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

const ServicioPlantas = {
  async obtenerTodas() {
    try {
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
      const datos = await respuesta.json();
      guardarRespaldoLocal(datos);
      return datos;
    } catch (error) {
      console.warn("Usando almacenamiento local de respaldo:", error.message);
      return obtenerRespaldoLocal();
    }
  },

  async obtenerPorId(id) {
    try {
      const respuesta = await fetch(`${API_URL}/${id}`);
      if (respuesta.ok) return await respuesta.json();
      throw new Error("No encontrada en API");
    } catch (error) {
      const lista = obtenerRespaldoLocal();
      const encontrada = lista.find(p => p.id === Number(id));
      if (encontrada) return encontrada;
      throw new Error(`No se encontró la planta con ID ${id}`);
    }
  },

  async crear(nuevaPlanta) {
    try {
      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaPlanta)
      });
      if (!respuesta.ok) throw new Error(`Error al crear: ${respuesta.status}`);
      return await respuesta.json();
    } catch (error) {
      const lista = obtenerRespaldoLocal();
      const nuevoId = lista.length > 0 ? Math.max(...lista.map(p => p.id)) + 1 : 1;
      const plantaCreada = { id: nuevoId, ...nuevaPlanta };
      lista.push(plantaCreada);
      guardarRespaldoLocal(lista);
      return plantaCreada;
    }
  },

  async actualizar(id, datosActualizados) {
    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados)
      });
      if (!respuesta.ok) throw new Error(`Error al actualizar: ${respuesta.status}`);
      return await respuesta.json();
    } catch (error) {
      const lista = obtenerRespaldoLocal();
      const indice = lista.findIndex(p => p.id === Number(id));
      if (indice === -1) throw new Error("La planta a editar no existe.");
      
      lista[indice] = { ...lista[indice], ...datosActualizados, id: Number(id) };
      guardarRespaldoLocal(lista);
      return lista[indice];
    }
  },


  async eliminar(id) {
    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });
      if (!respuesta.ok) throw new Error(`Error al eliminar: ${respuesta.status}`);
      return true;
    } catch (error) {
      const lista = obtenerRespaldoLocal();
      const filtrada = lista.filter(p => p.id !== Number(id));
      guardarRespaldoLocal(filtrada);
      return true;
    }
  }
};

const URL_CLIMA = "https://api.open-meteo.com/v1/forecast?latitude=-31.6488&longitude=-60.7087&hourly=temperature_2m";

const ServicioClima = {
  async obtenerTemperaturaActual() {
    try {
      const respuesta = await fetch(URL_CLIMA);
      if (!respuesta.ok) throw new Error(`Error HTTP clima: ${respuesta.status}`);
      const datos = await respuesta.json();
      const ahora = new Date();
      const horaActualISO = ahora.toISOString().slice(0, 13) + ":00";
      const indice = datos.hourly.time.findIndex(t => t === horaActualISO);
      const temp = indice !== -1 ? datos.hourly.temperature_2m[indice] : datos.hourly.temperature_2m[0];

      return {
        temperatura: temp,
        unidad: datos.hourly_units.temperature_2m
      };
    } catch (error) {
      console.error("No se pudo obtener el clima de Open-Meteo:", error);
      throw error;
    }
  }
};
