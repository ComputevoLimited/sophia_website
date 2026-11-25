# API — SOPHIA website

Map: [README.md](README.md). Rules: [WORKING_RULES.md](WORKING_RULES.md).

## Today: there is no API

The site has **no server endpoints**. The Worker only serves files ([ARCHITECTURE.md](ARCHITECTURE.md)). Asking the live site for `/api/contact` answers 404.

## Planned: `POST /api/contact` (the contact form's server side)

Not built. The form on the page already sends this request, so the endpoint must match it. Background and open decisions: [manual/contact-form.md](manual/contact-form.md).

**Request** — `Content-Type: application/json`, same origin only (no cross-site use):

| Field | Required | Rules |
|-------|----------|-------|
| `name` | yes | text, at most 120 characters |
| `email` | yes | a valid email address, at most 200 characters |
| `organisation` | no | text, at most 160 characters |
| `topic` | no | one of: General enquiry, Membership, Collaboration, Partnership |
| `message` | yes | at least 10 and at most 4000 characters |
| `consent` | yes | present (the visitor ticked the box) |
| `website` | no | **must be empty.** A spam trap: people never see it. If it is filled in, treat the request as spam: answer 200 and send nothing |

**Responses** the page understands:

| Status | Meaning | What the visitor sees |
|--------|---------|-----------------------|
| 200 | Accepted and handed to the inbox | "Thank you. Your message has been sent…" |
| 400 | A field is missing or invalid | "Sorry, your message could not be sent…" |
| 404, 405, 501 | The endpoint does not exist yet | "This form is not connected to an inbox yet, so your message was not sent." |
| anything else (429, 5xx) | Failure | "Sorry, your message could not be sent…" |

**Rules for the build** (so it stays safe):

- Answer 200 **only** when the message really was handed to the inbox. Never "thank you" for a message that was dropped.
- Check every rule above on the server; the page's checks are for convenience only.
- Reject requests that do not come from our own site (check `Origin`), and limit how often one visitor can send (rate limit).
- Never put the inbox address or any key in the page or in the repository: keep it as a Worker secret ([SECURITY.md](SECURITY.md)).
- Do not log message text or email addresses.
- The security policy already allows the call (`connect-src 'self'`); `form-action 'none'` stays, because the form is sent by script, not by the browser.

## How to add or change an endpoint (checklist)

1. Write the route in `src/worker.js` **before** the line that passes the request to the static files.
2. Keep its answers short and in the table above; list any new one here.
3. Add tests that use fakes (never real email); add the route to the code map ([manual/code-map.md](manual/code-map.md)).
4. Update [SECURITY.md](SECURITY.md) (new secret? new data kept?) and [DATABASE.md](DATABASE.md) if anything is stored.
5. Check on the review site with `node tests/smoke.js <address>`, then tell the owner what was checked.
