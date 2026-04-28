# House of AB Scent Finder

A luxury fragrance recommendation web app for **House of AB**. Enter a favourite perfume name, notes, or mood descriptors and the app will surface the best matching House of AB scents from the curated fragrance library.

## Setup

**Prerequisites:** Node.js 18 or later.

```bash
# 1 – Install dependencies
npm install

# 2 – Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Project structure

```
scentfinder/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # UI — landing, input, results, CTA
    ├── App.css               # House of AB luxury styling
    ├── data/
    │   └── fragrances.js     # Fragrance library (9 scents)
    └── utils/
        └── recommendation.js # Weighted scoring engine
```

## How the recommendation engine works

User input is split into individual terms and matched against each fragrance using a weighted scoring system:

| Match type              | Points |
|-------------------------|--------|
| Exact note match        | +3     |
| Scent family match      | +2     |
| Profile tag match       | +2     |
| Synonym / mood match    | +1     |

A built-in synonym map expands common mood words (e.g. `oud → agarwood, woody, smoky, resinous`) so plain-language descriptions work alongside note names. The top 3 results are returned, with confidence percentages scaled relative to the highest-scoring match.

## Tech stack

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- Plain CSS (no framework)
- Google Fonts — Cormorant Garamond & Montserrat
