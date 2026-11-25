'use strict';
/*
 * Nothing private may be published. The site is served by a Cloudflare Worker that uploads the WHOLE project folder as
 * static files, minus what .assetsignore lists (wrangler.jsonc: assets.directory is "."). So anything not listed there is
 * public. This test reads .assetsignore and works out which project files would be served:
 *   - docs, tests, source, config, workflows and the root CLAUDE.md must be excluded;
 *   - the only things served are the page, the tab icon, css/, js/ and assets/ (an allow-list: a new file fails until we decide);
 *   - the Worker still runs first on every request (so the security headers always apply) and sends the headers.
 * It cannot see the live site: tests/smoke.js <address> does that after a deploy.
 */
const fs = require('fs');
const path = require('path');
const h = require('./lite-harness');

const t = h.checker('publish');
const ROOT = h.ROOT;
const read = function (rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); };

// --- .assetsignore: simple rules only (a name, or "name/" for a folder), matched on any path segment
const rules = read('.assetsignore').split(/\r?\n/).map(function (l) { return l.trim(); }).filter(function (l) { return l && l[0] !== '#'; });
function isIgnored(rel) {
  const parts = rel.split('/');
  return rules.some(function (rule) {
    const name = rule.replace(/\/$/, '');
    const segments = rule.slice(-1) === '/' ? parts.slice(0, -1) : parts;   // "folder/" only matches folders
    return segments.indexOf(name) !== -1;
  });
}

// 1. the private things are excluded
['docs/', 'tests/', 'src/', 'CLAUDE.md', '.github/', 'wrangler.jsonc', 'package.json', '.assetsignore', '.git/', 'node_modules/', '.dev.vars', '.env'].forEach(function (rule) {
  t.check('.assetsignore lists ' + rule, rules.indexOf(rule) !== -1);
});
['docs/README.md', 'docs/manual/code-map.md', 'CLAUDE.md', 'src/worker.js', 'tests/run.js', '.github/workflows/deploy-stg.yml', 'wrangler.jsonc', 'package.json'].forEach(function (rel) {
  t.check(rel + ' is not published', isIgnored(rel));
});

// 2. the public things are not excluded by mistake
['index.html', 'favicon.ico', 'css/styles.css', 'js/main.js', 'assets/logo-mark.png'].forEach(function (rel) {
  t.check(rel + ' is published', !isIgnored(rel));
});

// 3. allow-list: every file that WOULD be served is one we expect
const SERVED = /^(index\.html|favicon\.ico|css\/[\w.-]+\.css|js\/[\w.-]+\.js|assets\/[\w.-]+\.(png|svg|ico|webp|jpg|jpeg))$/;
const SKIP = { '.git': 1, node_modules: 1 };
const served = [];
(function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    if (SKIP[e.name]) return;
    const full = path.join(dir, e.name);
    const rel = path.relative(ROOT, full).split(path.sep).join('/');
    if (e.isDirectory()) { walk(full); return; }
    if (!isIgnored(rel)) served.push(rel);
  });
})(ROOT);
served.forEach(function (rel) { t.check(rel + ' is on the list of files we mean to publish', SERVED.test(rel), rel); });
t.check('the site publishes its page, styles, script and images (' + served.length + ' files)', served.indexOf('index.html') !== -1 && served.length > 5, served.length);

// 4. the Worker runs first on every request, and sends the security headers
const wrangler = JSON.parse(read('wrangler.jsonc').replace(/^\s*\/\/.*$/gm, ''));
t.check('wrangler.jsonc: the Worker runs before the static files (so headers always apply)', wrangler.assets && wrangler.assets.run_worker_first === true);
t.check('wrangler.jsonc: the static files come from the project folder', wrangler.assets && wrangler.assets.directory === '.');
t.check('wrangler.jsonc: the Worker is the staging one', /^sophia-website/.test(wrangler.name), wrangler.name);
const worker = read('src/worker.js');
['X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security', 'Content-Security-Policy'].forEach(function (name) {
  t.check('src/worker.js sets ' + name, worker.indexOf("'" + name + "'") !== -1);
});
t.check("the Content-Security-Policy has no 'unsafe-inline'", worker.indexOf('unsafe-inline') === -1);
t.check("the Content-Security-Policy keeps script-src 'self'", worker.indexOf("script-src 'self'") !== -1);

process.exit(t.done() ? 0 : 1);
