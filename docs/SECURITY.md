# Security — SOPHIA website

Map: [README.md](README.md). Rules: [WORKING_RULES.md](WORKING_RULES.md). **This file holds names and places of secrets, never their values.**

## Principles

- Publish as little as possible: the site is public files only; everything else is excluded (`.assetsignore`, proved by `tests/publish.test.js` and `tests/smoke.js`).
- Strict browser policy: scripts and styles only from our own files ([ARCHITECTURE.md](ARCHITECTURE.md) section 8). No inline code.
- Store nothing about visitors ([DATABASE.md](DATABASE.md)).
- No secret in the repository, in a message or in a document. Secrets live in the places listed below.

## Credentials register

| Name | What it unlocks | Where the value lives | If it leaks |
|------|-----------------|-----------------------|-------------|
| `CLOUDFLARE_API_TOKEN` | Deploying and changing Workers in the owner's Cloudflare account. Scope: **not recorded — owner to confirm** | GitHub repository secret (repository → Settings → Secrets and variables → Actions). The token itself was created in the Cloudflare dashboard (My Profile → API Tokens) and is shown only once | See the playbook below |
| `CLOUDFLARE_ACCOUNT_ID` | Names which Cloudflare account the deploy goes to. Not a password; kept private | Same GitHub repository secret list | Nothing to revoke; rotate the token if the token leaked too |
| *(planned)* delivery key for the contact form | Sending messages to the inbox | A Worker secret set with `wrangler secret put`, and a local `.dev.vars` file that git ignores | Revoke at the provider, create a new key, set it again |

Accounts: GitHub organisation `ComputevoLimited` and the Cloudflare account. **Two-step verification status: not recorded — owner to confirm.**

Local secret files: none today. `.env` and `.dev.vars` are git-ignored and excluded from publishing in case they are created.

## How to set or change a secret

- **GitHub secret:** repository → Settings → Secrets and variables → Actions → update the named secret. The next push to `stg` uses it.
- **Worker secret (planned):** `npx wrangler secret put NAME` for the Worker `sophia-website-stg`; paste the value when asked (never put it in a command line, a file or this folder).

## Leak playbook

- **Cloudflare token leaked** (pasted in a chat, a commit, a screenshot): 1) revoke it in the Cloudflare dashboard (My Profile → API Tokens) straight away; 2) create a new token with the same scope; 3) update `CLOUDFLARE_API_TOKEN` in GitHub; 4) re-run the latest "Deploy Staging" run; 5) if it was committed, tell the owner — git history keeps it, so revoking is what protects the account; 6) note the date in [RELEASES.md](RELEASES.md).
- **Account ID shown:** no action alone.
- **Delivery key (planned) leaked:** revoke at the provider, create a new one, set the Worker secret again, check the provider's log for misuse.

## Public exposure today

| Thing | State |
|-------|-------|
| Review site | **Public.** A password gate was offered and declined "for now". Whether to hide it from search engines: **not recorded — owner to confirm** |
| Worker source `src/worker.js` | Was served publicly on the review site (no secrets in it, only the header rules) until `src/` was added to `.assetsignore` on 2026-11-25. The fix is live only after the next deploy; confirm with `node tests/smoke.js <address>` |
| `docs/`, `tests/`, `CLAUDE.md` | Excluded from the start; confirm with the smoke check |
| Security headers | Set by the Worker on every response: content security policy, frame, content-type, referrer, permissions, HSTS, opener and resource policies |
| Visitors' details | Not stored. The planned endpoint must follow the rules in [API.md](API.md) |

## Who can do what

| Who | Can |
|-----|-----|
| Anyone | Read the public page; (once connected) send a contact message |
| People with write access to the GitHub repository | Push to `dev` and `stg`, so deploy the review site |
| The Cloudflare account owner | Change or remove the Worker, tokens, domains |

The list of people with GitHub write access: **not recorded — owner to confirm.**

## Owner to-do

- [ ] Turn on two-step verification for GitHub and Cloudflare, and record "done" here.
- [ ] Record the scope of `CLOUDFLARE_API_TOKEN` (what it may do) in the register above. Not the value.
- [ ] Choose the delivery method and inbox for the contact form ([manual/contact-form.md](manual/contact-form.md)).
- [ ] Decide whether the review site is hidden from search engines or put behind a password.
- [ ] Decide the privacy notice before real launch (the form collects names and emails).
- [ ] Decide whether to host the fonts ourselves instead of loading them from Google (Google receives visitors' addresses).

## Checklist for every change

1. No secret, key, token or personal data added anywhere (`node tests/run.js` scans for the usual shapes).
2. Nothing new is published by accident (`tests/publish.test.js`); new private folders go into `.assetsignore`.
3. No inline styles, scripts or handlers; no new outside address.
4. If a new endpoint or secret appears: update [API.md](API.md), the register above and the code map.
5. After deploy: `node tests/smoke.js <address>`.
