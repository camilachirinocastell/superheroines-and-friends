// pagination.js
// Responsabilidad única: calcular páginas y recortar el array.
// No toca el DOM, no sabe que existen botones.

const PAGE_SIZE = 20;

// Cuántas páginas hacen falta para mostrar toda la lista.
export function getTotalPages(list) {
  // Math.max(1, ...) evita "Page 1 of 0": si una búsqueda no encuentra
  // nada, la lista queda vacía, y sin este resguardo totalPages daría 0
  // — lo cual rompería la comparación currentPage === totalPages de abajo.
  return Math.max(1, Math.ceil(list.length / PAGE_SIZE));
}

// El "recorte" de 20 elementos que corresponde a la página actual.
export function getPageSlice(list, currentPage) {
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return list.slice(start, end);
}