    (function(){
      const input = document.getElementById('b64-input');
      const out = document.getElementById('b64-output-text');
      const box = document.getElementById('b64-output');
      const copyBtn = document.getElementById('b64-copy-btn');
      const alertBox = document.getElementById('b64-alert');

      function show(msg,type){
        alertBox.className='alert alert-'+(type||'info')+' show';
        alertBox.querySelector('span').textContent=msg;
      }

      document.getElementById('b64-encode').addEventListener('click',function(){
        try{
          const t=input.value;
          if(!t){ show('Please enter some text','error'); return; }
          const enc = btoa(unescape(encodeURIComponent(t)));
          box.classList.add('has-content'); out.textContent=enc;
          show('Base64 encoded.','success');
        }catch(e){ show('Encoding error:  '+e.message,'error'); }
      });

      document.getElementById('b64-decode').addEventListener('click',function(){
        try{
          const t=input.value.trim();
          if(!t){ show('Please enter Base64 text','error'); return; }
          const dec = decodeURIComponent(escape(atob(t.replace(/\s+/g,'').replace(/-/g,'+').replace(/_/g,'/'))));
          box.classList.add('has-content'); out.textContent=dec;
          show('Base64 decoded.','success');
        }catch(e){ show('Decoding error — enter valid Base64.','error'); }
      });

      copyBtn.addEventListener('click',function(){
        const t=out.textContent;
        if(!t || t==='Output will appear here') return;
        ToolHub.copy(t).then(function(){
          copyBtn.textContent='Copied!'; copyBtn.classList.add('copied');
          setTimeout(()=>{copyBtn.textContent='Copy';copyBtn.classList.remove('copied');},1500);
        });
      });
    })();
  