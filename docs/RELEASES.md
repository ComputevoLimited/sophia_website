# Releases — SOPHIA website

Map: [README.md](README.md). Full older detail: [RELEASES_ARCHIVE.md](RELEASES_ARCHIVE.md). Release steps: [WORKING_RULES.md](WORKING_RULES.md) section 2 and [manual/deployment.md](manual/deployment.md).

## How releases reach the site

- **Production does not exist yet** (no domain). The only live site is the **review site** `https://sophia-website-stg.computevo-limited.workers.dev`.
- A release is a push to branch `stg`: the GitHub Action "Deploy Staging" publishes it to the review site in about 30 seconds. Each row below is a commit that was (or came with) a push to `stg`. Commits before 2026-09-14 predate the `stg` branch.
- Only on the owner's explicit instruction for that batch.

## Review-site deploys (latest first)

| Date | Commit | What changed |
|------|--------|--------------|
| 2026-11-25 | `320fb89` | Header is now a blue bar with white menu, a light small logo and a champagne line, so it stands out from the page below. |
| 2026-11-17 | `ebb9676` | Contact form shown on the page (front end only; says "not connected" when sent); footer reduced to a small eye beside the full name, the letters S-O-P-H-I-A highlighted. Came with `443f3a5` (the form code). |
| 2026-11-17 | `3733269` | One blue everywhere; "Wisdom" renamed SOPHIA; Principle section layout (quote left, paragraphs right); the logo's eye as tab icon; stronger hero instrument; champagne tags with a blue outline. |
| 2026-11-17 | `30460d6` | Our Aim starts "SOPHIA stands for …" with the full name highlighted; header logo hides while the hero logo is visible. |
| 2026-11-16 | `8cc0047` | Neon accent replaced by champagne gold; Get Involved becomes a beige band. |
| 2026-11-16 | `45d4de7` | Three-colour palette (navy, ghost white, neon). Replaced the same day. |
| 2026-11-16 | `8f6c4ec` | Palette rebuilt around the supplied logo (navy and gold); logo cut out and used in header and hero. |
| 2026-11-10 | `beb202a` | Footer line "Powered & Designed by Computevo.io \| All rights reserved \| © 2026". |
| 2026-11-01 | `179e148` | Redesign: light page, text wordmark, hero entrance and scroll fade-in animations; Greek version and switcher removed. |
| 2026-09-22 | `c1a63f8` | Draft logo archive (`branding/`) removed from the repository. |
| 2026-09-14 | `76f2c01` | Fix: the Worker now runs first on every request, so the security headers really apply. |
| 2026-09-14 | `bb34334` | HTML check on pull requests (CI). |
| 2026-09-14 | `b72e273` | Deploy trigger moved from `dev` to a dedicated `stg` branch. |
| 2026-09-14 | `5d2bb0c` | Worker renamed `sophia-website-stg`. |
| 2026-09-14 | `c3e3f0b` | workers.dev address enabled so the site can be shared (no domain yet). |
| 2026-09-06 | `ab7f69f` | Deploy through Cloudflare Workers and GitHub Actions, like the owner's other sites. |
| 2026-09-06 | `653bc57` | The real SOPHIA logo replaces the draft; hero refined. |
| 2026-08-28 | `b4bf707` | English/Greek toggle, hero acronym callout, logo exploration (since removed). |
| 2026-08-22 | `45c03fc` | First commit: page with English/Greek and logo drafts. |

## How to release

Follow [WORKING_RULES.md](WORKING_RULES.md) section 2. After the deploy add a row at the top of the table (date, short commit hash, one or two sentences of what the visitor sees), in the same commit as the code where possible. When the table passes about 50 rows, move the oldest to [RELEASES_ARCHIVE.md](RELEASES_ARCHIVE.md).
