// audio.js
// Responsabilidad única: controlar el audio de fondo (play/pausa).
// No sabe cuándo tiene que arrancar ni qué botón lo dispara — main.js
// decide eso, mismo principio que dom.js con el modal.

const audio = document.getElementById("bg-audio");
const audioToggleBtn = document.getElementById("audio-toggle");

// Arranca el audio por primera vez (se llama una sola vez, justo
// después del Enter de la terminal — ver main.js).
export function startAudio() {
  audio.play();
  updateButtonIcon();
}

// Alterna entre pausado y sonando cada vez que se hace clic en el botón.
export function toggleAudio() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  updateButtonIcon();
}

// Sincroniza el ícono y el aria-label del botón con el estado real del
// audio — se llama después de cualquier cambio, para que nunca queden
// desincronizados entre sí.
function updateButtonIcon() {
  const isPlaying = !audio.paused;
  audioToggleBtn.textContent = isPlaying ? "🔊" : "🔇";
  audioToggleBtn.setAttribute(
    "aria-label",
    isPlaying ? "Pause music" : "Play music"
  );
}