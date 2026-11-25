(function () {
  'use strict';
  var input = document.getElementById('hash-input');
  var btn = document.getElementById('hash-gen');
  var copyBtn = document.getElementById('hash-copy');
  var results = document.getElementById('hash-results');
  var alertBox = document.getElementById('hash-alert');
  function show(msg, type) {
    alertBox.className = 'alert alert-' + type + ' show';
    alertBox.querySelector('span').textContent = msg;
  }
  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function md5(bytes) {
    var S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21], K = new Int32Array(64), i;
    for (i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
    var len = bytes.length, n = ((len + 8) >> 6) + 1, w = new Int32Array(n * 16);
    for (i = 0; i < len; i++) w[i >> 2] |= bytes[i] << ((i & 3) * 8);
    w[len >> 2] |= 0x80 << ((len & 3) * 8);
    w[n * 16 - 2] = len << 3; w[n * 16 - 1] = Math.floor(len / 536870912);
    var a0 = 1732584193, b0 = -271733879, c0 = -1732584194, d0 = 271733878;
    for (var o = 0; o < w.length; o += 16) {
      var a = a0, b = b0, c = c0, d = d0;
      for (i = 0; i < 64; i++) {
        var f, g;
        if (i < 16) { f = (b & c) | (~b & d); g = i; }
        else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
        else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
        else { f = c ^ (b | ~d); g = (7 * i) % 16; }
        var F = (f + a + K[i] + w[o + g]) | 0, s = S[(i >> 4) * 4 + (i & 3)];
        a = d; d = c; c = b; b = (b + ((F << s) | (F >>> (32 - s)))) | 0;
      }
      a0 = (a0 + a) | 0; b0 = (b0 + b) | 0; c0 = (c0 + c) | 0; d0 = (d0 + d) | 0;
    }
    var out = new Uint8Array(16), v = [a0, b0, c0, d0];
    for (i = 0; i < 16; i++) out[i] = (v[i >> 2] >>> ((i & 3) * 8)) & 255;
    return hex(out);
  }
  window.__md5 = md5;

  btn.addEventListener('click', async function () {
    var t = input.value;
    if (!t) { show('Please enter some text', 'error'); return; }
    var enc = new TextEncoder().encode(t);
    try {
      var algos = { sha256: 'SHA-256', sha384: 'SHA-384', sha512: 'SHA-512', sha1: 'SHA-1' };
      for (var k in algos) document.getElementById('hash-' + k).textContent = hex(await crypto.subtle.digest(algos[k], enc));
      document.getElementById('hash-md5').textContent = md5(enc);
      results.style.display = 'grid'; copyBtn.disabled = false;
      show('Hashes generated.', 'success');
    } catch (e) { show('Error:  ' + e.message, 'error'); }
  });

  copyBtn.addEventListener('click', function () {
    var t = ['sha256', 'sha384', 'sha512', 'sha1', 'md5'].map(function (k) {
      return k.toUpperCase().replace('SHA', 'SHA-') .replace('SHA-256', 'SHA-256') + ': ' + document.getElementById('hash-' + k).textContent;
    }).join('\n');
    ToolHub.copy(t).then(function () {
      copyBtn.textContent = 'Copied!'; copyBtn.classList.add('copied');
      setTimeout(function () { copyBtn.textContent = 'Copy all'; copyBtn.classList.remove('copied'); }, 1500);
    });
  });
})();
