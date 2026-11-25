'use strict';
/*
 * The documents must stay easy to read in little time (that is what the standard structure is for):
 *   - the standard set of files exists and the root CLAUDE.md loads WORKING_RULES.md;
 *   - every relative link in docs/ and CLAUDE.md reaches a file that exists;
 *   - every file in docs/manual/ is listed in docs/MANUAL.md;
 *   - the part read at the start of every session stays small, other files stay small, release-log rows stay short;
 *   - if docs/manual/code-map.md exists: every function written like `name()` and every file path in back-ticks is real.
 * Adjust the limits below only with a reason; they are what keeps a new session cheap.
 */
const fs = require('fs');
const path = require('path');
const h = require('./lite-harness');

const t = h.checker('docs');
const ROOT = h.ROOT;
const DOCS = path.join(ROOT, 'docs');
const read = function (p) { return fs.readFileSync(p, 'utf8'); };
const sizeOf = function (p) { return fs.statSync(p).size; };
const kb = function (n) { return Math.round(n / 102.4) / 10; };

const LIMITS = { always: 12 * 1024, topic: 30 * 1024, file: 30 * 1024, releaseRow: 600 };

// 1. the standard set exists
['README.md', 'WORKING_RULES.md', 'PRD.md', 'ARCHITECTURE.md', 'API.md', 'DATABASE.md', 'SECURITY.md', 'TESTING.md', 'DESIGN.md', 'MANUAL.md', 'RELEASES.md', 'RELEASES_ARCHIVE.md'].forEach(function (f) {
  t.check('docs/' + f + ' exists', fs.existsSync(path.join(DOCS, f)));
});
t.check('the root CLAUDE.md exists and loads WORKING_RULES.md', fs.existsSync(path.join(ROOT, 'CLAUDE.md')) && /@docs\/WORKING_RULES\.md/.test(read(path.join(ROOT, 'CLAUDE.md'))));

