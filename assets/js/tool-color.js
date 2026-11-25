(function () {
  'use strict';
  var input = document.getElementById('color-input');
  var btn = document.getElementById('color-convert');
  var swatch = document.getElementById('color-swatch');
  var hexVal = document.getElementById('color-hex-val');
  var rgbVal = document.getElementById('color-rgb-val');
  var hslVal = document.getElementById('color-hsl-val');
  var copyBtn = document.getElementById('color-copy');
  var alertBox = document.getElementById('color-alert');

  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
    function f(n) {
      var k = (n + h * 12) % 12, a = s * Math.min(l, 1 - l);
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    }
    return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
  }
  function parseNum(tok, pctScale) {
    var isPct = /%$/.test(tok), v = parseFloat(tok);
    if (isNaN(v)) return NaN;
    return isPct ? v * pctScale / 100 : v;
  }
  function parseColor(str) {
    var s = str.trim().toLowerCase(), m;
    if ((m = s.match(/^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/))) {
      var h = m[1];
      if (h.length <= 4) h = h.split('').map(function (c) { return c + c; }).join('');
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
    }
    if ((m = s.match(/^(rgba?|hsla?)\(([^)]+)\)$/))) {
      var t = m[2].trim().split(/[\s,\/]+/).filter(Boolean);
      if (t.length < 3) return null;
      if (m[1].indexOf('rgb') === 0) {
        var v = t.slice(0, 3).map(function (x) { return parseNum(x, 255); });
        if (v.some(function (x) { return isNaN(x) || x < 0 || x > 255; })) return null;
        return { r: Math.round(v[0]), g: Math.round(v[1]), b: Math.round(v[2]) };
      }
      var hh = parseFloat(t[0]), ss = parseFloat(t[1]), ll = parseFloat(t[2]);
      if ([hh, ss, ll].some(isNaN) || ss < 0 || ss > 100 || ll < 0 || ll > 100) return null;
      return hslToRgb(hh, ss, ll);
    }
    if (/^[a-z]+$/.test(s)) {
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = '#000'; ctx.fillStyle = s; var a = ctx.fillStyle;
      ctx.fillStyle = '#fff'; ctx.fillStyle = s; var b = ctx.fillStyle;
      if (a !== b) return null;
      return parseColor(a);
    }
    return null;
  }
  function toHex(r, g, b) { return '#' + [r, g, b].map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }
  function toHSL(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function convert() {
    var c = parseColor(input.value);
    if (!c) {
      alertBox.className = 'alert alert-error show';
      alertBox.querySelector('span').textContent = 'Enter a valid color code (e.g. #6366f1, rgb(99,102,241) or hsl(239,84%,67%))';
      return;
    }
    alertBox.className = 'alert alert-info';
    var hex = toHex(c.r, c.g, c.b), hsl = toHSL(c.r, c.g, c.b);
    swatch.style.background = hex;
    hexVal.textContent = hex;
    rgbVal.textContent = 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')';
    hslVal.textContent = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
    copyBtn.disabled = false;
  }
  btn.addEventListener('click', convert);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') convert(); });
  copyBtn.addEventListener('click', function () {
    ToolHub.copy(hexVal.textContent + '\n' + rgbVal.textContent + '\n' + hslVal.textContent).then(function () {
      copyBtn.textContent = 'Copied!'; copyBtn.classList.add('copied');
      setTimeout(function () { copyBtn.textContent = 'Copy all'; copyBtn.classList.remove('copied'); }, 1500);
    });
  });
})();
