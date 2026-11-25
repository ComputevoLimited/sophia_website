'use strict';
// Runs every tests/*.test.js, each in its own process, and fails if any of them fails.   node tests/run.js
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const files = fs.readdirSync(__dirname).filter(function (f) { return /\.test\.js$/.test(f); }).sort();
let failed = 0;
files.forEach(function (f) {
  const r = spawnSync(process.execPath, [path.join(__dirname, f)], { stdio: 'inherit' });
  if (r.status !== 0) failed++;
});
console.log('\n' + (files.length - failed) + ' of ' + files.length + ' test files passed');
process.exit(failed ? 1 : 0);
