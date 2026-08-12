// main.js
// Punto de entrada: mantiene el estado de la aplicación y decide qué
// mostrar cada vez que algo cambia (búsqueda, filtro de género, orden,
// página actual).

import { fetchAllHeroes } from "./api.js";
import { renderCardGrid, updatePaginationControls, openModal, closeModal, populatePublisherOptions, renderErrorState, renderEmptyState } from "./dom.js";
import { filterHeroesByName } from "./search.js";
import { applySuperheroinesFilter, applyPublisherFilter, applyAlignmentFilter } from "./filters.js";
import { sortAlphabetically } from "./sortHeroes.js";
import { getTotalPages, getPageSlice } from "./pagination.js";
import { debounce } from "./utils.js";

/****************** ELEMENTOS DEL DOM ********************/
const searchInput = document.getElementById("search-input");
const genderToggle = document.getElementById("gender-toggle");
const sortSelect = document.getElementById("sort-select");
const publisherSelect = document.getElementById("publisher-select");
const alignmentSelect = document.getElementById("alignment-select");
const firstBtn = document.getElementById("first-page-btn");
const prevBtn = document.getElementById("prev-page-btn");
const nextBtn = document.getElementById("next-page-btn");
const lastBtn = document.getElementById("last-page-btn");

/****************** ESTADO ********************/
let allHeroes = [];
let searchText = "";
let onlyFemales = true;
let sortDirection = "none";
let publisherFilter = "all";
let alignmentFilter = "all";
let currentPage = 1;

/****************** CÁLCULO DE LA VISTA ********************/

// Calcula la lista visible (búsqueda + filtro + orden) SIN paginar todavía.
// La usan tanto updateView() como el botón "Last" — la lógica de
// búsqueda/filtro/orden vive en un solo lugar, no repetida en dos.
function getVisibleHeroes() {
  let visibleHeroes = filterHeroesByName(allHeroes, searchText);
  visibleHeroes = applySuperheroinesFilter(visibleHeroes, onlyFemales);
  visibleHeroes = applyPublisherFilter(visibleHeroes, publisherFilter);
  visibleHeroes = applyAlignmentFilter(visibleHeroes, alignmentFilter);

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

  // Si el recorte de esta página quedó vacío, no tiene sentido llamar a
  // renderCardGrid() con un array vacío (pintaría el contenedor en blanco
  // sin ninguna explicación) — se muestra el mensaje de "sin resultados"
  // en su lugar. Caso distinto de renderErrorState(): acá nada se rompió,
  // simplemente no hay héroes que cumplan la búsqueda/filtros actuales.
  if (pageOfHeroes.length === 0) {
    renderEmptyState();
  } else {
    renderCardGrid(pageOfHeroes);
  }

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
  }, 300),
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

// Mismo patrón que sortSelect: actualiza el estado y resetea la página.
publisherSelect.addEventListener("change", (event) => {
  publisherFilter = event.target.value;
  currentPage = 1;
  updateView();
});

alignmentSelect.addEventListener("change", (event) => {
  alignmentFilter = event.target.value;
  currentPage = 1;
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

const heroesContainer = document.getElementById("heroes-container");

heroesContainer.addEventListener("click", (event) => {
  // event.target es el elemento EXACTO donde cayó el clic (puede ser la
  // imagen, el <h3>, cualquier cosa adentro de la card). .closest(".hero-card")
  // sube por los padres hasta encontrar la card completa que lo contiene.
  const card = event.target.closest(".hero-card");

  // Si el clic fue en el contenedor pero fuera de cualquier card
  // (un espacio vacío), card va a ser null — no hay nada que abrir.
  if (!card) return;

  // dataset.id siempre llega como string, aunque hero.id sea number —
  // Number(...) lo convierte de vuelta para que la comparación de abajo
  // funcione correctamente.
  const heroId = Number(card.dataset.id);

  // Busca, en la lista completa guardada en memoria, el héroe con ese id.
  const hero = allHeroes.find((h) => h.id === heroId);

  if (hero) {
    openModal(hero);
  }
});

// Busca el botón X del modal para poder escucharle el clic.
const modalCloseBtn = document.getElementById("modal-close-btn");

// Al hacer clic en la X, solo esconde el modal — no toca nada del
// estado de la app (búsqueda, filtros, página), porque cerrar el modal
// no debería afectar en absoluto lo que se está viendo en la grilla de atrás.
modalCloseBtn.addEventListener("click", () => {
  closeModal();
});

// Busca el fondo oscuro del modal.
const modalOverlay = document.getElementById("modal-overlay");

modalOverlay.addEventListener("click", (event) => {
  // event.target es el elemento EXACTO donde cayó el clic. Si es el
  // overlay mismo (el fondo), cierra. Si es cualquier hijo de adentro
  // (el modal, sus textos), NO cierra — evita que clickear dentro del
  // modal lo cierre por accidente, aunque el evento burbujee hasta acá.
  if (event.target === modalOverlay) {
    closeModal();
  }
});

// Escucha cualquier tecla presionada en toda la página.
document.addEventListener("keydown", (event) => {
  // key === "Escape" es el nombre exacto que usa el navegador para esa
  // tecla. closeModal() es seguro llamarla aunque el modal ya esté
  // cerrado — solo vuelve a agregar la clase "hidden", que ya estaba puesta.
  if (event.key === "Escape") {
    closeModal();
  }
});


/****************** INICIO ********************/

async function initApp() {
  const loader = document.getElementById("loader");

  // Promise que se resuelve sola, sin hacer nada, después de 3000ms —
  // no pide ningún dato, solo sirve como "reloj" en paralelo al fetch real.
  const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    // Promise.all dispara las dos promesas A LA VEZ y espera a que las DOS
    // terminen — no a que termine la primera. Si el fetch tarda 400ms, se
    // sigue esperando hasta completar los 3000ms del timer. Si el fetch
    // tardara 4000ms (más que el mínimo), no se agrega ninguna espera
    // extra — ya superó el piso de 3 segundos por su cuenta.
    const [heroes] = await Promise.all([fetchAllHeroes(), minLoadingTime]);

    allHeroes = heroes;

    // Recién ahora, con los dos tiempos cumplidos, se esconde el loader.
    loader.classList.add("hidden");

    populatePublisherOptions(allHeroes);// llena el select apenas llegan los datos
    updateView();// primer render — ya sale con el filtro de género aplicado
  } catch (error) {
    // Si el fetch falla, el loader también tiene que esconderse acá —
    // por este camino nunca llegamos a la línea de arriba que lo hacía.
    loader.classList.add("hidden");
    renderErrorState(error);
  }
}

// Se llama al final a propósito: para acá ya están registrados todos los
// listeners de arriba. Esta línea dispara el fetch inicial y el primer render.
initApp();