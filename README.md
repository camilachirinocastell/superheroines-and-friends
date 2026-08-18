# Superheroines & Friends

An interactive platform to explore the comic book universe by fetching data from a REST API, with a dedicated focus on the visibility of female characters.

🔗 **Live demo:** (https://superheroines-and-friends.vercel.app/)

## About the project

This project consumes the [Superhero API](https://akabab.github.io/superhero-api/api/all.json) to build a searchable, filterable, paginated hero directory. Unlike conventional listings, it defaults to prioritizing superheroines in the results — a UX decision aimed at representation, without excluding the rest of the roster.

## Features

- Search heroes by name
- Sort results alphabetically (ascending/descending)
- Filter by publisher and alignment
- Pagination (20 results per page)
- Detailed character modal: image, real name, publisher, biography, power stats, height/weight, affiliations

## 🚀 Technical Highlight: The "Superheroine-First" Logic

By default, the application prioritizes female characters in the initial listing. This is achieved with a custom `.sort()` implementation that evaluates the `appearance.gender` property of each character — female characters first, then genderless/non-binary, then male — without filtering anyone out. See `js/sortHeroes.js`.

## Tech Stack

- Vanilla JavaScript (ES Modules)
- SCSS (Live Sass Compiler)
- [Superhero API](https://akabab.github.io/superhero-api/api/all.json)

## Project Structure

├── index.html
├── css/
│   ├── main.scss          → entry point, imports all partials
│   ├── _variables.scss     → design tokens (colors, spacing, breakpoints)
│   ├── _base.scss           → global resets and base element styles
│   └── components/
│       ├── _card.scss
│       ├── _modal.scss
│       ├── _pagination.scss
│       └── _search.scss
└── js/
    ├── main.js             → entry point, wires up all modules
    ├── api.js               → fetches data from the Superhero API
    ├── sortHeroes.js        → superheroine-first sorting logic
    ├── search.js             → search by name
    ├── filters.js            → publisher / alignment filters
    ├── pagination.js        → page slicing logic
    └── dom.js                → renders cards and modal

## Development Setup

This project uses SCSS partials compiled via the **Live Sass Compiler** VS Code extension. The compiler configuration is committed in `.vscode/settings.json` so the output path stays consistent for anyone cloning the repo.

## Status

🚧 In progress — Module 3, ADA ITW.

## Author

Camila Chirino Castell — 
💻 Portfolio: [camilachirinocastell-portfolio.netlify.app](https://camilachirinocastell-portfolio.netlify.app)
🐙 GitHub: [github.com/camilachirinocastell](https://github.com/camilachirinocastell)
👤 LinkedIn: [www.linkedin.com/in/camila-chirino-castell](https://www.linkedin.com/in/camila-chirino-castell)