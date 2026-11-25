'use strict';
/*
 * Read-only check of a DEPLOYED site (it only asks for pages; it never sends data, never fills the form).
 *   node tests/smoke.js https://sophia-website-stg.computevo-limited.workers.dev
 * Checks: the public pages answer; the private addresses are "not found" (the docs, tests, source, config); the security
 * headers are present; the served stylesheet and script are identical to the ones in this project.
 * Not part of `node tests/run.js` (it needs the network and a deploy). Run it after every deploy.
 */
const fs = require('fs');
const path = require('path');

const base = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https?:\/\//.test(base)) { console.log('Usage: node tests/smoke.js <site address>'); process.exit(2); }
const ROOT = path.resolve(__dirname, '..');
let fail = 0;
function check(what, ok, extra) { if (!ok) { fail++; console.log('  FAIL ' + what + (extra !== undefined ? '  -> ' + extra : '')); } else console.log('  ok   ' + what); }
async function get(p) { return fetch(base + p, { redirect: 'manual' }); }
const norm = function (s) { return s.replace(/\r\n/g, '\n'); };

(async function () {
  // public pages
  const home = await get('/');
  check('/ answers 200', home.status === 200, home.status);
  const homeText = await home.text();
  check('/ is the SOPHIA page', /<title>SOPHIA/.test(homeText));
  for (const p of ['/css/styles.css', '/js/main.js', '/favicon.ico', '/assets/logo-mark.png', '/assets/logo-mark-light-sm.png', '/assets/logo-eye-light.png', '/assets/favicon-32.png']) {
    const r = await get(p); check(p + ' answers 200', r.status === 200, r.status);
  }

  // private addresses must NOT be served
  for (const p of ['/docs/README.md', '/docs/WORKING_RULES.md', '/docs/manual/code-map.md', '/CLAUDE.md', '/tests/run.js', '/tests/smoke.js', '/src/worker.js', '/package.json', '/wrangler.jsonc', '/.assetsignore', '/.gitignore', '/.github/workflows/deploy-stg.yml']) {
    const r = await get(p); check(p + ' is not published (' + r.status + ')', r.status === 404, r.status);
  }

  // security headers on the page
  ['content-security-policy', 'x-frame-options', 'x-content-type-options', 'strict-transport-security', 'referrer-policy', 'permissions-policy'].forEach(function (name) {
    check('header ' + name + ' is present', !!home.headers.get(name));
  });
  check("the policy has no 'unsafe-inline'", (home.headers.get('content-security-policy') || '').indexOf('unsafe-inline') === -1);

  // the served files are the project's own
  for (const p of ['css/styles.css', 'js/main.js']) {
    const live = norm(await (await get('/' + p)).text());
    const local = norm(fs.readFileSync(path.join(ROOT, p), 'utf8'));
    check('/' + p + ' is identical to the project file', live === local);
  }
  check('/ names the same stylesheet and script versions as index.html', (function () {
    const v = function (s, re) { return (s.match(re) || [])[1]; };
    const local = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    return v(homeText, /styles\.css\?v=(\d+)/) === v(local, /styles\.css\?v=(\d+)/) && v(homeText, /main\.js\?v=(\d+)/) === v(local, /main\.js\?v=(\d+)/);
  })());

  console.log('\n' + (fail ? 'FAILED: ' + fail + ' check(s)' : 'smoke check passed') + '  (' + base + ')');
  process.exit(fail ? 1 : 0);
})().catch(function (e) { console.log('Could not reach ' + base + ': ' + e.message); process.exit(2); });
