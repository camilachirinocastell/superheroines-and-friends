// main.js
// Punto de entrada: mantiene el estado de la aplicación y decide qué
// mostrar cada vez que algo cambia (búsqueda, filtro de género, orden,
// página actual).

import { fetchAllHeroes } from "./api.js";
import { renderCardGrid, updatePaginationControls } from "./dom.js";
import { filterHeroesByName } from "./search.js";
import { applySuperheroinesFilter } from "./filters.js";
import { sortAlphabetically } from "./sortHeroes.js";
import { getTotalPages, getPageSlice } from "./pagination.js";
import { debounce } from "./utils.js";

/****************** ELEMENTOS DEL DOM ********************/
const searchInput = document.getElementById("search-input");
const genderToggle = document.getElementById("gender-toggle");
const sortSelect = document.getElementById("sort-select");
const firstBtn = document.getElementById("first-page-btn");
const prevBtn = document.getElementById("prev-page-btn");
const nextBtn = document.getElementById("next-page-btn");
const lastBtn = document.getElementById("last-page-btn");

/****************** ESTADO ********************/
let allHeroes = [];
let searchText = "";
let onlyFemales = true;
let sortDirection = "none";
let currentPage = 1;

/****************** CÁLCULO DE LA VISTA ********************/

// Calcula la lista visible (búsqueda + filtro + orden) SIN paginar todavía.
// La usan tanto updateView() como el botón "Last" — la lógica de
// búsqueda/filtro/orden vive en un solo lugar, no repetida en dos.
function getVisibleHeroes() {
  let visibleHeroes = filterHeroesByName(allHeroes, searchText);
  visibleHeroes = applySuperheroinesFilter(visibleHeroes, onlyFemales);

  if (sortDirection !== "none") {
    visibleHeroes = sortAlphabetically(visibleHeroes, sortDirection);
  }

  return visibleHeroes;
}

// Se llama cada vez que cambia CUALQUIER pieza del estado: recorta la
// página actual sobre la lista visible, y actualiza cards + controles.
function updateView() {
  const visibleHeroes = getVisibleHeroes();
  const totalPages = getTotalPages(visibleHeroes);
  const pageOfHeroes = getPageSlice(visibleHeroes, currentPage);

  renderCardGrid(pageOfHeroes);
  updatePaginationControls(currentPage, totalPages);
}

/****************** EVENTOS ********************/

// debounce evita recalcular en cada tecla individual — espera una pausa.
searchInput.addEventListener(
  "input",
  debounce((event) => {
    searchText = event.target.value;
    currentPage = 1; // reset: cambió qué se muestra
    updateView();
  }, 300)
);

genderToggle.addEventListener("change", (event) => {
  onlyFemales = event.target.checked;
  currentPage = 1; // reset
  updateView();
});

sortSelect.addEventListener("change", (event) => {
  sortDirection = event.target.value;
  currentPage = 1; // reset, por consistencia con el resto de los controles
  updateView();
});

firstBtn.addEventListener("click", () => {
  currentPage = 1;
  updateView();
});

prevBtn.addEventListener("click", () => {
  currentPage--;
  updateView();
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  updateView();
});

lastBtn.addEventListener("click", () => {
  currentPage = getTotalPages(getVisibleHeroes());
  updateView();
});

/****************** INICIO ********************/

async function initApp() {
  allHeroes = await fetchAllHeroes();
  updateView(); // primer render — ya sale con el filtro de género aplicado
}

initApp();