# Architecture — SOPHIA website

Map: [README.md](README.md). Rules: [WORKING_RULES.md](WORKING_RULES.md). Which file holds what: [manual/code-map.md](manual/code-map.md).

## 1. Picture

```
Visitor's browser
      |  https
      v
Cloudflare Worker "sophia-website-stg"   (src/worker.js)
      |  1. asks the static-files store (binding ASSETS) for the file
      |  2. adds security headers and the cache rule
      v
Static files = the project folder minus .assetsignore:
   index.html   css/styles.css   js/main.js   assets/*.png   favicon.ico

Only other outside contact: Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
Planned, not built: POST /api/contact  ->  Worker  ->  inbox      (API.md)
```

## 2. Pattern and why

A one-page static site: no framework, no build step, no server code except a tiny Worker. **Why:** the site is small and mostly text; static files are fast, cheap and have almost nothing to attack. **Trade-offs:** no content editor (text is edited in `index.html`); no server logic until the contact endpoint is built.

## 3. Technology

| Part | Choice |
|------|--------|
| Page | Plain HTML (`index.html`), one stylesheet, one script, no libraries |
| Fonts | Manrope (sans) and Source Serif 4 (serif) from Google Fonts |
| Hosting | Cloudflare Workers with static assets (`wrangler.jsonc`) |
| Deploy | GitHub Actions workflow `deploy-stg.yml` using wrangler 4 |
| Checks | `htmlhint` on pull requests; own tests in `tests/` ([TESTING.md](TESTING.md)) |
| Local preview | A plain file server on port 2222 (see [manual/deployment.md](manual/deployment.md)) |

## 4. Parts and responsibilities

| Part | Responsibility |
|------|----------------|
| `index.html` | All content and structure; names the asset versions |
| `css/styles.css` | The whole look, one file, colours as variables at the top |
| `js/main.js` | Menu toggle, fade-in on scroll, header-logo rule, contact-form check and send |
| `src/worker.js` | Serves the files, adds security headers and the cache rule |
| `wrangler.jsonc` | Worker name, entry file, static-files folder, "run the Worker first" |
| `.assetsignore` | What must **not** be published |

## 5. Environments

| Environment | Where | Branch | Deployed by | Notes |
|-------------|-------|--------|-------------|-------|
| Local preview | `http://localhost:2222` | working copy | the assistant's launch entry | No Worker: no headers, `POST /api/contact` gives 501 |
| Development | none | `dev` | nothing | Where all work is committed |
| **Review site (staging)** | `https://sophia-website-stg.computevo-limited.workers.dev` | `stg` | GitHub Action on every push to `stg` | Public; the owner and clients look here |
| Production | **none yet** | — | — | Needs a domain: **not recorded — owner to confirm** |

## 6. Main flows

- **Page load:** HTML (never cached) → stylesheet and script (cached a year, hence `?v=N`) → fonts. The script marks the page `.js`, then fades sections in as they scroll into view.
- **Header logo:** hidden while the big hero logo is on screen; shown once it has scrolled out of view.
- **Contact form:** visitor fills it → the script checks the fields → `fetch` POST to `/api/contact`. Today that address does not exist: the Worker passes it to the static files, which answer 404, and the form says "not connected" ([manual/contact-form.md](manual/contact-form.md)).
- **Release:** commit on `dev` → fast-forward `stg` → push → GitHub Action deploys ([manual/deployment.md](manual/deployment.md)).

## 7. Rules between the parts

- The page may load only its own files plus the two Google font hosts (the security policy enforces this).
- Nothing in `docs/`, `tests/`, `src/` or config may be published.
- Every change to `css/styles.css` or `js/main.js` bumps its `?v=` number in `index.html`.

## 8. Key decisions

| Decision | Why | Since |
|----------|-----|-------|
| Static site + Worker, same setup as the owner's other sites | Familiar, cheap, safe | 2026-09-06 |
| Deploy only from branch `stg`; `dev` never deploys | Owner decides when something is public | 2026-09-14 |
| Worker runs first on every request (`run_worker_first`) | Otherwise static files are served without the security headers | 2026-09-14 |
| Strict security policy: no inline styles or scripts | Blocks injected code | 2026-09-06 |
| Language: English only | Owner's decision (Greek removed) | 2026-11-01 |
| Contact form posts to our own Worker (`connect-src 'self'`), not to a third party | Visitor details stay with us | 2026-11-17 |
| One blue, champagne gold, ghost white | Owner wanted a serious, minimal palette | 2026-11 |

## 9. Performance and limits

- The page is about 12 KB of HTML, 15 KB of CSS, 5 KB of JavaScript; the largest image is the hero logo (about 126 KB).
- HTML is never cached; other files are cached for a year ("immutable"), so a changed file needs a new `?v=N` or a new name.
- Cloudflare plan limits and traffic expectations: **not recorded — owner to confirm**.

## 10. Failure scenarios

| If | Then |
|----|------|
| JavaScript fails or is blocked | All text stays visible (the fade-in only hides things when the script has started); the menu button and form do not work |
| Browser has no IntersectionObserver | Everything is shown at once; the header logo stays visible |
| Google Fonts are blocked | System fonts are used; the layout holds |
| `/api/contact` is missing (404, 405, 501) | Form says it is not connected and nothing is sent |
| `/api/contact` fails otherwise | Form says "could not be sent, try again"; what the visitor typed is kept |
| GitHub Action fails | The review site keeps the previous version; fix and push again |
| Cloudflare token is revoked or expires | Deploy fails with an authorisation error ([SECURITY.md](SECURITY.md)) |
| A file is added that should be private | `tests/publish.test.js` fails until it is excluded |

## 11. Where we stand

| Area | State |
|------|-------|
| Page content and design | Done and approved by the owner on the review site |
| Contact form | Front end done; **server side missing** (needs inbox + delivery choice) |
| Production, domain | Not started |
| Privacy notice | Not started |
| Docs and tests | Set up 2026-11-25 ([TESTING.md](TESTING.md)) |
