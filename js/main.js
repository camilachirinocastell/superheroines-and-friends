// main.js
// Punto de entrada de la aplicación: conecta api.js con dom.js.

import { fetchAllHeroes } from "./api.js";
import { renderHeroes } from "./dom.js";

// async porque adentro esperamos (await) a que lleguen los héroes
// antes de poder pintarlos.
async function initApp() {
  // Pide los héroes y espera a que la promesa se resuelva.
  const heroes = await fetchAllHeroes();

  // Recién con los datos ya listos, los manda a pintar.
  renderHeroes(heroes);
}

// Arranca la aplicación apenas se carga el archivo.
initApp();