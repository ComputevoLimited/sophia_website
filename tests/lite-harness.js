'use strict';
// Minimal helpers for the generic tests (docs.test.js, secrets.test.js). A project with its own harness can keep that and
// point the tests at it instead. Needs only Node 18 or newer.
const path = require('path');

const ROOT = path.resolve(__dirname, '..');   // the project root (tests/ lives in the root)

function checker(name) {
  let pass = 0, fail = 0;
  return {
    check: function (what, cond, extra) {
      if (cond) { pass++; return; }
      fail++;
      console.log('  FAIL [' + name + '] ' + what + (extra !== undefined ? '  -> ' + JSON.stringify(extra).slice(0, 300) : ''));
    },
    done: function () {
      console.log((fail ? 'FAILED  ' : 'ok      ') + name + ': ' + pass + ' checks passed' + (fail ? ', ' + fail + ' FAILED' : ''));
      return fail === 0;
    },
  };
}

module.exports = { ROOT, checker };
