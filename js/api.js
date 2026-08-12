// api.js
// Responsabilidad única de este archivo: hablar con la API de héroes.
// Ningún otro archivo del proyecto debería hacer fetch — solo este.

// URL fija dada por la consigna. No necesita token: esta API es un mirror
// público (copia de superheroapi.com) pensado para usarse directo desde
// el navegador, sin los problemas de CORS que tenía la original.
const API_URL = "https://akabab.github.io/superhero-api/api/all.json";

// async porque await espera la respuesta de la red.
export async function fetchAllHeroes() {
  // Un único pedido: esta API ya devuelve los 563 héroes juntos,
  // no hace falta "barrer" letra por letra como con la otra.
  const response = await fetch(API_URL);

  // fetch() NO rechaza la promesa por errores HTTP (404, 500) — solo por
  // fallas de red. response.ok es la forma de detectar esos casos y
  // convertirlos en un error real que sí pueda atraparse más arriba.
  if (!response.ok) {
    throw new Error(`La API respondió con estado ${response.status}`);
  }

  // Convierte la respuesta cruda a un array de objetos JS.
  const heroes = await response.json();

  return heroes;
}