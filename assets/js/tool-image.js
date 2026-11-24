(function () {
  'use strict';
  var fileInput = document.getElementById('img-file');
  var quality = document.getElementById('img-quality');
  var compressBtn = document.getElementById('img-compress');
  var downloadBtn = document.getElementById('img-download');
  var preview = document.getElementById('img-preview');
  var info = document.getElementById('img-info');
  var canvas = document.getElementById('img-canvas');
  var placeholder = document.getElementById('img-placeholder');
  var alertBox = document.getElementById('img-alert');
  var file = null, previewUrl = null, resultBlob = null, baseInfo = '';

  function show(msg, type) {
    alertBox.className = 'alert alert-' + (type || 'info') + ' show';
    alertBox.querySelector('span').textContent = msg;
  }
  function kb(n) { return (n / 1024).toFixed(1) + ' KB'; }

  fileInput.addEventListener('change', function (e) {
    var f = e.target.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) { show('দয়া করে ছবি ফাইল বেছে নিন', 'error'); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    file = f; resultBlob = null;
    previewUrl = URL.createObjectURL(f);
    preview.src = previewUrl; preview.style.display = 'block';
    baseInfo = f.name + ' · ' + kb(f.size);
    info.textContent = baseInfo;
    compressBtn.disabled = false; downloadBtn.disabled = true;
    canvas.style.display = 'none'; placeholder.style.display = 'block';
    alertBox.className = 'alert alert-info';
  });

  compressBtn.addEventListener('click', function () {
    if (!file) return;
    var url = URL.createObjectURL(file), img = new Image();
    img.onload = function () {
      URL.revokeObjectURL(url);
      var q = parseFloat(quality.value);
      if (!(q > 0 && q <= 1)) q = 0.8;
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(function (blob) {
        if (!blob) { show('কমপ্রেস করা যায়নি', 'error'); return; }
        resultBlob = blob;
        canvas.style.display = 'block'; placeholder.style.display = 'none';
        downloadBtn.disabled = false;
        var diff = file.size ? Math.round((1 - blob.size / file.size) * 100) : 0;
        info.textContent = baseInfo + ' → ' + kb(blob.size);
        show(diff > 0 ? 'ছবি কমপ্রেস করা হলো (' + diff + '% ছোট)।' : 'ছবি রূপান্তর হয়েছে, কিন্তু আকার কমেনি। মান কমিয়ে আবার চেষ্টা করুন।', diff > 0 ? 'success' : 'info');
      }, 'image/jpeg', q);
    };
    img.onerror = function () { URL.revokeObjectURL(url); show('ছবি লোড করতে সমস্যা হয়েছে', 'error'); };
    img.src = url;
  });

  downloadBtn.addEventListener('click', function () {
    if (!resultBlob) return;
    var base = (file.name || 'image').replace(/\.[^.]+$/, '');
    ToolHub.save(resultBlob, base + '-compressed.jpg');
  });
})();
