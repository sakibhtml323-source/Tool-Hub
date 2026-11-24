(function () {
  'use strict';
  var btn = document.getElementById('menu-toggle');
  var links = document.getElementById('nav-links');
  if (!btn || !links) return;
  function setOpen(open) {
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', function () { setOpen(!links.classList.contains('open')); });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') setOpen(false); });
})();
