# Siri Farup — Portfolio

A React + Vite portfolio site with auto-scrolling project strips, a collapsible about panel, tag filtering, and a lightbox. All content is driven by a single `public/content.json` file.

---

## Project structure

```
siri-portfolio/
├── public/
│   ├── content.json          ← All text content & project list
│   ├── About.webp            ← Profile photo
│   └── Projects/
│       └── <folder>/         ← One folder per project
│           ├── 1.webp
│           ├── 2.jpg
│           ├── 3.mp4
│           └── ...           ← Files named 1–N, any image/video ext
├── src/
│   ├── components/
│   │   ├── About.jsx         ← Collapsible hero panel
│   │   ├── About.module.css
│   │   ├── Cursor.jsx        ← Custom SVG cursor
│   │   ├── Lightbox.jsx      ← Fullscreen media overlay
│   │   ├── Lightbox.module.css
│   │   ├── ProjectStrip.jsx  ← Auto-scrolling media strip
│   │   └── ProjectStrip.module.css
│   ├── hooks/
│   │   └── useContent.js     ← Fetches content.json
│   ├── pages/
│   │   ├── Home.jsx          ← Main page layout
│   │   └── Home.module.css
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
└── .github/workflows/
    └── deploy.yml            ← Auto-deploy to GitHub Pages
```

---

## Adding / editing content

Edit **`public/content.json`** — no code changes needed.

### Adding a project

```json
{
  "id":          "unique-slug",
  "title":       "Project Title",
  "folder":      "Projects/My Project Folder",
  "date":        "2025",
  "tags":        ["identity", "editorial"],
  "description": "Short description.",
  "count":       30,
  "columns":     1,
  "color":       "#f0ede8",
  "textColor":   "#111",
  "speed":       "medium"
}
```

| Field | Values | Default |
|---|---|---|
| `count` | max file index to probe | `30` |
| `columns` | `1` or `2` (two-row layout) | `1` |
| `speed` | `slow` / `medium` / `fast` | `medium` |
| `color` | any CSS color | `#f0ede8` |
| `textColor` | `#111` or `rgba(255,255,255,0.8)` | `#111` |

### Adding media

Place files in `public/Projects/<folder>/` named `1.webp`, `2.jpg`, `3.mp4`, etc.  
Supported: `webp png jpg jpeg gif avif svg mp4 mov webm`. Missing numbers are skipped automatically.

---

## Local dev

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push to GitHub.
2. **Settings → Pages → Source → GitHub Actions**.
3. If hosted at `/repo-name/` (not a custom domain), update `vite.config.js`:
   ```js
   base: '/siri-portfolio/'
   ```
4. Push to `main` — the workflow builds and deploys automatically.

### Custom domain
Set `base: '/'` in `vite.config.js` and add a `public/CNAME` file:
```
yourdomainhere.com
```

## Manual build

```bash
npm run build   # outputs static site to dist/
```
