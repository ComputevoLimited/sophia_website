# Design — SOPHIA website

Map: [README.md](README.md). Rules: [WORKING_RULES.md](WORKING_RULES.md). The look lives in `css/styles.css`; its first lines (the `:root` variables) are the **source of truth** for colours and fonts.

## The look in a sentence

Calm, serious and light: ghost-white pages, **one blue** for text and bands, champagne gold as the only accent, the association's own logo as the centrepiece, a slowly turning measuring instrument as quiet decoration.

## Colours (one blue, no others)

| Variable | Value | Used for |
|----------|-------|----------|
| `--blue` | `#093f6d` | All text, headings, menu bar, buttons, labels, the Principle band, the footer, thin lines. A step darker than the logo's own blue `#0a4a7f` (the owner asked for that) |
| `--white` | `#fefffa` | Page background, text on blue |
| `--gold` | `#dfc590` (champagne gold) | Small labels, number squares, button fill, highlighter stripes, the line under the header, the highlighted letters in the footer |
| `--beige` | `#eadab5` | One calm band: Get Involved |
| `--on-dark-muted` | `#d3dfeb` | Paragraph text on the blue band |
| `--error` | `#8a1c1c` | Form errors only |

`tests/site.test.js` fails if the stylesheet uses a colour outside this list. Contrast: blue on white and white on blue about 10.8:1, blue on champagne about 6.5:1 (all above the AA minimum of 4.5:1).

## Type

- **Manrope** (sans) for body, menu, buttons and labels; **Source Serif 4** (serif, plus italic) for headings, the aim paragraph and the quote. Both from Google Fonts; weights are limited to what the font link requests (see `index.html`).
- Body 17 px, large lead text up to 1.6 rem, the quote up to 3.6 rem.

## Decisions the owner made — do not undo

- **One blue.** Navy plus a lighter blue looked like "different blues" and was rejected; the near-black navy `#092742` was "too dark" on buttons.
- **No neon green**, no terracotta/olive/teal palettes, nothing that "looks like a bank". Champagne gold, not the stronger logo gold.
- **The real logo** is used as supplied (cut out, unchanged shape and colours). Light (reversed) versions exist only for dark backgrounds, with the owner's approval ([manual/branding-and-assets.md](manual/branding-and-assets.md)).
- **Header:** a blue bar with white menu and a champagne line, because a white header blended into the page below. The small logo shows in it only after the big hero logo has scrolled away; **never two logos at once**.
- **Hero:** the big logo, the line "Understanding what AI means for people and society", a short text, two buttons, and the original "observation instrument" behind (rings, ticks, a champagne dot). The head drawing, the gear dial, a radar sweep and a list of other options were tried and rejected. The sentence "Society for the Observation…" is **not** under the logo.
- **Our Aim** starts "SOPHIA stands for …" with the full name semi-bold and marked with a champagne stripe.
- **Principle of SOPHIA:** "Wisdom" is replaced by SOPHIA everywhere (menu, label, quote, paragraph). Quote and label on the left, the two paragraphs stacked on the right.
- **Footer:** blue; small light eye beside the full name; the six letters that spell S-O-P-H-I-A in bold champagne; no wordmark logo; the Computevo line on the right.
- **Labels and number squares** are champagne with a thin blue outline (so they read on white).
- **Get Involved:** beige band; paragraph under the heading; the contact form in a white card.
- English only; no Greek decoration; the owner's wording is kept.

## Layout rules

- Content width 1200 px; sections have generous space; below 960 px two-column layouts stack; below 900 px the menu folds into a button (blue panel, white links, champagne line); below 720 px the phone rules apply.
- Fade-in on scroll and a hero entrance; `prefers-reduced-motion` switches all of it off.
- Every interactive element has a visible focus ring (blue; champagne on blue).

## Before showing the owner

1. Look at desktop (about 1440), tablet (about 820) and phone (375) widths; no sideways scrolling.
2. The console is free of errors (a failed test message to the local server is expected).
3. Only the agreed colours; one blue; text readable; header and footer correct.
4. Say what was and was not looked at.
