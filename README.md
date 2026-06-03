# Nua — Period Care & Wellness PDP

A Product Detail Page (PDP) for Nua's Ultra-Soft Period Underwear, built as a frontend assignment. Themed to match Nua's actual brand identity at [nuawoman.com](https://nuawoman.com).

---

## Stack

| Concern | Choice |
|---|---|
| Framework | React 19 (hooks only, no class components) |
| Build | Vite 5.4 |
| Language | TypeScript 5.6 (strict mode) |
| Styling | SCSS Modules — BEM naming, no Tailwind, no CSS-in-JS |
| State | React Context API + useReducer |
| Data | Fake Store API + mock variant layer |
| Testing | Vitest 2 + React Testing Library |

---

## Getting Started

Requires **Node 18+** (tested on Node 22).

```bash
git clone <repo-url>
cd nua-pdp
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Other commands

```bash
npm run build      # Production build (tsc + vite build)
npm run preview    # Preview production build at localhost:4173
npm run test       # Run unit tests
npm run test:watch # Watch mode
```

---

## Project Structure

```
src/
├── components/
│   ├── AddToCartButton/
│   ├── CartToast/
│   ├── Header/
│   ├── ImageGallery/
│   ├── ProductDetails/
│   ├── ProductInfo/
│   ├── QuantityPicker/
│   └── VariantSelector/
├── data/
│   ├── mockProduct.ts     # Variant data, colour images, specifications
│   └── mockReviews.ts
├── hooks/
│   ├── useCart.ts         # Cart context consumer
│   ├── useProduct.ts      # Fake Store API + mock data layer
│   └── useVariant.ts      # URL-driven variant selection
├── stores/
│   └── CartContext.tsx    # Cart state with localStorage persistence
├── styles/
│   ├── _variables.scss
│   ├── _reset.scss
│   ├── _typography.scss
│   └── global.scss
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
tests/
├── VariantSelector.test.tsx
└── AddToCartButton.test.tsx
docs/
└── lighthouse-report.html
public/
├── nua-logo.webp
├── underwear-light-pink.webp
├── underwear-lemon-green.webp
└── underwear-light-purple.webp
```

---

## Features

### Product Gallery
- Primary image with CSS zoom on hover (`transform: scale(1.08)`, `overflow: hidden`)
- Thumbnail strip for desktop, dot navigation for mobile
- Image resets to index 0 on colour change

### Variant Selector
- Colour swatches with active ring
- Size buttons: active, low-stock (amber), sold-out (disabled + strikethrough)
- `?colour=X&size=Y` URL params as source of truth — deep links work and survive refresh
- Invalid params fall back silently to first in-stock variant

### Cart
- Add to Bag with 600ms mock async API — 30% random failure rate to exercise error/retry UX
- Error state shows inline message + "Try Again" button; resets cleanly on retry
- Quantity picker capped at available stock
- Cart state persisted to `localStorage` key `nua_cart` via lazy initializer (no wipe-on-refresh)
- Running item count shown in header bag icon

### Product Details
- Accordion with `max-height` CSS transition, one panel open at a time
- Chevron rotates 180° when open

### Performance
- Lighthouse (localhost dev server): **Performance 59 · Accessibility 96 · Best Practices 100 · SEO 92**
- Performance 59 on localhost is expected — Vite dev server uses unbundled ESM over HTTP/1; production on a CDN (HTTP/2, edge caching, pre-compressed assets) scores significantly higher
- Optimisations applied after reviewing the report: WebP images (11 KB each), `fetchPriority="high"` on the LCP primary image, `loading="lazy"` on thumbnails, `<link rel="preload">` for the hero image, `dns-prefetch` for the Fake Store API, background API fetch so render is never blocked

---

## Data Source

Product data comes from [Fake Store API](https://fakestoreapi.com/products/19). The API call runs in the background after initial render — the page never blocks on it. All variant data, images, pricing, and specifications come from `src/data/mockProduct.ts`. See DECISIONS.md for the full rationale.

---

## Design Decisions

See [DECISIONS.md](./DECISIONS.md) for the three architectural choices:

1. Image zoom on hover — CSS scale vs loupe
2. Tabs vs Accordion for product details
3. URL params vs Context as the source of truth for variant state

---

## Known Tradeoffs

- **Reviews are static.** Three hardcoded entries in `mockReviews.ts`. A real implementation would fetch from a reviews API (Yotpo, Stamped, etc.).
- **Single product page.** No router. URL params track variant state only. A multi-product site would add React Router.
- **No auth or checkout.** Scope is the PDP only. The cart persists to localStorage but has no checkout flow.

---

## Tests

15 unit tests across two suites:

```bash
npm run test
```

**`VariantSelector` + `QuantityPicker`** (9 tests)
- Sold-out button is disabled and non-clickable
- Low-stock label appears only when stock ≤ 2
- `onSizeChange` fires with correct size; doesn't fire on sold-out click
- `+` disabled at max stock, `−` disabled at qty 1; both fire `onChange` correctly

**`AddToCartButton`** (6 tests)
- Sold-out: button disabled, API never called
- Loading: button disabled + shows "Adding…" while API is in-flight
- Success: `onSuccess` called, button resets to "Add to Bag"
- Failure: `onError` called, button shows "Try Again", alert shows error message
- Retry: error clears, second click succeeds end-to-end

---

## Deployment

Live URL: **https://nua-pdp.vercel.app**

### Deploy to Vercel (one-time setup)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import the GitHub repo
3. Framework preset: **Vite** (auto-detected)
4. Build command: `npm run build` · Output dir: `dist`
5. Click Deploy

The `vercel.json` in the repo root configures this automatically.
