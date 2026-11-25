# Branding and image files — SOPHIA website

Back to [MANUAL.md](../MANUAL.md) and [README.md](../README.md). The look: [../DESIGN.md](../DESIGN.md).

## The files

| File | What it is | Used for |
|------|-----------|----------|
| `assets/logo-mark.png` | The SOPHIA logo (eye with brain, circuit lines, the lettering) cut out of its grey background, **original colours**, 1280 px wide, without the society-name line under it | Big logo in the hero |
| `assets/logo-mark-light-sm.png` | Same logo, **light version** (blue lettering turned ghost white, gold kept), 320 px wide | Small logo in the blue header |
| `assets/logo-eye-light.png` | Only the eye, light version, 96 px wide | Beside the name in the footer |
| `favicon.ico`, `assets/favicon-32.png`, `assets/favicon-192.png` | The logo's eye on a light rounded tile | Browser tab icon |
| `assets/apple-touch-icon.png` | Same, square without rounded corners, 180 px | Home-screen icon on Apple devices |

## How they were made (and what is not kept)

- The starting point was the full logo the owner supplied: a picture with a light-grey background and a thin frame (1661 × 724 px). The background was removed with proper edge transparency (no grey halo), so the brain, drawn in the background colour, now shows the page colour through it.
- The **mark** is the eye and SOPHIA only; the line "Society for the Observation of…" was left out on purpose (it is in the text of the page).
- The **light versions** recolour only: blue to ghost white, the gold stays, the gold-to-blue fade becomes gold-to-white. The shapes are unchanged. They are for **dark backgrounds only** and were approved by the owner.
- The **icons** are the eye cut out of the logo and set on a light tile so they read on light and dark browser tabs.
- The work was done with Python (Pillow, NumPy, SciPy, OpenCV). **The scripts and the original logo file are not kept in this repository.** Where the owner keeps the original logo: **not recorded — owner to confirm.** The best copy in the repo is `assets/logo-mark.png`; light versions can be remade from it by the same colour mapping. If more variants will be needed, ask the owner for the original and save the script in a `tools/` folder (and add `tools/` to `.assetsignore`).

## Rules

- **Do not edit, recolour, crop or "improve" the owner's logo or images unless asked.** The derived files above are the approved exceptions.
- Use the light versions only on the blue; use the original-colour logo on light backgrounds.
- **A changed image gets a new file name** (the browser caches images for a year). Put images in `assets/`; update the page and the code map; run `node tests/run.js` (it checks the files named in the page exist and that nothing unexpected would be published).
- Every image has an `alt`. Decorative ones use `alt=""`; the logos say "SOPHIA".
- Keep files small: the hero logo (about 126 KB) is the largest.
- Only the file types the publish test allows (`png`, `svg`, `ico`, `webp`, `jpg`) may be added to `assets/`.
