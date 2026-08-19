// preloader.js
// Responsabilidad única: la secuencia de la terminal de entrada.
// No sabe nada del tragamonedas ni del audio — solo tipea texto y
// espera Enter. main.js decide cuándo llamarla y qué hacer después.

const TYPE_SPEED_MS = 35;

// Tipea "text" letra por letra dentro de "element". Devuelve una
// promesa que se resuelve al terminar — permite usar await y encadenar
// el siguiente paso (mostrar el hint) recién cuando el tipeo termina.
function typeText(text, element) {
  return new Promise((resolve) => {
    let index = 0;

    const interval = setInterval(() => {
      element.textContent += text[index];
      index++;

      if (index === text.length) {
        clearInterval(interval);
        resolve();
      }
    }, TYPE_SPEED_MS);
  });
}

// Se resuelve la primera vez que se presiona Enter. { once: true } saca
// el listener solo después de dispararse una vez, para no dejarlo
// escuchando el teclado para siempre después de que ya cumplió su función.
function waitForEnter() {
  return new Promise((resolve) => {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter") resolve();
      },
      { once: true }
    );
  });
}

// Corre la secuencia completa: muestra el preloader, tipea el texto,
// muestra el hint, espera Enter, esconde el preloader.
export async function runTerminalPreloader(text) {
  const preloader = document.getElementById("terminal-preloader");
  const textEl = document.getElementById("terminal-text");
  const hintEl = document.getElementById("terminal-hint");

  preloader.classList.remove("hidden");

  await typeText(text, textEl);

  hintEl.classList.remove("hidden");
  await waitForEnter();

  preloader.classList.add("hidden");
}