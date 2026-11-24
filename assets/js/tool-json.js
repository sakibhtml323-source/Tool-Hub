(function () {
  'use strict';
  var input = document.getElementById('json-input');
  var out = document.getElementById('json-output-text');
  var box = document.getElementById('json-output');
  var alertBox = document.getElementById('json-alert');
  var dl = document.getElementById('json-download-link');
  var copyBtn = document.getElementById('json-copy-btn');
  var url = null;
  function show(msg, type) {
    alertBox.className = 'alert alert-' + (type || 'info') + ' show';
    alertBox.querySelector('span').textContent = msg;
  }
  function hide() { alertBox.className = 'alert alert-info'; }
  function render(text, name) {
    box.classList.add('has-content'); out.textContent = text;
    if (url) URL.revokeObjectURL(url);
    url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    dl.href = url; dl.download = name; dl.style.display = 'inline-flex';
  }
  function parse() {
    if (!input.value.trim()) { show('দয়া করে জেএসওএন লিখুন', 'error'); return undefined; }
    try { return { v: JSON.parse(input.value) }; }
    catch (e) {
      show('অবৈধ জেএসওএন: ' + e.message, 'error');
      box.classList.remove('has-content'); out.textContent = ''; dl.style.display = 'none';
      return undefined;
    }
  }
  document.getElementById('json-format').addEventListener('click', function () {
    hide(); var p = parse(); if (p) render(JSON.stringify(p.v, null, 2), 'formatted.json');
  });
  document.getElementById('json-minify').addEventListener('click', function () {
    hide(); var p = parse(); if (p) render(JSON.stringify(p.v), 'minified.json');
  });
  document.getElementById('json-validate').addEventListener('click', function () {
    var p = parse(); if (p) show('সঠিক জেএসওএন — কোনো ত্রুটি নেই।', 'success');
  });
  copyBtn.addEventListener('click', function () {
    var t = out.textContent;
    if (!t || t === 'আউটপুট এখানে আসবে') return;
    ToolHub.copy(t).then(function () {
      copyBtn.textContent = 'কপি করা হয়েছে!'; copyBtn.classList.add('copied');
      setTimeout(function () { copyBtn.textContent = 'কপি'; copyBtn.classList.remove('copied'); }, 1500);
    });
  });
})();
