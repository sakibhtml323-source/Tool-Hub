(function () {
  'use strict';
  var input = document.getElementById('html-input');
  var out = document.getElementById('html-output-text');
  var box = document.getElementById('html-output');
  var copyBtn = document.getElementById('html-copy-btn');
  var alertBox = document.getElementById('html-alert');
  function show(msg, type) {
    alertBox.className = 'alert alert-' + (type || 'info') + ' show';
    alertBox.querySelector('span').textContent = msg;
  }
  function minifyHTML(html) {
    var keep = [];
    var s = html.replace(/<(script|style|pre|textarea)\b[\s\S]*?<\/\1\s*>/gi, function (m) {
      keep.push(m); return '\u0000' + (keep.length - 1) + '\u0000';
    });
    s = s.replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
         .replace(/>\s*[\r\n]\s*</g, '><')
         .replace(/\s+/g, ' ')
         .trim();
    return s.replace(/\u0000(\d+)\u0000/g, function (_, i) { return keep[+i]; });
  }
  function bytes(s) { return new TextEncoder().encode(s).length; }
  document.getElementById('html-minify').addEventListener('click', function () {
    var html = input.value;
    if (!html.trim()) { show('Please enter HTML code', 'error'); return; }
    try {
      var res = minifyHTML(html), a = bytes(html), b = bytes(res);
      box.classList.add('has-content'); out.textContent = res;
      show('HTML minified:  ' + a + ' → ' + b + '  bytes (' + (a ? Math.round((1 - b / a) * 100) : 0) + '% smaller).', 'success');
    } catch (e) { show('Minify error:  ' + e.message, 'error'); }
  });
  copyBtn.addEventListener('click', function () {
    var t = out.textContent;
    if (!t || t === 'Output will appear here') return;
    ToolHub.copy(t).then(function () {
      copyBtn.textContent = 'Copied!'; copyBtn.classList.add('copied');
      setTimeout(function () { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1500);
    });
  });
})();
