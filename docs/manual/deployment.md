# Deployment — SOPHIA website

Back to [MANUAL.md](../MANUAL.md) and [README.md](../README.md).

## The setup in one paragraph

The site is served by a Cloudflare Worker named `sophia-website-stg` (`wrangler.jsonc`). The Worker (`src/worker.js`) serves the project folder as static files and adds security headers. A GitHub Action (`.github/workflows/deploy-stg.yml`) deploys it on every push to the branch `stg`, using two repository secrets (names in [../SECURITY.md](../SECURITY.md)). It is the same arrangement as the owner's other sites.

## Environments

| Environment | Address / place | Branch | How it gets updated |
|-------------|-----------------|--------|---------------------|
| Local preview | `http://localhost:2222` | working copy | The assistant's launch entry `sophia-website` (a plain file server; config in `C:\GitHub\.claude\launch.json`, outside the repo) |
| Development | GitHub `ComputevoLimited/sophia_website`, branch `dev` (the default branch) | `dev` | Commits; **no deploy** |
| Review site | `https://sophia-website-stg.computevo-limited.workers.dev` | `stg` | Push to `stg` |
| Production | none yet | — | See "Going live" |

The address `computevo-limited.workers.dev` is the owner's Cloudflare account sub-domain. Cloudflare's workers.dev address is on (`workers_dev: true`) only so the site can be shared before a domain exists.

## Release steps

Exactly as in [../WORKING_RULES.md](../WORKING_RULES.md) section 2:

```
git branch --show-current          # must say: dev
git checkout stg
git merge --ff-only dev            # stg only ever moves forward to dev
git push origin dev stg            # the push to stg starts the deploy
git checkout dev
gh run list --branch stg --limit 1 # wait until it says completed / success (about 30 seconds)
node tests/smoke.js https://sophia-website-stg.computevo-limited.workers.dev
```

## What the Action and Cloudflare do

1. GitHub checks out the code and runs wrangler 4 with the account token.
2. Wrangler uploads the folder as static files, **minus what `.assetsignore` lists**, and the Worker code from `src/worker.js`.
3. Every request goes to the Worker first (`run_worker_first`), which fetches the file and adds the security headers and the cache rule.

## Caching (the usual surprise)

- `/` and `.html`: never cached.
- Everything else: cached **one year, immutable**. So after any change to `css/styles.css` or `js/main.js` raise `?v=N` in `index.html`; a changed image needs a new file name.
- The smoke check compares the live stylesheet and script with the project's, and the `?v=` numbers.

## Checks after a deploy

`node tests/smoke.js <address>` covers: pages answer; private addresses are "not found"; security headers; files identical to the project's. By hand: open the review link and look at what changed (a hard refresh clears the browser's old copy).

## Undoing a release

Nothing is deleted. Find the bad commit with `git log`, run `git revert <hash>` on `dev`, then release as usual. To go back faster, `git revert` the last commit and push both branches.

## Going live (not started — owner to confirm each step)

Needs: a domain; the domain added to Cloudflare; a decision whether production is a second Worker (for example `sophia-website`) deployed from a new branch or the same Worker moved to the domain; a privacy notice; the contact form connected ([contact-form.md](contact-form.md)); production approvals ("who approves a go-live" is **not recorded — owner to confirm**). Add the new environment to the table above and to [../ARCHITECTURE.md](../ARCHITECTURE.md) when it exists.

## Gotchas

- A push to `stg` is a public deploy. Only on the owner's instruction.
- The local preview does not send the security headers; test headers on the review site with the smoke check.
- The Action prints warnings about Node 20 and about the `ubuntu-latest` label; they are harmless today.
