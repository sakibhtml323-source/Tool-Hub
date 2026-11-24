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
          if(!t){ show('দয়া করে টেক্সট লিখুন','error'); return; }
          const enc = btoa(unescape(encodeURIComponent(t)));
          box.classList.add('has-content'); out.textContent=enc;
          show('বেস৬৪ এনকোড করা হলো।','success');
        }catch(e){ show('এনকোডে সমস্যা: '+e.message,'error'); }
      });

      document.getElementById('b64-decode').addEventListener('click',function(){
        try{
          const t=input.value.trim();
          if(!t){ show('দয়া করে বেস৬৪ টেক্সট লিখুন','error'); return; }
          const dec = decodeURIComponent(escape(atob(t.replace(/\s+/g,'').replace(/-/g,'+').replace(/_/g,'/'))));
          box.classList.add('has-content'); out.textContent=dec;
          show('বেস৬৪ ডিকোড করা হলো।','success');
        }catch(e){ show('ডিকোডে সমস্যা — সঠিক বেস৬৪ লিখুন।','error'); }
      });

      copyBtn.addEventListener('click',function(){
        const t=out.textContent;
        if(!t || t==='আউটপুট এখানে আসবে') return;
        ToolHub.copy(t).then(function(){
          copyBtn.textContent='কপি করা হয়েছে!'; copyBtn.classList.add('copied');
          setTimeout(()=>{copyBtn.textContent='কপি';copyBtn.classList.remove('copied');},1500);
        });
      });
    })();
  