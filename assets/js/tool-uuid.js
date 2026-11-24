    (function(){
      const countEl = document.getElementById('uuid-count');
      const btn = document.getElementById('uuid-gen');
      const out = document.getElementById('uuid-output-text');
      const box = document.getElementById('uuid-output');
      const copyBtn = document.getElementById('uuid-copy-btn');
      const alertBox = document.getElementById('uuid-alert');

      function uuidv4(){
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        // Version 4: set 4 bits (version)
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        // Variant: set 2 bits (10xx)
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.prototype.map.call(bytes, b=>('00'+b.toString(16)).slice(-2)).join('');
        return hex.substr(0,8)+'-'+hex.substr(8,4)+'-'+hex.substr(12,4)+'-'+hex.substr(16,4)+'-'+hex.substr(20,12);
      }

      btn.addEventListener('click', function(){
        const n = Math.min(Math.max(parseInt(countEl.value,10)||1,1),100);
        const uuids = [];
        for(let i=0;i<n;i++) uuids.push(uuidv4());
        box.classList.add('has-content');
        out.textContent = uuids.join('\n');
        copyBtn.disabled = false;
        alertBox.className = 'alert alert-success show';
        alertBox.querySelector('span').textContent = n + 'টি UUID তৈরি করা হলো।';
      });

      copyBtn.addEventListener('click', function(){
        const text = out.textContent;
        if(!text || text === 'আউটপুট এখানে আসবে') return;
        ToolHub.copy(text).then(function(){
          copyBtn.textContent = 'কপি করা হয়েছে!';
          copyBtn.classList.add('copied');
          setTimeout(()=>{ copyBtn.textContent='কপি'; copyBtn.classList.remove('copied'); }, 1500);
        });
      });
    })();
  