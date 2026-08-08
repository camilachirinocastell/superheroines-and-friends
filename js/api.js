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

  // Convierte la respuesta cruda a un array de objetos JS.
  const heroes = await response.json();

  return heroes;
}