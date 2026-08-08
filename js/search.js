// search.js
// Responsabilidad única: filtrar una lista de héroes por nombre.
// No toca el DOM ni sabe que existe un input — solo recibe datos y devuelve datos.
// Esto permite testear o reutilizar esta función sin depender del HTML.

export function filterHeroesByName(heroes, query) {
  // Normalización: minúsculas y sin espacios sobrantes al inicio/final,
  // así "Batman", " batman ", "BATMAN" se comparan todas igual.
  const normalizedQuery = query.toLowerCase().trim();

  // Si no hay texto de búsqueda, se devuelve la lista completa sin filtrar.
  if (!normalizedQuery) return heroes;

  // .filter() recorre el array y devuelve uno nuevo, más chico,
  // solo con los héroes cuyo nombre (normalizado también) contiene
  // el texto buscado en cualquier posición — no solo al principio.
  return heroes.filter((hero) =>
    hero.name.toLowerCase().includes(normalizedQuery)
  );
}