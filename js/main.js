// main.js
// Punto de entrada: mantiene el estado de la aplicación y decide qué
// mostrar cada vez que algo cambia (búsqueda, filtro de género, orden).

import { fetchAllHeroes } from "./api.js";
import { renderCardGrid } from "./dom.js";
import { filterHeroesByName } from "./search.js";
import { applySuperheroinesFilter } from "./filters.js";
import { sortAlphabetically } from "./sortHeroes.js";
import { debounce } from "./utils.js";

/****************** ELEMENTOS DEL DOM ********************/
const searchInput = document.getElementById("search-input");
const genderToggle = document.getElementById("gender-toggle");
const sortSelect = document.getElementById("sort-select");

/****************** ESTADO ********************/
// Todo lo que puede cambiar la vista actual, en un solo lugar.
let allHeroes = [];
let searchText = "";
let onlyFemales = true; // diferencial del proyecto: activo desde el arranque
let sortDirection = "none"; // "none" | "az" | "za"

/****************** RECÁLCULO DE LA VISTA ********************/

// Se llama cada vez que cambia CUALQUIER pieza del estado. Siempre parte
// de allHeroes completo, nunca del resultado de la vez anterior — así
// cada cambio se aplica sobre los datos originales, no en cascada.
function updateView() {
  // 1) Búsqueda por nombre, sobre todos los héroes.
  let visibleHeroes = filterHeroesByName(allHeroes, searchText);

  // 2) Filtro de género, sobre lo que dejó la búsqueda.
  visibleHeroes = applySuperheroinesFilter(visibleHeroes, onlyFemales);

  // 3) Orden alfabético, sobre lo que dejaron los dos filtros anteriores
  // (si no se eligió ningún orden, se muestra tal cual quedó).
  if (sortDirection !== "none") {
    visibleHeroes = sortAlphabetically(visibleHeroes, sortDirection);
  }

  renderCardGrid(visibleHeroes);
}

/****************** EVENTOS ********************/

// debounce evita recalcular en cada tecla individual — espera una pausa.
searchInput.addEventListener(
  "input",
  debounce((event) => {
    searchText = event.target.value;
    updateView();
  }, 300)
);

genderToggle.addEventListener("change", (event) => {
  onlyFemales = event.target.checked;
  updateView();
});

sortSelect.addEventListener("change", (event) => {
  sortDirection = event.target.value;
  updateView();
});

/****************** INICIO ********************/

async function initApp() {
  allHeroes = await fetchAllHeroes();
  updateView(); // primer render — ya sale con el filtro de género aplicado
}

initApp();