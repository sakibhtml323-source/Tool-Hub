(function () {
  'use strict';
  var txt = document.getElementById('qr-text');
  var size = document.getElementById('qr-size');
  var btn = document.getElementById('qr-generate');
  var dl = document.getElementById('qr-download');
  var canvas = document.getElementById('qr-canvas');
  var placeholder = document.getElementById('qr-placeholder');
  var ready = false;

  function fail(msg) {
    placeholder.textContent = msg; placeholder.style.display = 'block';
    canvas.style.display = 'none'; dl.disabled = true; ready = false;
  }
  function render(value, s) {
    var temp = document.createElement('div');
    temp.style.cssText = 'position:absolute;left:-9999px;top:0';
    document.body.appendChild(temp);
    try {
      new QRCode(temp, { text: value, width: s, height: s, colorDark: '#000000', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
      var qc = temp.querySelector('canvas');
      if (!qc) { fail('কিউআর কোড রেন্ডার করতে সমস্যা হয়েছে।'); return; }
      var margin = Math.round(s * 0.08);
      canvas.width = qc.width + margin * 2; canvas.height = qc.height + margin * 2;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(qc, margin, margin);
      canvas.style.display = 'block'; placeholder.style.display = 'none';
      dl.disabled = false; ready = true;
    } finally { document.body.removeChild(temp); }
  }
  btn.addEventListener('click', function () {
    var value = txt.value.trim();
    if (!value) { fail('দয়া করে টেক্সট বা URL লিখুন'); return; }
    try { render(value, parseInt(size.value, 10) || 300); }
    catch (e) { fail('লেখাটি খুব বড়, কিউআর কোডে ধরানো যায়নি। ছোট করে আবার চেষ্টা করুন।'); }
  });
  dl.addEventListener('click', function () {
    if (!ready) return;
    canvas.toBlob(function (b) { if (b) ToolHub.save(b, 'qrcode.png'); }, 'image/png');
  });
  var timer;
  txt.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { if (txt.value.trim()) btn.click(); }, 600);
  });
  size.addEventListener('change', function () { if (txt.value.trim()) btn.click(); });
})();
