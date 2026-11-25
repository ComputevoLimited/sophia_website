'use strict';
/*
 * Proves the tests can FAIL. Breaks the real project on purpose, one thing at a time, runs the test that should notice,
 * and restores every file afterwards (even if something goes wrong).   node tests/mutation-check.js
 * Run on demand, not as part of `node tests/run.js`. Every line below must say "caught".
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const abs = function (rel) { return path.join(ROOT, rel); };

const MUTATIONS = [
  { what: 'docs/ made public (removed from .assetsignore)', test: 'publish.test.js', file: '.assetsignore', change: function (s) { return s.replace(/^docs\/\r?\n/m, ''); } },
  { what: 'a private source folder made public (src/ removed from .assetsignore)', test: 'publish.test.js', file: '.assetsignore', change: function (s) { return s.replace(/^src\/\r?\n/m, ''); } },
  { what: 'the Worker no longer runs first (run_worker_first false)', test: 'publish.test.js', file: 'wrangler.jsonc', change: function (s) { return s.replace('"run_worker_first": true', '"run_worker_first": false'); } },
  { what: "an unsafe-inline policy in the Worker", test: 'publish.test.js', file: 'src/worker.js', change: function (s) { return s.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'"); } },
  { what: 'an inline style added to the page', test: 'site.test.js', file: 'index.html', change: function (s) { return s.replace('<main id="main">', '<main id="main" style="color:red">'); } },
  { what: 'a new, unagreed colour in the stylesheet', test: 'site.test.js', file: 'css/styles.css', change: function (s) { return s + '\n.x { color: #ff0000; }\n'; } },
  { what: 'a second blue in the stylesheet', test: 'site.test.js', file: 'css/styles.css', change: function (s) { return s + '\n.x { color: rgba(10, 74, 127, 1); }\n'; } },
  { what: 'the footer loses one highlighted letter', test: 'site.test.js', file: 'index.html', change: function (s) { return s.replace('<span class="initial">H</span>', 'H'); } },
  { what: 'an image without alt text', test: 'site.test.js', file: 'index.html', change: function (s) { return s.replace('alt="SOPHIA"', ''); } },
  { what: 'a form label that points at nothing', test: 'site.test.js', file: 'index.html', change: function (s) { return s.replace('<label for="cf-name">', '<label for="cf-nope">'); } },
  { what: 'the page uses browser storage', test: 'site.test.js', file: 'js/main.js', change: function (s) { return s + "\nlocalStorage.setItem('x', 'y');\n"; } },
  { what: 'a secret written into a document', test: 'secrets.test.js', create: 'docs/zz-mutation.md', content: 'CLOUDFLARE_ACCOUNT_ID = abcdef1234567890abcdef\n' },   // a fake value, written only while the check runs
  { what: 'a broken link in the docs', test: 'docs.test.js', file: 'docs/README.md', change: function (s) { return s.replace('(PRD.md)', '(PRD-missing.md)'); } },
  { what: 'the code map names a function that does not exist', test: 'docs.test.js', file: 'docs/manual/code-map.md', change: function (s) { return s + '\nSee `doesNotExistAnywhere()`.\n'; } },
  { what: 'a document grows past its size limit', test: 'docs.test.js', file: 'docs/DESIGN.md', change: function (s) { return s + '\n' + 'x'.repeat(40 * 1024) + '\n'; } },
];

const saved = {};
const created = [];
function restore() {
  Object.keys(saved).forEach(function (rel) { fs.writeFileSync(abs(rel), saved[rel]); delete saved[rel]; });
  created.splice(0).forEach(function (rel) { if (fs.existsSync(abs(rel))) fs.unlinkSync(abs(rel)); });
}
process.on('exit', restore);
process.on('SIGINT', function () { restore(); process.exit(130); });

let missed = 0;
MUTATIONS.forEach(function (m) {
  try {
    if (m.create) { fs.writeFileSync(abs(m.create), m.content); created.push(m.create); }
    else {
      const original = fs.readFileSync(abs(m.file), 'utf8');
      const changed = m.change(original);
      if (changed === original) { console.log('  MISSED (the break did not change the file) ' + m.what); missed++; return; }
      saved[m.file] = original;
      fs.writeFileSync(abs(m.file), changed);
    }
    const r = spawnSync(process.execPath, [path.join(__dirname, m.test)], { encoding: 'utf8' });
    if (r.status !== 0) console.log('  caught  ' + m.what + '   (by ' + m.test + ')');
    else { console.log('  MISSED  ' + m.what + '   (' + m.test + ' still passed)'); missed++; }
  } finally {
    restore();
  }
});

// everything must be back to normal
const after = spawnSync(process.execPath, [path.join(__dirname, 'run.js')], { encoding: 'utf8' });
console.log('\n' + (missed ? missed + ' break(s) were NOT noticed' : 'every break was noticed') + '; after restoring, the normal test run ' + (after.status === 0 ? 'passes' : 'FAILS — check git status'));
process.exit(missed || after.status !== 0 ? 1 : 0);
