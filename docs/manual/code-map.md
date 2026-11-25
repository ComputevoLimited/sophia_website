# Code map — SOPHIA website

Back to [MANUAL.md](../MANUAL.md) and [README.md](../README.md).

## Why this file exists

The project is small, but `css/styles.css` (about 15 KB, 690 lines) and `index.html` (about 12 KB) are still 4,000 tokens each. Open this map, then read **only the lines of the section you need** (`sed -n 'START,+60p' file`). Line numbers are approximate; the section comments in the CSS and the `id`s in the page are stable.

It is kept true by `tests/docs.test.js`: every function written like `name()` and every file path in back-ticks here must exist.

## Sections of each file

### `index.html` (212 lines)

| Line | Section | Notes |
|------|---------|-------|
| 1–19 | `<head>` | Title, description, tab icons, fonts link, stylesheet link with `?v=N` |
| 21 | Header `#site-header` | Small logo (`.brand`), menu `.nav-links`, menu button `#nav-toggle` |
| 40 | Hero `#top` | Instrument SVG (`.hero-art`), big logo `.hero-logo`, line, text, two buttons |
| 83 | Our Aim `#about` | Lead paragraph; the full name is `.aim-name` |
| 93 | Principle of SOPHIA `#principle` | `.principle-head` (label + quote) and `.principle-body` (two paragraphs) |
| 106 | Objectives `#objectives` | Four numbered items `.objective-list` |
| 133 | Get Involved `#get-involved` | Heading, paragraph, the form `#contact-form` (line 140) |
| 192 | Footer | Eye `.footer-eye`, full name with `.initial` letters, `.footer-legal` |
| 210 | Script tag | `js/main.js?v=N` |

### `css/styles.css` (691 lines)

| Line | Section | Notes |
|------|---------|-------|
| 1 | Variables `:root` | Colours, fonts, widths (the design source of truth) |
| 21–66 | Base | Reset, body, links, focus ring, container, skip link |
| 68 | Header | `.brand` (hides until the hero logo has gone), `.site-header`, menu, button lines |
| 140 | Buttons | `.btn`, `.btn-primary`, `.btn-outline` |
| 173 | Hero | `.hero`, the instrument `.hero-art` and its turning rings |
| 221 | Entrance and scroll reveal | `rise`, `fade-in`, `.js .reveal` |
| 280 | Highlights | `.hl` (stripe behind a word), `.accent` (gold text on blue) |
| 298 | Sections | `.section`, `.eyebrow` label, `.section-title`, `.split` |
| 338 | About | `.lede`, `.aim-name` |
| 358 | Principle | `.principle-split`, `.big-quote`, `.principle-body` |
| 397 | Objectives | `.objective-list`, `.objective-number` |
| 434 | Get Involved | `.get-involved`, `.cta`, `.cta-lede` |
| 472 | Contact form | `.contact-form`, fields, errors, spam trap `.hp`, `.form-status` |
| 577 | Footer | `.site-footer`, `.footer-name`, `.footer-eye`, `.initial`, `.footer-legal` |
| 630 | Media queries | Tablet (960), menu fold (900), phone (720), reduced motion |

### `js/main.js` (122 lines)

| Line | Section | Main functions |
|------|---------|----------------|
| 1–14 | Menu | Opens and closes the phone menu, closes it on a link click |
| 16–39 | Fade-in and header logo | `IntersectionObserver`: marks `.js`, reveals `.reveal` items, toggles `show-brand` on the header |
| 41–122 | Contact form | `setError()` shows or clears a field's message; `validate()` checks one field; the `submit` handler checks all, stops spam, sends, and shows the result |

### `src/worker.js` (51 lines)

| Line | Section | Main functions |
|------|---------|----------------|
| 6 | The Worker | Asks the static files for the request, then adds headers |
| 13 | Headers and cache | `addSecurityHeaders()` sets the cache rule and every security header, including the content security policy |

### Config

| File | What |
|------|------|
| `wrangler.jsonc` | Worker name, entry file, static folder `.`, `run_worker_first` |
| `.assetsignore` | What is **not** published |
| `.github/workflows/deploy-stg.yml` | Deploy on push to `stg` |
| `.github/workflows/ci.yml` | On pull requests: HTML check and `node tests/run.js` |

## Features

| Feature | Page | Styles | Script / Worker | Data | Tests | Topic file |
|---------|------|--------|-----------------|------|-------|------------|
| Menu and header | header, `#nav-toggle` | Header, media queries | Menu part of `js/main.js` | none | `tests/site.test.js` | [public-site.md](public-site.md) |
| Header logo rule | `.brand`, `.hero-logo` | `.brand` rules | `show-brand` in `js/main.js` | none | by eye | [public-site.md](public-site.md) |
| Hero and instrument | `#top` | Hero | none | `assets/logo-mark.png` | `tests/site.test.js` | [public-site.md](public-site.md) |
| Our Aim, Principle, Objectives | `#about`, `#principle`, `#objectives` | About, Principle, Objectives | fade-in part | none | `tests/site.test.js` | [public-site.md](public-site.md) |
| Contact form | `#contact-form` | Contact form | `setError()`, `validate()`, submit handler | none (nothing stored) | `tests/site.test.js` | [contact-form.md](contact-form.md) |
| Footer | footer | Footer | none | `assets/logo-eye-light.png` | `tests/site.test.js` | [public-site.md](public-site.md) |
| Tab icons | `<head>` | none | none | `favicon.ico`, `assets/favicon-32.png`, `assets/favicon-192.png`, `assets/apple-touch-icon.png` | `tests/site.test.js` | [branding-and-assets.md](branding-and-assets.md) |
| Security headers, cache | none | none | `addSecurityHeaders()` | none | `tests/publish.test.js`, `tests/smoke.js` | [deployment.md](deployment.md) |
| What is published | none | none | `wrangler.jsonc` | `.assetsignore` | `tests/publish.test.js`, `tests/smoke.js` | [deployment.md](deployment.md) |
| Deploy | none | none | `.github/workflows/deploy-stg.yml` | none | `tests/smoke.js` | [deployment.md](deployment.md) |

## Where to start for a typical task

- **Change a wording:** `grep -n "words" index.html`, edit, raise nothing (HTML is never cached), run the tests.
- **Change a colour or spacing:** the variable or section in `css/styles.css`; raise the stylesheet `?v=` in `index.html`; keep to the agreed colours ([../DESIGN.md](../DESIGN.md)).
- **Change a behaviour:** `js/main.js`; raise the script `?v=`.
- **Make the form deliver messages:** [contact-form.md](contact-form.md), then [../API.md](../API.md); the route goes in `src/worker.js` before the static-files call.
- **Add an image:** [branding-and-assets.md](branding-and-assets.md); new file name, keep it under `assets/`.
- **Release:** [deployment.md](deployment.md).
