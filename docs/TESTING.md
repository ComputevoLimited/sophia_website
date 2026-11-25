# Testing — SOPHIA website

Map: [README.md](README.md). Rules: [WORKING_RULES.md](WORKING_RULES.md).

## How to run

| Command | What it does |
|---------|--------------|
| `node tests/run.js` (or `npm test`) | Runs every `tests/*.test.js`, each in its own process. Needs Node 18 or newer, no installs. Also runs in GitHub on pull requests (`.github/workflows/ci.yml`) |
| `npx --yes htmlhint "*.html"` | Checks the page's HTML (also in CI) |
| `node tests/smoke.js <address>` | Read-only check of a deployed site. Not part of the normal run: it needs the network and a deploy |
| `node tests/local-smoke.js` | Runs the **real Worker on this computer** (wrangler's local mode, same upload rules as a deploy) and runs the smoke check against it: proves privacy and headers **before** anything is pushed. Needs the internet the first time (it fetches wrangler); starts and stops only its own process |
| `node tests/mutation-check.js` | Proves the tests can fail: breaks the project on purpose in 15 ways, confirms the right test notices each, restores every file. Run it on demand, and again whenever tests are added |

The smoke check for the review site: `node tests/smoke.js https://sophia-website-stg.computevo-limited.workers.dev`.

## What each test proves

| File | Proves |
|------|--------|
| `tests/docs.test.js` | The standard set of documents exists; every link in `docs/` works; every topic file is listed in `MANUAL.md`; size limits hold; every function and file named in the code map is real |
| `tests/secrets.test.js` | No secret-shaped text (keys, tokens, long hashes, "NAME = value") in any text file; `.gitignore` keeps `.env` and `.dev.vars` out of git |
| `tests/publish.test.js` | `.assetsignore` excludes docs, tests, source, config and workflows; only the expected public files would be served; the Worker runs first and sets the security headers; the policy has no `unsafe-inline` |
| `tests/site.test.js` | No inline styles, scripts or handlers; only the two font hosts as outside addresses; every named local file and in-page link is real; images have `alt`; one `<h1>`; asset versions present; stylesheet uses only the agreed colours; the contact form's labels, error lines and address match the script; the footer highlights S-O-P-H-I-A; `js/main.js` is valid JavaScript; the script uses no cookies or browser storage |
| `tests/smoke.js` | Live: public pages and images answer 200; the private addresses answer 404; security headers present; the served stylesheet and script equal the project's; the page names the same asset versions |

## Known limitations the tests record

- `tests/publish.test.js` understands only simple `.assetsignore` rules (a name, or `name/` for a folder). If a more complex rule is added, extend the test.
- The allowed colours list in `tests/site.test.js` is the design decision "one blue": a new colour fails the test until the owner agrees and the list is updated ([DESIGN.md](DESIGN.md)).

## What is not covered

- How the page **looks**: spacing, colours on screen, animation. Checked by eye in the local preview at desktop, tablet and phone widths.
- The contact form **sending**: there is no endpoint yet. When it exists, test it with fakes (never real email) and add the file here.
- Real browsers: the tests read files; they do not run the page. The fade-in, the header-logo rule and the form messages were checked by hand in the preview.
- Cloudflare's own settings in its dashboard (a future domain, caching rules, access rules): `tests/local-smoke.js` runs the real Worker locally under the deploy's upload rules and `tests/smoke.js` checks the deployed site, but neither sees dashboard settings. The local run was proved able to catch a leak: with `src/` taken out of `.assetsignore` it reports `/src/worker.js` as published.
- Accessibility beyond the basics (alt text, contrast values chosen by hand): no automated audit yet.

Gaps worth writing next: tests for `/api/contact` once built; an automated accessibility check.

## Checklist before a release

1. `node tests/run.js` passes; the HTML check passes.
2. The owner has seen the change in the local preview (desktop, tablet, phone) and says "commit and push it".
3. Asset versions (`?v=`) raised for any changed CSS or JS; changed images have new names.
4. Docs updated in the same commit (code map if a section moved; [RELEASES.md](RELEASES.md) row).
5. After the deploy: Action finished successfully; `node tests/smoke.js <address>` passes; tell the owner what was checked and what was not.
