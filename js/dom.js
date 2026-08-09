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