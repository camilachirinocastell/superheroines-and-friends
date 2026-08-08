// utils.js
// Funciones auxiliares genéricas

// debounce: retrasa la ejecución de una función hasta que pasa un tiempo
// determinado sin que se la vuelva a llamar. Sirve para que la búsqueda
// no se dispare en cada tecla individual, sino un instante después de
// que la persona deja de escribir.
export function debounce(fn, delayMs = 300) {
  let timeoutId;

  return function (...args) {
    // Cada vez que se llama de nuevo antes de que pase el delay,
    // se cancela el timer anterior y arranca uno nuevo desde cero.
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}