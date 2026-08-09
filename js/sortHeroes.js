// sortHeroes.js
// Responsabilidad única: ordenar arrays de héroes. No filtra nada, no toca el DOM.

// Ordena alfabéticamente por nombre. direction recibe "az" o "za".
export function sortAlphabetically(heroes, direction) {
  // Se ordena sobre una copia ([...heroes]), no sobre el array original,
  // porque .sort() lo modifica in-place — así no se altera por accidente
  // el estado completo guardado en main.js.
  const sorted = [...heroes].sort((a, b) => a.name.localeCompare(b.name));

  return direction === "za" ? sorted.reverse() : sorted;
}