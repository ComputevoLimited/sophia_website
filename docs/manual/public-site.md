# The public page — SOPHIA website

Back to [MANUAL.md](../MANUAL.md) and [README.md](../README.md). Where each part lives in the code: [code-map.md](code-map.md). The look: [../DESIGN.md](../DESIGN.md).

## Wording rules

- The words on the page are the association's own, supplied by the owner. **Do not rephrase them.** The page text is now the only copy in this repository; where the owner keeps the original brief: **not recorded — owner to confirm**.
- Write the name as **SOPHIA** (capitals). English only.
- A change of wording needs no version bump (HTML is never cached) but needs the owner's approval like any change.

## The sections, top to bottom

| Section (`id`) | Content | Notes |
|----------------|---------|-------|
| Header (`site-header`) | Small logo (after scrolling), menu: About, Principle of SOPHIA, Objectives, Get Involved | Blue bar with a champagne line; on phones the menu folds into a button |
| Hero (`top`) | Big logo; line "Understanding what AI means for people and society" (the word AI marked); short text starting "SOPHIA monitors, assesses, and promotes understanding…"; buttons "Get Involved" and "Learn More" | The turning instrument sits behind |
| Our Aim (`about`) | Label "Our Aim", title "Evidence-based understanding of AI's impact", then a paragraph that **starts "SOPHIA stands for …"** with the full name marked | The marked name is `.aim-name` |
| Principle of SOPHIA (`principle`) | Label, quote "SOPHIA is rooted in truth, experience, deep understanding, and sound judgment." (the word SOPHIA in gold), two paragraphs beside it | Blue band |
| Objectives (`objectives`) | Title "To achieve its aim, the Association shall" and four numbered objectives | The title column stays in view on wide screens |
| Get Involved (`get-involved`) | Label, heading "Join the conversation on AI and society", the paragraph "Researchers, educators, policymakers, and civil society partners are welcome to reach out…" **directly under the heading**, then the contact form | Beige band; form: [contact-form.md](contact-form.md) |
| Footer | Small eye, the full name with S, O, P, H, I, A highlighted, "Powered & Designed by Computevo.io \| All rights reserved \| © 2026" | "Computevo.io" is plain text, not a link (not decided) |

## Behaviours (all in `js/main.js` and `css/styles.css`)

- **Fade-in:** items with the class `reveal` fade up when 12% visible. They are hidden **only** after the script has started (the page then has the class `js`), so without JavaScript everything is visible. Items already scrolled past (a jump to a section) are revealed too. The hero also fades in when the page loads.
- **Header logo:** shown only when the big hero logo is out of view (class `show-brand` on the header). On the first screen only the big logo shows.
- **Menu button:** toggles the class `open` on the header and the `aria-expanded` state; choosing a link closes it.
- **Instrument:** an inline SVG in `.hero-art`, marked `aria-hidden`: ticked rings that turn very slowly (300 s, 220 s, 150 s per turn) and a champagne dot. On phones it is larger and a little fainter. It must stay quiet decoration; faster or busier versions were rejected.
- **Highlights:** `.hl` draws a champagne stripe behind a word on light backgrounds; `.accent` colours a word gold on the blue band; `.aim-name` is semi-bold with the stripe, and the stripe follows the text across line breaks.
- **Reduced motion:** all animation and transitions are switched off when the visitor asks for less motion.
- **Anchors:** links jump under the header (`scroll-margin-top`), so a section's top is not hidden.

## Things that look like bugs but are decisions

- On a first load in the preview pane the sections look half faded: that is the fade-in caught mid-way ([../WORKING_RULES.md](../WORKING_RULES.md) section 7).
- The header has no logo at the very top: the big logo is right below it.
- The footer has no wordmark logo, only the small eye: the owner asked for that.
