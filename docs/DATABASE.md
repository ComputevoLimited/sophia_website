# Database — SOPHIA website

Map: [README.md](README.md). Rules: [WORKING_RULES.md](WORKING_RULES.md).

## There is no database

The site stores **nothing**:

- No server database, no key-value store, no files written by the Worker.
- No cookies, no `localStorage` or `sessionStorage` in the page or script.
- The contact form sends a message **onward** (planned) and keeps no copy. Today it sends nothing at all ([manual/contact-form.md](manual/contact-form.md)).
- All content is in `index.html`; there is nothing to back up except the git history on GitHub (organisation `ComputevoLimited`, repository `sophia_website`).

## Personal data

Visitors' names, emails and messages exist only in the browser until the planned endpoint passes them to the association's inbox. They are not stored by the site. Once messages are delivered, the inbox becomes the place where personal data lives, and the association is responsible for it: **retention rules and the privacy notice are not recorded — owner to confirm** ([SECURITY.md](SECURITY.md), owner to-do).

## Gaps and risks

| Gap | Risk |
|-----|------|
| No copy of messages if the inbox delivery fails | A message could be lost without anyone knowing |
| No backup other than git | Fine for a static site; there is no data to lose |

## Proposal, only if it becomes necessary

If the association wants a record of messages, or to block repeat spammers, add **Cloudflare D1** (a small SQL database next to the Worker): one table `messages` (id, created time, topic, name, email, message, delivered yes/no), deleted after a retention period the owner chooses. Do not add it before the owner decides, because it makes the site hold personal data.
