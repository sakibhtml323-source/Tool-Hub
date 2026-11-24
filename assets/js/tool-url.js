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
        if(!t){ show('দয়া করে টেক্সট লিখুন','error'); return; }
        box.classList.add('has-content'); out.textContent=encodeURIComponent(t);
        show('ইউআরএল এনকোড করা হলো।','success');
      });

      document.getElementById('url-decode').addEventListener('click',function(){
        const t=input.value.trim();
        if(!t){ show('দয়া করে টেক্সট লিখুন','error'); return; }
        try{
          box.classList.add('has-content'); out.textContent=decodeURIComponent(t);
          show('ইউআরএল ডিকোড করা হলো।','success');
        }catch(e){ show('ডিকোডে সমস্যা — সঠিক এনকোডেড টেক্সট লিখুন।','error'); }
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
  