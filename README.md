# Blog Beauté Français

A French-market beauty blog built with **Next.js 14** (App Router). It lets users search for cosmetic products by name, brand, or ingredient, scan product barcodes with their device camera, browse makeup products, and watch beauty Shorts from YouTube — all in French.

---

## Features

- **Live product search** — debounced search (600 ms) with automatic spelling correction and English→French term translation (e.g. "sunscreen" → "crème solaire", "loreal" → "l'oréal")
- **Smart tag suggestions** — contextual filter chips appear as the user types (e.g. typing "mascara" suggests "volume", "waterproof", "vegan"…)
- **Barcode scanner** — camera overlay using the native `BarcodeDetector` Web API (no library needed); scans EAN-13, EAN-8, UPC-A, UPC-E and QR codes and looks up the product instantly
- **Makeup products page** — catalog sourced from the Makeup API
- **Beauty & Ingredients page** — detailed product data (ingredients, brands, quantities) from Open Beauty Facts (FR)
- **YouTube Beauty Shorts** — portrait 9:16 Shorts embedded from YouTube, searchable, targeted at the French market
- **Full French UI** — language, content, and API region all target France

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Bootstrap 5 |
| Product data | [Open Beauty Facts](https://fr.openbeautyfacts.org) |
| Makeup catalog | [Makeup API](https://makeup-api.herokuapp.com) |
| Videos | YouTube Data API v3 |
| Barcode scan | Native `BarcodeDetector` Web API |

---

## Prerequisites

- Node.js 18+
- A [YouTube Data API v3](https://console.cloud.google.com/) key

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd next-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file at the project root:

   ```env
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**

   ```bash
   npm run build
   npm run start
   ```

---

## File Tree

```
next-app/
├── .env                          # Environment variables (YouTube API key)
├── package.json
├── tsconfig.json
└── src/
    ├── api/
    │   └── index.tsx             # Shared API fetcher functions (Makeup API, Open Beauty Facts, YouTube)
    │
    ├── components/
    │   ├── NavBar/
    │   │   └── index.tsx         # Top navigation bar
    │   ├── HomeSearch/
    │   │   └── index.tsx         # Home page: search bar, tag chips, live results, scan trigger
    │   └── BarcodeScanner/
    │       └── index.tsx         # Full-screen camera overlay for barcode scanning
    │
    └── app/
        ├── layout.tsx            # Root layout (Bootstrap, NavBar, lang="fr")
        ├── page.tsx              # Home page — renders HomeSearch
        ├── globals.css
        ├── types.ts              # Shared TypeScript types
        ├── loading.js            # Global loading state
        ├── not-found.tsx         # 404 page
        │
        ├── beauty-facts/
        │   └── page.tsx          # Product search results page (Open Beauty Facts)
        ├── makeup-products/
        │   └── page.tsx          # Makeup catalog page (Makeup API)
        ├── videos/
        │   ├── page.tsx          # YouTube Beauty Shorts page
        │   └── SearchForm.tsx    # Client-side search form for videos
        ├── contact/
        │   └── page.tsx          # Contact page
        ├── membership/
        │   └── page.tsx          # Membership page
        │
        └── api/
            ├── suggest-tags/
            │   └── route.ts      # POST /api/suggest-tags — returns contextual French beauty tags
            ├── search-products/
            │   └── route.ts      # GET  /api/search-products?q= — searches Open Beauty Facts with normalization
            └── scan-barcode/
                └── route.ts      # GET  /api/scan-barcode?code= — looks up a product by barcode
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/suggest-tags` | Returns tag suggestions for the typed search term |
| `GET` | `/api/search-products?q=` | Searches products on Open Beauty Facts with brand/term normalization |
| `GET` | `/api/scan-barcode?code=` | Looks up a product by EAN/UPC barcode (FR → World fallback) |

---

## Barcode Scanning

The scanner uses the browser-native **BarcodeDetector API** — no third-party library or server round-trip for detection. It is supported in Chrome and Safari 17+. A fallback message is shown on unsupported browsers.

Barcode lookup first queries `fr.openbeautyfacts.org`, then falls back to `world.openbeautyfacts.org` for broader product coverage (e.g. sunscreens, pharmacy brands).
