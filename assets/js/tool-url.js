    (function(){
      const input = document.getElementById('url-input');
      const out = document.getElementById('url-output-text');
      const box = document.getElementById('url-output');
      const copyBtn = document.getElementById('url-copy-btn');
      const alertBox = document.getElementById('url-alert');

      function show(msg,type){
        alertBox.className='alert alert-'+(type||'info')+' show';
        alertBox.querySelector('span').textContent=msg;
      }

      document.getElementById('url-encode').addEventListener('click',function(){
        const t=input.value;
        if(!t){ show('Please enter some text','error'); return; }
        box.classList.add('has-content'); out.textContent=encodeURIComponent(t);
        show('URL encoded.','success');
      });

      document.getElementById('url-decode').addEventListener('click',function(){
        const t=input.value.trim();
        if(!t){ show('Please enter some text','error'); return; }
        try{
          box.classList.add('has-content'); out.textContent=decodeURIComponent(t);
          show('URL decoded.','success');
        }catch(e){ show('Decoding error — enter valid encoded text.','error'); }
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
  