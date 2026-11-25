(function () {
  'use strict';
  var input = document.getElementById('cnt-input');
  var els = {
    chars: document.getElementById('cnt-chars'), charsNS: document.getElementById('cnt-chars-ns'),
    words: document.getElementById('cnt-words'), lines: document.getElementById('cnt-lines'),
    sentences: document.getElementById('cnt-sentences'), paras: document.getElementById('cnt-paras')
  };
  function count() {
    var t = input.value, trimmed = t.trim();
    els.chars.textContent = Array.from(t).length;
    els.charsNS.textContent = Array.from(t.replace(/\s/g, '')).length;
    els.words.textContent = trimmed ? trimmed.split(/\s+/).length : 0;
    els.lines.textContent = t ? t.split(/\r\n|\r|\n/).length : 0;
    els.sentences.textContent = trimmed ? trimmed.split(/[.!?\u0964…]+/).filter(function (s) { return s.trim(); }).length : 0;
    els.paras.textContent = trimmed ? trimmed.split(/(?:\r?\n\s*){2,}/).filter(function (p) { return p.trim(); }).length : 0;
  }
  input.addEventListener('input', count);
  count();
})();
