(function () {
  'use strict';
  var fileInput = document.getElementById('zip-files');
  var nameInput = document.getElementById('zip-name');
  var createBtn = document.getElementById('zip-create');
  var downloadBtn = document.getElementById('zip-download');
  var listEl = document.getElementById('zip-list');
  var link = document.getElementById('zip-download-link');
  var alertBox = document.getElementById('zip-alert');
  var selected = [], blobUrl = null, zipBlob = null;
  listEl.style.whiteSpace = 'pre-line';

  function show(msg, type) {
    alertBox.className = 'alert alert-' + (type || 'info') + ' show';
    alertBox.querySelector('span').textContent = msg;
  }
  function zipName() {
    var n = (nameInput.value || '').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').trim() || 'archive';
    return /\.zip$/i.test(n) ? n : n + '.zip';
  }
  function reset() {
    if (blobUrl) { URL.revokeObjectURL(blobUrl); blobUrl = null; }
    zipBlob = null; downloadBtn.disabled = true; link.style.display = 'none';
  }

  var TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(u8) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < u8.length; i++) c = TABLE[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  async function deflateRaw(u8) {
    var stream = new Blob([u8]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  function dosDateTime(ts) {
    var d = new Date(ts || Date.now());
    var y = Math.max(d.getFullYear(), 1980);
    return {
      time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
      date: ((y - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
    };
  }
  function uniqueNames(files) {
    var seen = Object.create(null);
    return files.map(function (f) {
      var name = f.name || 'file', base = name, ext = '', i = name.lastIndexOf('.');
      if (i > 0) { base = name.slice(0, i); ext = name.slice(i); }
      var out = name, n = 1;
      while (seen[out.toLowerCase()]) out = base + ' (' + (n++) + ')' + ext;
      seen[out.toLowerCase()] = 1;
      return out;
    });
  }
  async function buildZip(files) {
    var names = uniqueNames(files), enc = new TextEncoder();
    var canDeflate = typeof CompressionStream === 'function';
    var parts = [], central = [], offset = 0;
    for (var i = 0; i < files.length; i++) {
      var data = new Uint8Array(await files[i].arrayBuffer());
      var crc = crc32(data), method = 0, body = data;
      if (canDeflate && data.length > 0) {
        try { var z = await deflateRaw(data); if (z.length < data.length) { body = z; method = 8; } } catch (e) {}
      }
      var nameBytes = enc.encode(names[i]), dt = dosDateTime(files[i].lastModified);
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
      lh.setUint16(8, method, true); lh.setUint16(10, dt.time, true); lh.setUint16(12, dt.date, true);
      lh.setUint32(14, crc, true); lh.setUint32(18, body.length, true); lh.setUint32(22, data.length, true);
      lh.setUint16(26, nameBytes.length, true); lh.setUint16(28, 0, true);
      parts.push(lh.buffer, nameBytes, body);
      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true);
      ch.setUint16(8, 0x0800, true); ch.setUint16(10, method, true); ch.setUint16(12, dt.time, true);
      ch.setUint16(14, dt.date, true); ch.setUint32(16, crc, true); ch.setUint32(20, body.length, true);
      ch.setUint32(24, data.length, true); ch.setUint16(28, nameBytes.length, true);
      ch.setUint32(42, offset, true);
      central.push(ch.buffer, nameBytes);
      offset += 30 + nameBytes.length + body.length;
    }
    var cdSize = central.reduce(function (s, p) { return s + (p.byteLength !== undefined ? p.byteLength : p.length); }, 0);
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
    return new Blob(parts.concat(central, [end.buffer]), { type: 'application/zip' });
  }

  fileInput.addEventListener('change', function (e) {
    reset();
    selected = Array.from(e.target.files || []);
    if (!selected.length) { createBtn.disabled = true; listEl.textContent = ''; return; }
    var total = selected.reduce(function (s, f) { return s + f.size; }, 0);
    listEl.textContent = selected.map(function (f) { return '• ' + f.name + ' (' + (f.size / 1024).toFixed(1) + ' KB)'; }).join('\n') +
      '\nTotal:  ' + (total / 1024 / 1024).toFixed(2) + ' MB';
    createBtn.disabled = false;
  });

  createBtn.addEventListener('click', async function () {
    if (!selected.length) { show('Please select files', 'error'); return; }
    var total = selected.reduce(function (s, f) { return s + f.size; }, 0);
    if (selected.length > 65000 || total > 1.5 * 1024 * 1024 * 1024 || selected.some(function (f) { return f.size > 4e9; })) {
      show('Too many files or the total size is too large. Select files totaling less than 1.5 GB.', 'error'); return;
    }
    createBtn.disabled = true; show('Creating ZIP…', 'info');
    try {
      reset();
      zipBlob = await buildZip(selected);
      blobUrl = URL.createObjectURL(zipBlob);
      link.href = blobUrl; link.download = zipName(); link.style.display = 'inline-flex';
      downloadBtn.disabled = false;
      show('ZIP created with ' + selected.length + (selected.length === 1 ? ' file (' : ' files (') + (zipBlob.size / 1024).toFixed(1) + ' KB).', 'success');
    } catch (err) {
      show('Failed to create ZIP:  ' + err.message, 'error');
    }
    createBtn.disabled = false;
  });

  nameInput.addEventListener('input', function () { if (link.href) link.download = zipName(); });
  downloadBtn.addEventListener('click', function () { if (zipBlob) ToolHub.save(zipBlob, zipName()); });
})();
