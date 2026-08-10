// filters.js
// Responsabilidad única: filtrar arrays de héroes. No ordena, no toca el DOM
// — cada función recibe una lista y devuelve otra (más chica o igual).

// Diferencial del proyecto: por defecto (onlyFemales = true) la página
// muestra solo heroínas. Es el filtro que define la identidad del sitio,
// por eso se aplica SIEMPRE antes que cualquier otro filtro o búsqueda.
export function applySuperheroinesFilter(heroes, onlyFemales) {
  if (!onlyFemales) return heroes;
  return heroes.filter((hero) => hero.appearance.gender === "Female");
}

// Filtra por editorial. "all" es un valor especial que significa
// "no filtrar nada" — no es un publisher real de la API, es una
// convención propia para representar "sin filtro" en el <select>.
export function applyPublisherFilter(heroes, publisher) {
  if (publisher === "all") return heroes;
  return heroes.filter((hero) => hero.biography.publisher === publisher);
}

// Mismo patrón exacto, para alineación (good/bad/neutral).
export function applyAlignmentFilter(heroes, alignment) {
  if (alignment === "all") return heroes;
  return heroes.filter((hero) => hero.biography.alignment === alignment);
}