// 2. every relative link works
function walk(dir, out) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out); else if (/\.md$/i.test(e.name)) out.push(full);
  });
  return out;
}
const mdFiles = walk(DOCS, []).concat(fs.existsSync(path.join(ROOT, 'CLAUDE.md')) ? [path.join(ROOT, 'CLAUDE.md')] : []);
let links = 0;
mdFiles.forEach(function (f) {
  const rel = path.relative(ROOT, f).split(path.sep).join('/');
  let inFence = false;
  read(f).split(/\r?\n/).forEach(function (line, i) {
    if (/^```/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    const re = /\[[^\]]*\]\(([^)\s]+)\)/g;
    let m;
    while ((m = re.exec(line))) {
      const target = m[1];
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      links++;
      const file = decodeURIComponent(target.split('#')[0]);
      t.check(rel + ':' + (i + 1) + ' link ' + target + ' reaches a file', file === '' || fs.existsSync(path.resolve(path.dirname(f), file)), target);
    }
  });
});
t.check('checked the links (' + links + ')', links > 5, links);

// 3. the manual index lists every topic file
if (fs.existsSync(path.join(DOCS, 'manual'))) {
  const index = read(path.join(DOCS, 'MANUAL.md'));
  fs.readdirSync(path.join(DOCS, 'manual')).filter(function (f) { return /\.md$/.test(f); }).forEach(function (f) {
    t.check('docs/manual/' + f + ' is listed in MANUAL.md', index.indexOf('manual/' + f) !== -1);
    const s = sizeOf(path.join(DOCS, 'manual', f));
    t.check('docs/manual/' + f + ' is at most ' + kb(LIMITS.topic) + ' KB — now ' + kb(s) + ' KB (split it by sub-topic if it grows)', s <= LIMITS.topic, s);
  });
}

// 4. size limits (about 3.6 bytes per token)
const always = (fs.existsSync(path.join(ROOT, 'CLAUDE.md')) ? sizeOf(path.join(ROOT, 'CLAUDE.md')) : 0) + sizeOf(path.join(DOCS, 'WORKING_RULES.md'));
t.check('CLAUDE.md + WORKING_RULES.md (read every session) are at most ' + kb(LIMITS.always) + ' KB — now ' + kb(always) + ' KB', always <= LIMITS.always, always);
['PRD.md', 'ARCHITECTURE.md', 'API.md', 'DATABASE.md', 'SECURITY.md', 'TESTING.md', 'DESIGN.md', 'README.md', 'MANUAL.md'].forEach(function (f) {
  if (!fs.existsSync(path.join(DOCS, f))) return;
  const s = sizeOf(path.join(DOCS, f));
  t.check('docs/' + f + ' is at most ' + kb(LIMITS.file) + ' KB — now ' + kb(s) + ' KB', s <= LIMITS.file, s);
});

// 5. release-log rows stay short (the full text of old rows lives in the archive)
if (fs.existsSync(path.join(DOCS, 'RELEASES.md'))) {
  read(path.join(DOCS, 'RELEASES.md')).split(/\r?\n/).forEach(function (line, i) {
    if (/^\| /.test(line)) t.check('RELEASES.md:' + (i + 1) + ' table row is at most ' + LIMITS.releaseRow + ' characters — now ' + line.length, line.length <= LIMITS.releaseRow, line.slice(0, 50));
  });
}

// 6. the code map points at real things (only if the project has one)
const mapPath = path.join(DOCS, 'manual', 'code-map.md');
if (fs.existsSync(mapPath)) {
  const SKIP = { node_modules: 1, '.git': 1, docs: 1, tests: 1, dist: 1, build: 1, coverage: 1, '.next': 1 };
  const CODE = /\.(js|mjs|cjs|ts|tsx|jsx|py|go|rb|php|java|cs|rs|html|vue|svelte)$/;
  const sources = [];
  const everyFile = [];
  (function collect(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
      if (SKIP[e.name]) return;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { collect(full); return; }
      everyFile.push(full);
      if (CODE.test(e.name) && !/\.min\./.test(e.name)) sources.push(full);
    });
  })(ROOT);
  const allCode = sources.map(function (p) { return read(p); }).join('\n');
  const map = read(mapPath);

  // every function written like `name()` in back-ticks exists somewhere in the code
  const names = {};
  (map.match(/`[A-Za-z_][\w.]*\(\)`/g) || []).forEach(function (m) { names[m.slice(1, -3)] = true; });
  Object.keys(names).forEach(function (n) {
    const last = n.split('.').pop();
    const defined = new RegExp('(function\\s+' + last + '\\b|\\b' + last + '\\s*[:=]|(def|func|fn)\\s+' + last + '\\b|(const|let|var)\\s+' + last + '\\b|\\b' + last + '\\s*\\()');
    t.check('code map: ' + n + '() exists in the code', defined.test(allCode), n);
  });

  // every file path written in back-ticks exists
  const files = {};
  (map.match(/`[^` \s*]+`/g) || []).forEach(function (m) {
    const x = m.slice(1, -1);
    if (/^[A-Za-z0-9_.\/-]+\.[a-z]{1,5}$/.test(x) && /[\/]|\.(js|ts|py|go|rb|php|java|cs|rs|html|json|css|md)$/.test(x)) files[x] = true;
  });
  Object.keys(files).forEach(function (x) {
    const found = [ROOT, DOCS, path.join(DOCS, 'manual'), path.join(ROOT, 'src'), path.join(ROOT, 'tests')].some(function (d) { return fs.existsSync(path.resolve(d, x)); }) ||
      everyFile.some(function (p) { return p.split(path.sep).join('/').endsWith('/' + x); });
    t.check('code map: the file ' + x + ' exists', found, x);
  });
  t.check('the code map names functions and files (' + Object.keys(names).length + ' / ' + Object.keys(files).length + ')', Object.keys(names).length + Object.keys(files).length > 5);
}

process.exit(t.done() ? 0 : 1);
