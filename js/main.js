// main.js
// Punto de entrada de la aplicación: conecta api.js, dom.js y search.js.

import { fetchAllHeroes } from "./api.js";
import { renderCardGrid } from "./dom.js";
import { filterHeroesByName } from "./search.js";
import { debounce } from "./utils.js";

// Estado: la lista completa de héroes, guardada en memoria.
// Se necesita porque search.js va a filtrar sobre esta lista repetidas
// veces (cada vez que se escribe), sin volver a pedirla a la API.
let allHeroes = [];

async function initApp() {
  allHeroes = await fetchAllHeroes();
  renderCardGrid(allHeroes);
  setupSearch();
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");

  // Se envuelve el handler con debounce: en vez de filtrar en cada tecla,
  // espera 300ms desde la última tecla presionada antes de filtrar y repintar.
  const handleSearch = debounce((event) => {
    const query = event.target.value;
    const filteredHeroes = filterHeroesByName(allHeroes, query);
    renderCardGrid(filteredHeroes);
  }, 300);

  searchInput.addEventListener("input", handleSearch);
}

initApp();