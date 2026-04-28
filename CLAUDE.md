# House of AB Scent Finder — Project Context

## What it does
A luxury fragrance recommendation web app for House of AB. Users enter a favourite perfume name, notes, or mood descriptors. The app either calls the Claude API to extract a scent profile (for perfume names) or runs local weighted scoring directly (for note/mood keywords), then returns the top 3 matching House of AB fragrances.

## Tech stack
- **Frontend:** React 18 + Vite 5 (plain CSS, no UI framework)
- **Backend (local dev):** Express server (`server.js`) on port 3001
- **Serverless (production):** Vercel serverless function at `api/claude.js`
- **AI:** Claude API — model `claude-sonnet-4-5`

## File structure
```
scentfinder/
├── api/
│   └── claude.js          # Vercel serverless function — proxies Claude API calls
├── src/
│   ├── data/
│   │   └── fragrances.js  # Full House of AB fragrance library (9 scents)
│   ├── utils/
│   │   ├── recommendation.js  # Weighted local scoring engine + synonym map
│   │   └── claudeApi.js       # Perfume name detection + Claude API call
│   ├── App.jsx            # Main UI — header, input, chips, result cards, CTA
│   └── App.css            # Brand styling
├── server.js              # Express dev proxy (mirrors api/claude.js for local use)
├── vercel.json            # Vercel rewrite rule for /api/claude
├── index.html
└── .env                   # ANTHROPIC_API_KEY (never committed)
```

## Environment variable
| Variable | Used in |
|---|---|
| `ANTHROPIC_API_KEY` | `api/claude.js` (Vercel) and `server.js` (local Express) |

Set in Vercel project settings for production. Stored in `.env` locally.

## Running locally
Two terminals required:

```bash
# Terminal 1 — Express proxy (handles Claude API calls)
npm run server

# Terminal 2 — Vite dev server
npm run dev
```

App available at `http://localhost:5173`.

## Deployment
- **Vercel URL:** scent-finder.vercel.app
- **Custom domain:** scents.houseofab.uk (DNS pending)
- Deploys automatically on every push to `main`
- Build command: `node node_modules/vite/bin/vite.js build`
- Output directory: `dist`

## Brand palette
| Token | Hex |
|---|---|
| Navy (primary) | `#0D1F3C` |
| White (background) | `#FFFFFF` |
| Gold (accent/hover) | `#C6A37A` |
| Card background | `#F8F8F8` |
| Border | `#E8E8E8` |
| Muted text | `#6B7A8D` |

Fonts: Cormorant Garamond (headings) + Montserrat (body) via Google Fonts.

## Recommendation engine
Scoring weights (`src/utils/recommendation.js`):
- Exact note match: **+3**
- Scent family match: **+2**
- Profile tag match: **+2**
- Synonym/mood match: **+1**

A synonym map expands mood words (e.g. `warm → amber, spicy, musk, resinous`) before scoring. Top 3 results returned with confidence % relative to the top scorer.

## Perfume name detection (`src/utils/claudeApi.js`)
- Input with a comma → local scoring (notes/moods mode)
- Single known descriptor word → local scoring
- 2+ words with no comma → Claude API call to extract scent profile
- API failure → silent fallback to local scoring

## Fragrance library
AZMIR, IMPERIUM, NOCTORA, AMORIA, MAVROS, NOIR, RIVIÉR, ELARA, VELORA
