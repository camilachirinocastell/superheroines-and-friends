// dom.js
// Responsabilidad única de este archivo: renderizar héroes en pantalla.
//Esta función recibe la lista de héroes ya lista (se la va a pasar main.js, que a su vez la consigue de api.js)
// y por cada héroe de esa lista crea un elemento visual nuevo (una card),
// le llena el contenido con los datos de ese héroe puntual (imagen, nombre, editorial),
// y lo cuelga dentro del contenedor heroes-container que agregué al HTML.
// A diferencia de fetchAllHeroes(), esta función no es asíncrona — no espera nada de internet,
// todo lo que necesita (la lista de héroes) ya se lo pasan resuelto;
// solo hace trabajo de manipular el DOM, que es instantáneo.

export function renderCardGrid(heroes) {
  // Ubica el contenedor vacío que ya existe en el HTML.
  const container = document.getElementById("heroes-container");

  // Limpia lo que había antes de pintar de nuevo — necesario porque
  // esta función se va a llamar repetidas veces (cada tecla del buscador),
  // no solo una vez como en la Fase 2.
  container.innerHTML = "";

  // Por cada héroe de la lista, crea y agrega su card.
  heroes.forEach((hero) => {
    // Crea un <div> nuevo y vacío en memoria .
    const card = document.createElement("div");

    // Le agrega una clase CSS, para poder darle estilos después en SCSS.
    card.classList.add("hero-card");

    // Guarda el id del héroe directamente en el HTML de la card, como un
    // atributo data-*. Esto es lo que va a permitir, más adelante, saber
    // a qué héroe corresponde una card cuando alguien le hace clic.
    card.dataset.id = hero.id;

    // Arma el contenido interno de la card con los datos de este héroe.
    card.innerHTML = `
  <img src="${hero.images.md}" alt="${hero.name}">
  <h3>${hero.name}</h3>
  <p>${hero.biography.publisher}</p>
`;

    // Recién acá la card pasa a formar parte visible de la página,
    // colgada como hija del contenedor.
    container.appendChild(card);
  });
}

// Función para paginación:
// Actualiza el texto "Page X of Y" y habilita/deshabilita los 4 botones
// según si la página actual es la primera y/o la última.
export function updatePaginationControls(currentPage, totalPages) {
  const pageInfo = document.getElementById("page-info");
  const firstBtn = document.getElementById("first-page-btn");
  const prevBtn = document.getElementById("prev-page-btn");
  const nextBtn = document.getElementById("next-page-btn");
  const lastBtn = document.getElementById("last-page-btn");

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  firstBtn.disabled = isFirstPage;
  prevBtn.disabled = isFirstPage;
  nextBtn.disabled = isLastPage;
  lastBtn.disabled = isLastPage;
}

// Llena el modal con la info de UN héroe puntual y lo muestra.
// Recibe el objeto héroe completo (no un id, no un array) — ya resuelto,
// mismo criterio que renderCardGrid: esta función solo pinta, no busca.
export function openModal(hero) {
  const modalContent = document.getElementById("modal-content");
  const modalOverlay = document.getElementById("modal-overlay");

  // biography.aliases llega como array (ej: ["Bruce Wayne", "Insider"]).
  // .join(", ") lo convierte en un solo string legible para mostrarlo.
  const aliases = hero.biography.aliases.join(", ");

  // appearance.height y appearance.weight son arrays de 2 valores cada
  // uno: [imperial, métrico] (ej: ["6'2", "188 cm"]). Se usa la posición
  // [1] para mostrar el valor métrico.
  const height = hero.appearance.height[1];
  const weight = hero.appearance.weight[1];

  modalContent.innerHTML = `
    <img src="${hero.images.lg}" alt="${hero.name}">
    <h2>${hero.name}</h2>
    <p><strong>Real name:</strong> ${hero.biography.fullName}</p>
    <p><strong>Publisher:</strong> ${hero.biography.publisher}</p>
    <p><strong>Aliases:</strong> ${aliases}</p>
    <p><strong>Place of birth:</strong> ${hero.biography.placeOfBirth}</p>
    <p><strong>Occupation:</strong> ${hero.work.occupation}</p>
    <p><strong>Height:</strong> ${height} — <strong>Weight:</strong> ${weight}</p>
    <p><strong>Group affiliation:</strong> ${hero.connections.groupAffiliation}</p>
    <h3>Power stats</h3>
    <ul>
      <li>Intelligence: ${hero.powerstats.intelligence}</li>
      <li>Strength: ${hero.powerstats.strength}</li>
      <li>Speed: ${hero.powerstats.speed}</li>
      <li>Durability: ${hero.powerstats.durability}</li>
      <li>Power: ${hero.powerstats.power}</li>
      <li>Combat: ${hero.powerstats.combat}</li>
    </ul>
  `;

  // Le saca la clase "hidden" al overlay — recién ahí se vuelve visible.
  modalOverlay.classList.remove("hidden");
}

// Vuelve a esconder el modal. No recibe ningún dato — solo esconde.
export function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}

// Recorre TODOS los héroes (la lista completa, no la filtrada) para
// armar el listado de editoriales posibles, y genera las <option> del
// <select> de editorial dinámicamente — no se escriben a mano porque
// no se sabe de antemano cuántas editoriales distintas hay en los datos.
export function populatePublisherOptions(heroes) {
  const publisherSelect = document.getElementById("publisher-select");

  // hero.biography.publisher, por cada héroe → array con muchos
  // repetidos (ej: 200 veces "Marvel Comics"). new Set() elimina esos
  // duplicados automáticamente: solo guarda cada valor distinto una vez.
  const publishers = [...new Set(heroes.map((hero) => hero.biography.publisher))]
    // Algunos héroes de los datos reales tienen publisher vacío o "-".
    // .filter(Boolean) descarta esos valores "falsy" (vacío, null,
    // undefined), para no mostrar una opción sin sentido en el select.
    .filter(Boolean)
    // Orden alfabético, para que el select sea fácil de recorrer con la
    // vista — sin esto, el orden dependería de en qué posición del
    // array apareció cada editorial por primera vez.
    .sort();

  // Por cada editorial ya única y ordenada, crea su <option> real y la
  // cuelga del <select> — mismo patrón createElement + appendChild que
  // ya usaste para las cards en renderCardGrid.
  publishers.forEach((publisher) => {
    const option = document.createElement("option");
    option.value = publisher;
    option.textContent = publisher;
    publisherSelect.appendChild(option);
  });
}

// Muestra un mensaje de error cuando falla el fetch a la API — caso
// distinto al de "sin resultados": acá algo se rompió de verdad, no es
// que la búsqueda no encontró coincidencias.
export function renderErrorState(error) {
  const container = document.getElementById("heroes-container");
  container.innerHTML = `
    <p class="error-state">
      Something went wrong loading heroes. Please try again later.
    </p>
  `;
  console.error(error);
}

// Muestra un mensaje cuando la búsqueda/filtros no encuentran ningún
// resultado — caso distinto de renderErrorState: acá no se rompió nada,
// simplemente no hay héroes que cumplan con lo que se pidió.
export function renderEmptyState() {
  const container = document.getElementById("heroes-container");
  container.innerHTML = `
    <p class="empty-state">
      No heroines (or friends) match that search. Try a different name or combination of filters.
    </p>
  `;
}