# SOPHIA website — documentation map

The website of the association **SOPHIA — Society for the Observation of Public and Human Impacts of AI**: one page, English, built as plain HTML, CSS and a little JavaScript, published by a Cloudflare Worker. Start with [WORKING_RULES.md](WORKING_RULES.md) (loaded automatically through the root `CLAUDE.md`), then read **only the one file your task needs**.

| File | What it is | Read it when |
|------|------------|--------------|
| [WORKING_RULES.md](WORKING_RULES.md) | How we work here: release steps, never / always lists, gotchas | Every session |
| [PRD.md](PRD.md) | What the site is for, who uses it, what it does, what it must not do, open questions | You need the "why" or are asked for a new feature |
| [ARCHITECTURE.md](ARCHITECTURE.md) | The parts, environments, flows, decisions, limits, failure cases, where we stand | You change how it is built or published |
| [API.md](API.md) | The (planned) `/api/contact` endpoint and how to add one | You build or change the form's server side |
| [DATABASE.md](DATABASE.md) | There is no database; what is stored (nothing) and the plan | You are asked to keep data |
| [SECURITY.md](SECURITY.md) | Credentials register (names and places only), leak playbook, owner to-do, checklist | You touch secrets, headers, publishing, visitor data |
| [TESTING.md](TESTING.md) | How to run the tests, what they prove, what they do not, release checklist | You add or run tests, or prepare a release |
| [DESIGN.md](DESIGN.md) | The look in one page and the owner's design decisions | You change anything visual |
| [MANUAL.md](MANUAL.md) | Index of the topic files in `manual/` | You need detail on one area |
| [manual/code-map.md](manual/code-map.md) | Which section of which file holds each feature | **First, for any code task** |
| [RELEASES.md](RELEASES.md) | Short log of what reached the review site | You need to know what changed when |
| [RELEASES_ARCHIVE.md](RELEASES_ARCHIVE.md) | Word-for-word older history | Rarely |

## Rules for this folder

- All documents live in `docs/`, except the three-line root `CLAUDE.md`.
- **Private.** The site publishes the whole project folder except what `.assetsignore` lists; `docs/`, `tests/`, `src/` and `CLAUDE.md` are listed. Proof: `node tests/publish.test.js` (offline) and `node tests/smoke.js <address>`, which asks the live site for `/docs/README.md`, `/docs/manual/code-map.md`, `/CLAUDE.md`, `/tests/run.js`, `/src/worker.js` and expects "not found".
- **No secrets and no personal data**, ever: names and places of secrets only.
- **One fact lives in one file**; other files point to it. Docs and tests change in the same commit as the code.
- Size limits (checked by `tests/docs.test.js`): `CLAUDE.md` plus `WORKING_RULES.md` at most 12 KB; every other file at most 30 KB; release-log rows at most 600 characters. If a file grows past its limit, split it by topic and list the new file in [MANUAL.md](MANUAL.md).
- Where something is not known, the text says **"not recorded — owner to confirm"**. Do not guess it.
