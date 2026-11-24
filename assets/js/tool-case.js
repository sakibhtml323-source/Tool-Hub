    (function(){
      const input = document.getElementById('case-input');
      const out = document.getElementById('case-output-text');
      const box = document.getElementById('case-output');
      const copyBtn = document.getElementById('case-copy-btn');
      const alertBox = document.getElementById('case-alert');

      function toTitle(t){ return [...t.toLowerCase()].map((ch,i)=> (i===0 || /\s/.test(t[i-1])) ? ch.toUpperCase() : ch).join(''); }
      function toSentence(t){ return t.toLowerCase().replace(/(^\s*|[.!?।]\s+)(\p{L})/gu,function(m,a,b){return a+b.toUpperCase();}); }

      function apply(fn){
        const t=input.value;
        if(!t.trim()){ alertBox.className='alert alert-error show'; alertBox.querySelector('span').textContent='দয়া করে টেক্সট লিখুন'; return; }
        const r = fn(t);
        box.classList.add('has-content'); out.textContent=r;
        alertBox.className='alert alert-success show'; alertBox.querySelector('span').textContent='কেস রূপান্তর করা হলো।';
      }

      document.getElementById('case-lower').addEventListener('click',()=>apply(t=>t.toLowerCase()));
      document.getElementById('case-upper').addEventListener('click',()=>apply(t=>t.toUpperCase()));
      document.getElementById('case-title').addEventListener('click',()=>apply(toTitle));
      document.getElementById('case-sentence').addEventListener('click',()=>apply(toSentence));

      copyBtn.addEventListener('click',function(){
        const t=out.textContent;
        if(!t || t==='আউটপুট এখানে আসবে') return;
        ToolHub.copy(t).then(function(){
          copyBtn.textContent='কপি করা হয়েছে!'; copyBtn.classList.add('copied');
          setTimeout(()=>{copyBtn.textContent='কপি';copyBtn.classList.remove('copied');},1500);
        });
      });
    })();
  