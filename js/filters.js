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