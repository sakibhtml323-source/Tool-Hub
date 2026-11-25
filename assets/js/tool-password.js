(function () {
  'use strict';
  var input = document.getElementById('pw-input');
  var meter = document.getElementById('pw-meter');
  var score = document.getElementById('pw-score');
  var details = document.getElementById('pw-details');
  var gen = document.getElementById('pw-gen');
  var copyBtn = document.getElementById('pw-copy');
  var COMMON = ['password', 'passw0rd', '12345678', '123456789', 'qwerty', 'qwertyuiop', 'abc12345', 'iloveyou', 'admin', 'letmein', 'welcome', '11111111', '00000000', 'bangladesh', 'monkey', 'dragon'];
  var SETS = {
    lower: 'abcdefghijklmnopqrstuvwxyz', upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digit: '0123456789', symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  function randInt(max) {
    var limit = Math.floor(4294967296 / max) * max, buf = new Uint32Array(1);
    do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
    return buf[0] % max;
  }
  function entropyBits(pw) {
    if (!pw) return 0;
    var pool = 0;
    if (/[a-z]/.test(pw)) pool += 26;
    if (/[A-Z]/.test(pw)) pool += 26;
    if (/[0-9]/.test(pw)) pool += 10;
    if (/[^A-Za-z0-9]/.test(pw)) pool += 33;
    var chars = Array.from(pw), unique = new Set(chars).size;
    var bits = chars.length * Math.log2(Math.max(pool, 2));
    bits *= Math.min(1, unique / Math.max(chars.length * 0.6, 1));
    var low = pw.toLowerCase();
    if (COMMON.some(function (c) { return low.indexOf(c) !== -1; })) bits = Math.min(bits, 20);
    if (/^(.)\1+$/.test(pw)) bits = Math.min(bits, 10);
    return bits;
  }
  function analyze(pw) {
    var chars = Array.from(pw);
    var c = function (re) { return (pw.match(re) || []).length; };
    document.getElementById('pw-len').textContent = chars.length;
    document.getElementById('pw-upper').textContent = c(/[A-Z]/g);
    document.getElementById('pw-lower').textContent = c(/[a-z]/g);
    document.getElementById('pw-digit').textContent = c(/[0-9]/g);
    document.getElementById('pw-symbol').textContent = c(/[^A-Za-z0-9]/g);
    var bits = entropyBits(pw), pct = Math.min(100, Math.round(bits / 80 * 100)), color, label;
    if (bits < 40) { color = '#ef4444'; label = 'Weak'; }
    else if (bits < 60) { color = '#f59e0b'; label = 'Medium'; }
    else { color = '#22c55e'; label = 'Strong'; }
    meter.style.width = pct + '%'; meter.style.background = color;
    score.textContent = pw ? label : ''; score.style.color = color;
    details.style.display = pw ? 'grid' : 'none';
  }
  input.addEventListener('input', function () { analyze(input.value); copyBtn.disabled = !input.value; });
  gen.addEventListener('click', function () {
    var all = SETS.lower + SETS.upper + SETS.digit + SETS.symbol, out = [], i;
    ['lower', 'upper', 'digit', 'symbol'].forEach(function (k) { out.push(SETS[k][randInt(SETS[k].length)]); });
    for (i = out.length; i < 16; i++) out.push(all[randInt(all.length)]);
    for (i = out.length - 1; i > 0; i--) { var j = randInt(i + 1), t = out[i]; out[i] = out[j]; out[j] = t; }
    input.value = out.join(''); analyze(input.value);
    copyBtn.disabled = false; copyBtn.textContent = 'Copy';
  });
  copyBtn.addEventListener('click', function () {
    if (!input.value) return;
    ToolHub.copy(input.value).then(function () {
      copyBtn.textContent = 'Copied!';
      setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1500);
    });
  });
})();
