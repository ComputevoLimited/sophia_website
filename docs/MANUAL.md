# Manual — index of topic files

Map: [README.md](README.md). Rules: [WORKING_RULES.md](WORKING_RULES.md).

| Topic | File | What is in it |
|-------|------|---------------|
| Code map | [manual/code-map.md](manual/code-map.md) | Which section of which file holds each feature, and where to start for a typical task. **Open first for any code task** |
| Deployment | [manual/deployment.md](manual/deployment.md) | Environments, the exact release commands, what the GitHub Action and Cloudflare do, checks after a deploy, undoing a release, what a production go-live needs |
| The public page | [manual/public-site.md](manual/public-site.md) | Each section of the page, its wording rules, and the behaviours: fade-in, header logo, the turning instrument, highlights |
| Contact form | [manual/contact-form.md](manual/contact-form.md) | How the form works today, what is missing, the delivery options and the decision the owner still has to make |
| Branding and files | [manual/branding-and-assets.md](manual/branding-and-assets.md) | Every image file, how the derived ones were made, caching rules, what must not be altered |

## Finding things fast

- A word on the page → `grep -n "the words" index.html`.
- A colour or spacing → variables at the top of `css/styles.css`, then the section comment named in the code map.
- A behaviour → `js/main.js` (122 lines; sections in the code map).
- A header or caching rule → `src/worker.js` (one function, `addSecurityHeaders()`).
- A release question → [RELEASES.md](RELEASES.md) and [manual/deployment.md](manual/deployment.md).
