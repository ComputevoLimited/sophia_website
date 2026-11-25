# Working rules — SOPHIA website

Read this every session. The map of everything else is [README.md](README.md).

## 1. The owner

- The owner is **not a developer**. Plain language, short answers. Say what was checked and what could not be (for example "I looked at desktop and phone, not tablet").
- The owner reviews the site by eye in the local preview and on the review link, then says **"commit and push it"** when happy. That sentence is the only approval to commit and push a batch.

## 2. Releases (what "push" means here)

- Environments: local preview → branch `dev` (no deploy) → branch `stg` (the **review site**, deployed automatically). There is **no production yet** (no domain). Details: [manual/deployment.md](manual/deployment.md).
- **Nothing is committed or pushed until the owner says so for that batch.** A push to `stg` publishes to a public address.
- Steps, in this order:
  1. Work on `dev` only. Check `git branch --show-current` before every commit (a commit once landed on `stg` by mistake).
  2. Run `node tests/run.js` and `npx --yes htmlhint "*.html"`. Both must pass.
  3. Show the owner the change in the local preview first (section 3). Wait for approval.
  4. On "commit and push it": commit on `dev` (add the `Co-Authored-By` line the harness gives), then `git checkout stg`, `git merge --ff-only dev`, `git push origin dev stg`, `git checkout dev`.
  5. Wait for the GitHub Action "Deploy Staging" to finish: `gh run list --branch stg --limit 1` (about 30 seconds).
  6. Check the live site: `node tests/smoke.js https://sophia-website-stg.computevo-limited.workers.dev`. Tell the owner what was checked.
- Prove the branches match: `git rev-parse dev stg origin/dev origin/stg` gives one hash.
- Docs and tests change **in the same commit** as the code. A change to `docs/` or `tests/` needs no other approval than the batch's.
- A change to `.assetsignore` or `wrangler.jsonc` changes what is published: run `node tests/publish.test.js` and, after the deploy, the smoke check.

## 3. Looks

- Every visual change is shown in the local preview first, at desktop (about 1440), tablet (about 820) and phone (375) widths, with the console free of errors. The owner decides by eye.
- Do not push a look the owner has not seen. Do not "improve" looks that were not asked for.
- The decisions the owner already made are in [DESIGN.md](DESIGN.md). Do not undo them.

## 4. Never do

- Commit or push without the owner's instruction for that batch.
- Put a secret in a file, a commit or a message. Names and places only ([SECURITY.md](SECURITY.md)).
- Edit, recolour, crop or "clean up" the owner's logo or other images **unless asked**. The only approved derived files are listed in [manual/branding-and-assets.md](manual/branding-and-assets.md).
- Use inline styles, inline scripts or `on…=` handlers: the strict security policy blocks them (`tests/site.test.js` checks).
- Add a colour. The page has **one blue**, ghost white, champagne gold and one beige band; nothing else without asking.
- Show two logos on screen at the same time (the header logo hides while the big hero logo is visible).
- Make `docs/`, `tests/`, `src/` or `CLAUDE.md` public (they are listed in `.assetsignore`; `tests/publish.test.js` checks).
- Tell visitors a contact message was sent when it was not. Never send real messages from tests.
- Bring back what the owner removed: the Greek version and Greek-key decoration, the neon green, the head and dial hero animations, the sentence under the hero logo, a white header, a second blue.

## 5. Always do

- After **any** change to `css/styles.css` or `js/main.js`, raise the `?v=` number in `index.html`. Cloudflare serves them with a one-year cache; without a new number visitors keep the old file.
- A changed image gets a **new file name** (same reason).
- English only. Write **SOPHIA** in capitals. Keep the owner's wording; do not rephrase their text.
- Keep text readable (contrast AA), keep content visible without JavaScript, respect "reduce motion", give every image an `alt`.
- Keep the form message honest: "not connected" when the endpoint is missing ([manual/contact-form.md](manual/contact-form.md)).

## 6. Testing

- Run everything: `node tests/run.js` (Node 18 or newer). Live site after a deploy: `node tests/smoke.js <address>`. What is and is not covered: [TESTING.md](TESTING.md).
- Local preview: the assistant's launch entry `sophia-website` serves the folder on port 2222 (it lives outside the repo, in `C:\GitHub\.claude\launch.json`). It is a plain file server: **no security headers, and `POST /api/contact` answers 501**.
- Never call real services from tests (email, forms).

## 7. Tool and platform gotchas

- Windows with Git Bash: "LF will be replaced by CRLF" warnings are harmless. A long inline Python script in the shell can break on quotes: write a small script file in the scratch folder instead.
- The preview pane only paints after a screenshot is taken, so the first frame after loading shows fade-in animations half done; take a second screenshot. The pane can be narrow and the preview server stops now and then: restart it from the launch entry.
- The scratch folder is cleaned between sessions. Do not rely on files kept there; the logo masters are **not** in the repo ([manual/branding-and-assets.md](manual/branding-and-assets.md)).
- Fonts come from Google Fonts: a preview without internet falls back to system fonts.

## 8. Where to look

- The map: [README.md](README.md). For a code task open [manual/code-map.md](manual/code-map.md) first and read only the section you need. Search (`grep -n`) before opening files.
