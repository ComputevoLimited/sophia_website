# Contact form — SOPHIA website

Back to [MANUAL.md](../MANUAL.md) and [README.md](../README.md). The server side it needs: [../API.md](../API.md). Code: [code-map.md](code-map.md).

## State in one line

**The form is on the page and works as a form, but nothing receives its messages yet.** On the review site, pressing Send says: "This form is not connected to an inbox yet, so your message was not sent." That is deliberate and honest.

## What the visitor sees

White card in the Get Involved band. Fields: Full name\*, Email\*, Organisation, Topic (General enquiry, Membership, Collaboration, Partnership), Message\*, a tick box "I agree that SOPHIA may use these details to reply to my message."\*, and "Send message".

- Checks happen in the page (`validate()` and `setError()` in `js/main.js`): name required; email valid; message at least 10 characters; the tick required. Each problem shows a short red line under the field and the cursor goes to the first one.
- A hidden field named `website` is a **spam trap**. People never see it; simple bots fill it in. If it is filled the page pretends to succeed and sends nothing.
- The button is disabled while sending. On success the form clears and shows "Thank you. Your message has been sent and we will reply as soon as we can."
- On failure what the visitor typed is kept.

| Server answer | The page says |
|---------------|---------------|
| 200 | Thank you |
| 404, 405, 501 (no endpoint) | "This form is not connected to an inbox yet, so your message was not sent." |
| anything else | "Sorry, your message could not be sent. Please try again in a moment." |

The page sends `POST /api/contact` as JSON; fields and rules are in [../API.md](../API.md).

## What is missing

The endpoint, an inbox, a delivery method, a privacy notice. Until then **never** change the page to say a message was sent when it was not.

## Delivery options (the owner's decision — pending)

| Option | How it works | For | Against | Needs |
|--------|--------------|-----|---------|-------|
| **A. Cloudflare email (recommended)** | The Worker sends each message with Cloudflare's email feature | Details never leave Cloudflare (the host already); no new company | Needs a domain set up in Cloudflare with email routing, and the inbox verified | A domain on the owner's Cloudflare (an existing one for now, SOPHIA's later) and the inbox address |
| B. Form service (such as Web3Forms or Formspree) | The page or Worker passes messages to the service, which emails them | Works today, no domain | Visitors' details pass through another company; the security policy must allow it | A free account using the inbox address, and its key |
| C. Email service API (such as Resend) | The Worker calls the service with a secret key | Flexible, good delivery | Needs an account and, to send to anyone, a verified domain; a key to protect | Account, domain, key |
| D. Leave unconnected | As today | No risk | The form cannot be used | Nothing |

**Decision: not recorded — owner to confirm.** Also needed whichever is chosen: the receiving inbox address (kept as a Worker secret, never in the repository).

## How to connect it (when decided)

1. Follow the checklist and rules in [../API.md](../API.md) ("Rules for the build" and "How to add or change an endpoint").
2. Put the route in `src/worker.js`; keep secrets as Worker secrets ([../SECURITY.md](../SECURITY.md)).
3. Test with fakes; never send a real message from a test.
4. On the review site, send **one** test message from a real browser with the owner's knowledge, and check it arrives.
5. Update this file, the API file, the code map and [../RELEASES.md](../RELEASES.md).

## Privacy

The consent tick is the minimum. The form must not store messages (see [../DATABASE.md](../DATABASE.md)). A privacy notice is an open question for the owner ([../PRD.md](../PRD.md)).
