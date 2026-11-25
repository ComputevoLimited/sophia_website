# Product requirements — SOPHIA website

Map: [README.md](README.md). Rules: [WORKING_RULES.md](WORKING_RULES.md).

## Product

- **Name:** SOPHIA website. **One sentence:** a one-page public website that explains what the association SOPHIA is, what it believes and what it will do, and lets people contact it.
- **Type / platform:** static informational website, works on phones, tablets and desktops. English only.
- **Address:** review site `https://sophia-website-stg.computevo-limited.workers.dev`. Real domain: **not recorded — owner to confirm** (none bought yet).
- **Owner:** the owner of this repository (GitHub organisation `ComputevoLimited`). Built and maintained by Computevo (the footer says "Powered & Designed by Computevo.io").
- **Association's formal details** (legal name, registration, address): **not recorded — owner to confirm**.

## Problem and goal

People need a clear, serious place that says what SOPHIA is for: to monitor, assess and promote understanding of the impacts of artificial intelligence on society and individuals, with reliable, evidence-based information. The site must also let interested people reach the association. The wording comes from the association (the owner supplied it); the site presents it.

## Users

| Who | What they need | Where |
|-----|----------------|-------|
| Visitors: researchers, educators, policymakers, civil society partners, the public | Understand the aim, the Principle of SOPHIA and the objectives; get in touch about membership, collaboration or partnership | The one page, mostly on phones and laptops |
| The association (content owner) | The wording and look they approved | Review link |
| The owner / Computevo (maintainer) | Easy, safe changes and releases | This repository |

## What it does today

| Feature | State |
|---------|-------|
| Header with menu and a small logo that appears after the big logo scrolls away | Live on the review site |
| Hero: big logo, one-line message, short text, two buttons, slowly turning "observation instrument" behind | Live |
| Our Aim (starts with what SOPHIA stands for, full name highlighted) | Live |
| Principle of SOPHIA (quote left, two paragraphs right) | Live |
| Objectives (four numbered items) | Live |
| Get Involved with a **contact form** | Form is live on the review site but **not connected to an inbox**: it says so when someone presses Send ([manual/contact-form.md](manual/contact-form.md)) |
| Footer: small eye, full name with the letters S-O-P-H-I-A highlighted, Computevo line | Live |
| Tab icon from the logo's eye, fade-in animations, reduced-motion support | Live |

## Non-goals (decided — do not add)

- No Greek version and no language switcher; no Greek-key decoration (removed on the owner's instruction).
- No logo redesign by us: the real logo supplied by the owner is used as it is.
- No sentence "Society for the Observation…" under the hero logo (it appears in Our Aim and the footer instead).
- Not requested, so do **not** add without asking: member login, shop or payments, blog or news, search, analytics, cookie banners.

## Ideas for later (not decided)

- A real domain for the site; a "production" environment ([manual/deployment.md](manual/deployment.md)).
- Delivery of contact messages to an inbox (the main open piece).
- Public contact details (address, email, social links): none are shown today.
- A privacy notice page before real launch (the form collects names and emails).
- Hiding the review link from the public or from search engines (a password gate was offered and declined "for now").

## Success measures

**Not recorded — owner to confirm.**

## Constraints

- **Technical:** no build step; strict security policy (no inline code, only the site's own files plus Google Fonts); Cloudflare Workers hosting ([ARCHITECTURE.md](ARCHITECTURE.md)).
- **Design:** one blue, ghost white, champagne gold; serious tone ([DESIGN.md](DESIGN.md)).
- **Legal:** **not recorded — owner to confirm.** The owner has linked the association to Cyprus (an EU country), so EU data-protection rules probably apply once the form delivers messages containing names and emails.
- **Calendar:** no launch date recorded — owner to confirm.

## Assumptions

- The text on the page is final unless the owner changes it.
- The review link is shared only with the association and clients.

## Open questions for the owner

1. Domain name, and when to go live?
2. Which inbox receives contact messages, and which delivery method ([manual/contact-form.md](manual/contact-form.md))?
3. Which public contact details (email, address, social links) should the site show?
4. Privacy notice and cookie position: who writes it, is it needed at launch?
5. Fonts are loaded from Google: keep, or host them ourselves?
6. Should the review link be hidden from search engines, or behind a password?
7. Where is the original logo file kept (the repo holds only web-sized copies)?
8. Who else may change the site, and who approves a go-live?

## Definition of done

A change is done when the tests pass, the owner has seen it, and the review link serves it: see [TESTING.md](TESTING.md) (release checklist).
