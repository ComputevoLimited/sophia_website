'use strict';
/*
 * Runs the REAL Cloudflare Worker on this computer (wrangler's local mode, the same upload rules as a deploy) and runs the
 * smoke check against it. It proves, before anything is pushed, that the private files (docs, tests, source, config) are
 * "not found", that the security headers are sent, and that the served files are the project's own.
 *   node tests/local-smoke.js
 * Needs the internet the first time (npx fetches wrangler). Not part of `node tests/run.js`. It starts one wrangler process
 * of its own and stops only that one (never other wrangler or dev servers).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8799;
const BASE = 'http://127.0.0.1:' + PORT;
const LOG = path.join(os.tmpdir(), 'sophia-local-worker.log');

async function up() {
  try { const r = await fetch(BASE + '/', { redirect: 'manual', signal: AbortSignal.timeout(2000) }); return r.status > 0; } catch (e) { return false; }
}
function stop(child) {
  if (!child || !child.pid) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  else { try { process.kill(-child.pid, 'SIGTERM'); } catch (e) { child.kill('SIGTERM'); } }
}

(async function () {
  if (await up()) { console.log('Something already answers on port ' + PORT + ' — stop it first, so this check tests our own Worker.'); process.exit(2); }
  const out = fs.openSync(LOG, 'w');
  const child = spawn('npx --yes wrangler@4 dev --port ' + PORT + ' --ip 127.0.0.1', {
    cwd: ROOT, shell: true, stdio: ['ignore', out, out], windowsHide: true, detached: process.platform !== 'win32',
  });
  let exited = false;
  child.on('exit', function () { exited = true; });
  let status = 1;
  try {
    let ready = false;
    for (let i = 0; i < 180 && !exited; i++) {
      if (await up()) { ready = true; break; }
      await new Promise(function (r) { setTimeout(r, 1000); });
    }
    if (!ready) { console.log('The local Worker did not start. Log: ' + LOG + '\n' + fs.readFileSync(LOG, 'utf8').split(/\r?\n/).slice(-8).join('\n')); status = 2; }
    else {
      console.log('Local Worker is up at ' + BASE + '\n');
      status = spawnSync(process.execPath, [path.join(__dirname, 'smoke.js'), BASE], { stdio: 'inherit' }).status;
    }
  } finally {
    stop(child);
  }
  process.exit(status);
})();
