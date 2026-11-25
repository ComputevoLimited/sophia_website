'use strict';
/*
 * No secret may be written into the project. Reads every text file (code, pages, data, workflows, documents) and looks for
 * the usual shapes of secrets: an email-service key, a private key, a GitHub token, a long hash, a "SECRET_NAME = value"
 * line. A safety net, not a guarantee. Add the names of THIS project's secrets to the "secret name" rule below.
 */
const fs = require('fs');
const path = require('path');
const h = require('./lite-harness');

const t = h.checker('secrets');
const ROOT = h.ROOT;

const SKIP_DIRS = new Set(['node_modules', '.git', '.wrangler', 'dist', 'build', 'coverage', 'vendor', 'images']);
const SKIP_FILES = new Set(['.dev.vars', '.dev.vars.example', '.env', '.env.example', 'settings.local.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']);   // local-only or placeholder files
const TEXT = /\.(js|ts|json|jsonc|md|html|css|yml|yaml|txt|toml|svg|xml|py|php|rb|go)$|^(_headers|\.gitignore|\.htaccess)$/;

function walk(dir, out) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), out); return; }
    if (SKIP_FILES.has(e.name) || /\.min\.js$/.test(e.name) || !TEXT.test(e.name)) return;
    out.push(path.join(dir, e.name));
  });
  return out;
}

// the second-to-last rule: put this project's own secret names between the brackets, separated by |
const OWN_SECRET_NAMES = 'API_KEY|SECRET|PASSWORD|TOKEN|CLOUDFLARE_ACCOUNT_ID';
const RULES = [
  ['an email-service key (Resend)', /\bre_[A-Za-z0-9]{20,}\b/],
  ['a private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['a GitHub token', /\b(gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/],
  ['a 64-character hash', /\b[a-fA-F0-9]{64}\b/],
  ['a secret name followed by a value', new RegExp('\\b[A-Z0-9_]*(' + OWN_SECRET_NAMES + ')[A-Z0-9_]*\\b["\']?\\s*[:=]\\s*["\']?[A-Za-z0-9+/_\\-]{12,}')],
  ['an Authorization header with a real token', /Authorization['"]?\s*[:=]\s*['"]Bearer\s+[A-Za-z0-9\-_.]{25,}['"]/],
];

const files = walk(ROOT, []);
t.check('found the project files to read (' + files.length + ')', files.length > 3, files.length);

files.forEach(function (f) {
  const rel = path.relative(ROOT, f).split(path.sep).join('/');
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  RULES.forEach(function (rule) {
    lines.forEach(function (line, i) {
      if (/fake|placeholder|example|your-|change-me|xxxx/i.test(line)) return;   // obvious stand-ins
      if (rule[1].test(line)) t.check(rel + ':' + (i + 1) + ' does not contain ' + rule[0], false, line.trim().slice(0, 60) + '…');
    });
  });
});
t.check('no secret-shaped text found in ' + files.length + ' files', true);

// the local secrets file must stay out of git
const gi = fs.existsSync(path.join(ROOT, '.gitignore')) ? fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8') : '';
t.check('.gitignore keeps a local secrets file (.env or .dev.vars) out of git', /^\.env|^\.dev\.vars/m.test(gi));

process.exit(t.done() ? 0 : 1);
