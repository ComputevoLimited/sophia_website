'use strict';
/*
 * The page rules we have agreed, checked on the real files (no browser needed):
 *   - the strict security policy: no inline styles, no inline scripts, nothing loaded from other sites except the two font hosts;
 *   - every local file the page names exists; the page's links point at real sections; images have alt text;
 *   - one blue only: the stylesheet uses just the agreed colours (a new colour fails until the owner agrees);
 *   - the contact form: labels match fields, every required field has its error line, it posts to /api/contact;
 *   - the footer name highlights the six letters that spell SOPHIA; the script is valid.
 * It does not look at the page (spacing, colours on screen): that is checked by eye in the local preview.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const h = require('./lite-harness');

const t = h.checker('site');
const ROOT = h.ROOT;
const read = function (rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); };
const html = read('index.html');
const css = read('css/styles.css');
const js = read('js/main.js');

// 1. security policy friendly page
t.check('no inline style="" attributes', !/\sstyle\s*=/i.test(html));
t.check('no <style> blocks', !/<style[\s>]/i.test(html));
t.check('no inline <script> code (every script has a src)', (html.match(/<script\b[^>]*>/gi) || []).every(function (s) { return /\ssrc=/.test(s); }));
t.check('no inline event handlers (onclick=...)', !/\son[a-z]+\s*=/i.test(html));
(html.match(/(?:href|src)="(https?:[^"]+)"/g) || []).forEach(function (m) {
  const url = m.replace(/^(?:href|src)="/, '').replace(/"$/, '');
  t.check('outside address is only a font host: ' + url.slice(0, 50), /^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(url) || /^https:\/\/fonts\./.test(url), url);
});

// 2. local files and links
(html.match(/(?:href|src)="([^"#:]+)"/g) || []).forEach(function (m) {
  const rel = m.replace(/^(?:href|src)="/, '').replace(/"$/, '').split('?')[0];
  if (/^(mailto|tel):/.test(rel)) return;
  t.check('the page names ' + rel + ' and it exists', fs.existsSync(path.join(ROOT, rel)), rel);
});
const ids = {};
(html.match(/\sid="([^"]+)"/g) || []).forEach(function (m) { ids[m.replace(/^\sid="/, '').replace(/"$/, '')] = true; });
(html.match(/href="#([^"]+)"/g) || []).forEach(function (m) {
  const id = m.replace(/^href="#/, '').replace(/"$/, '');
  t.check('the link #' + id + ' points at a real section', !!ids[id], id);
});
(html.match(/<img\b[^>]*>/gi) || []).forEach(function (img) { t.check('image has an alt attribute: ' + (img.match(/src="([^"]+)"/) || [])[1], /\balt=/.test(img)); });
t.check('exactly one <h1>', (html.match(/<h1[\s>]/g) || []).length === 1);
t.check('the stylesheet and script carry a version (?v=N), because the browser caches them for a year', /css\/styles\.css\?v=\d+/.test(html) && /js\/main\.js\?v=\d+/.test(html));

// 3. one blue only
const ALLOWED_HEX = { '#093f6d': 'the blue', '#fefffa': 'ghost white', '#dfc590': 'champagne gold', '#eadab5': 'beige band', '#d3dfeb': 'text on blue', '#8a1c1c': 'form errors', '#000': 'mask', '#fff': 'white' };
(css.match(/#[0-9a-fA-F]{3,8}\b/g) || []).forEach(function (hex) {
  t.check('colour ' + hex + ' is one of the agreed colours', !!ALLOWED_HEX[hex.toLowerCase()], hex);
});
(css.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g) || []).forEach(function (c) {
  const nums = c.replace(/rgba?\(/, '').split(',').map(function (n) { return n.trim(); }).join(',');
  t.check('colour rgb(' + nums + ') is the blue or ghost white', nums === '9,63,109' || nums === '254,255,250', nums);
});

// 4. contact form
const form = (html.match(/<form[\s\S]*?<\/form>/) || [''])[0];
t.check('the contact form exists and posts to /api/contact', /id="contact-form"/.test(form) && /action="\/api\/contact"/.test(form));
(form.match(/<label for="([^"]+)"/g) || []).forEach(function (m) {
  const id = m.replace('<label for="', '').replace('"', '');
  t.check('label for="' + id + '" has a field with that id', new RegExp('id="' + id + '"').test(form), id);
});
(form.match(/<(?:input|textarea)\b[^>]*\brequired\b[^>]*>/g) || []).forEach(function (field) {
  const id = (field.match(/id="([^"]+)"/) || [])[1];
  t.check('required field ' + id + ' has its error line ' + id + '-error', new RegExp('id="' + id + '-error"').test(form), id);
});
t.check('the script reads the form address from the form (fetch(contactForm.action ...))', /fetch\(contactForm\.action/.test(js));
t.check("the script tells visitors plainly when there is no mail endpoint yet (404/405/501)", /\[404, 405, 501\]/.test(js));

// 5. footer name highlights S-O-P-H-I-A
const footer = (html.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
const initials = (footer.match(/class="initial">([A-Z])</g) || []).map(function (m) { return m.slice(-2, -1); }).join('');
t.check('the footer highlights the six letters that spell SOPHIA', initials === 'SOPHIA', initials);
t.check('the footer text still reads "Society for the Observation of Public and Human Impacts of AI"', footer.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').indexOf('Society for the Observation of Public and Human Impacts of AI') !== -1);

// 6. the site keeps nothing about visitors (docs/DATABASE.md says so)
t.check('the script uses no cookies or browser storage', !/document\.cookie|localStorage|sessionStorage|indexedDB/.test(js));

// 7. the script is valid
const syntax = spawnSync(process.execPath, ['--check', path.join(ROOT, 'js', 'main.js')], { encoding: 'utf8' });
t.check('js/main.js is valid JavaScript', syntax.status === 0, syntax.stderr);

process.exit(t.done() ? 0 : 1);
