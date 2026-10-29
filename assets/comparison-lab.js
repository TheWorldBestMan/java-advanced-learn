(function(){
  'use strict';var active=null,pauseActive=null,inputs={};
  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function show(x){return typeof x==='object'?JSON.stringify(x):String(x);}
  function stop(){if(active)active();active=null;pauseActive=null;}
  function render(host,id){
    stop();var all=window.ALGORITHM_COMPARISONS||[],meta=all.find(function(p){return p.id===id;})||all[0];
    host.innerHTML='<div class="card chapter-head"><div class="kicker">同题两种解法</div><h1>解法对比实验室</h1><p class="muted">相同输入，对照完整 Java 代码、执行步骤与理论复杂度。计数来自步骤模型，不是 Java 运行耗时。</p></div>'
      +'<section class="card comparison-lab"><div class="studio-fields"><label>对比题目<select data-pair>'+all.map(function(p){return '<option value="'+p.id+'"'+(p.id===meta.id?' selected':'')+'>'+esc(p.title)+'</option>';}).join('')+'</select></label><label class="grow">共同输入<input data-pair-input value="'+esc(inputs[meta.id]??meta.input)+'"><small>'+esc(meta.hint)+'；修改后自动更新</small></label><button class="btn ghost" type="button" data-pair-build>更新对比</button></div>'
      +'<p>'+esc(meta.lesson)+'</p><p class="studio-error" role="alert"></p><div class="studio-actions"><button class="btn ghost" type="button" data-pair-prev>上一步</button><button class="btn" type="button" data-pair-play>自动对比</button><button class="btn ghost" type="button" data-pair-next>下一步</button><button class="btn ghost" type="button" data-pair-last>查看最终结果</button></div><label class="comparison-progress">步骤 <span data-pair-progress></span><input type="range" data-pair-slider min="0" max="0" value="0"></label><p class="muted small">按步骤号同步推进；较早完成的一侧会保留结果。</p><div class="comparison-columns"></div></section>';
    var root=host.querySelector('.comparison-lab'),input=root.querySelector('[data-pair-input]'),slider=root.querySelector('[data-pair-slider]'),data=null,index=0,max=0,timer=null,rebuild=null;
    function pause(){clearInterval(timer);timer=null;root.querySelector('[data-pair-play]').textContent='自动对比';}
    function blocked(){root.querySelectorAll('.studio-actions button').forEach(function(b){b.disabled=true;});slider.disabled=true;}
    function source(run){return '<details class="comparison-source" open><summary>完整 Java 代码</summary><ol>'+run.code.split('\n').map(function(line,i){return '<li data-code-line="'+(i+1)+'"><code>'+esc(line)+'</code></li>';}).join('')+'</ol></details>';}
    function update(){if(!data)return;root.querySelector('[data-pair-progress]').textContent=(index+1)+' / '+max;slider.value=index;slider.disabled=false;root.querySelectorAll('.studio-actions button').forEach(function(b){b.disabled=false;});root.querySelector('[data-pair-prev]').disabled=index===0;root.querySelector('[data-pair-next]').disabled=index===max-1;
      data.runs.forEach(function(run,i){var frame=run.frames[Math.min(index,run.frames.length-1)],done=index>=run.frames.length-1,panel=root.querySelector('[data-side="'+i+'"]');
        panel.querySelector('[data-operation-count]').textContent=frame.operations;
        panel.querySelector('[data-operation-bar]').style.width=(100*frame.operations/Math.max(1,...data.runs.map(function(r){return r.operations;})))+'%';
        panel.querySelector('.operation-track').hidden=meta.units[0]!==meta.units[1];
        panel.querySelector('[data-side-status]').textContent=done?'已完成 · 结果 '+show(run.result):'执行中';panel.querySelector('[data-side-caption]').textContent=frame.text;
        panel.querySelector('[data-side-executing]').textContent='第 '+frame.line+' 行：'+run.code.split('\n')[frame.line-1].trim();
        panel.querySelector('[data-side-state]').innerHTML='<div class="studio-values">'+frame.values.map(function(x){return '<span>'+esc(x)+'</span>';}).join('')+'</div><dl class="lab-vars">'+Object.entries(frame.vars).map(function(p){return '<div><dt>'+esc(p[0])+'</dt><dd>'+esc(show(p[1]))+'</dd></div>';}).join('')+'</dl>';
        panel.querySelectorAll('[data-code-line]').forEach(function(row){var yes=Number(row.dataset.codeLine)===frame.line;row.classList.toggle('current',yes);if(yes){row.setAttribute('aria-current','step');var list=row.parentElement;if(row.offsetTop<list.scrollTop)list.scrollTop=row.offsetTop;else if(row.offsetTop+row.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=row.offsetTop+row.offsetHeight-list.clientHeight;}else row.removeAttribute('aria-current');});
      });
    }
    function build(){clearTimeout(rebuild);pause();try{data=meta.build(input.value);inputs[meta.id]=input.value;index=0;max=Math.max(...data.runs.map(function(r){return r.frames.length;}));slider.max=max-1;root.querySelector('.studio-error').textContent='';root.querySelector('.comparison-columns').innerHTML=data.runs.map(function(run,i){return '<article class="comparison-side" data-side="'+i+'"><h2>'+esc(meta.labels[i])+'</h2><p class="muted">'+esc(meta.complexity[i])+'</p><div class="operation-metric"><strong data-operation-count>0</strong> '+esc(meta.units[i])+'<div class="operation-track"><div data-operation-bar></div></div></div><p class="comparison-status" data-side-status></p><p data-side-caption></p><div class="comparison-executing" data-side-executing></div><div data-side-state></div>'+source(run)+'<div class="studio-actions"><button class="btn ghost" type="button" data-pair-copy="'+i+'">复制代码</button><button class="btn" type="button" data-pair-run="'+i+'">运行这份 Java</button></div><div data-side-output aria-live="polite"></div></article>';}).join('');update();return true;}catch(e){data=null;blocked();root.querySelector('.comparison-columns').innerHTML='';root.querySelector('[data-pair-progress]').textContent='待生成';root.querySelector('.studio-error').textContent=e.message;return false;}}
    function fresh(){if(!data||inputs[meta.id]!==input.value)return build();return true;}
    input.addEventListener('input',function(){pause();blocked();data=null;root.querySelector('.comparison-columns').innerHTML='<p class="muted">正在根据新输入重算两种解法…</p>';clearTimeout(rebuild);rebuild=setTimeout(function(){if(root.isConnected)build();},200);});
    input.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.isComposing){e.preventDefault();build();}});
    root.querySelector('[data-pair]').addEventListener('change',function(e){location.hash='#/compare/'+e.target.value;});
    root.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
      if(b.hasAttribute('data-pair-build'))build();
      if(b.hasAttribute('data-pair-prev')){pause();if(fresh()){index=Math.max(0,index-1);update();}}
      if(b.hasAttribute('data-pair-next')){pause();if(fresh()){index=Math.min(max-1,index+1);update();}}
      if(b.hasAttribute('data-pair-last')){pause();if(fresh()){index=max-1;update();}}
      if(b.hasAttribute('data-pair-play')){if(timer){pause();return;}if(!fresh())return;if(index===max-1)index=0;update();b.textContent='暂停';timer=setInterval(function(){if(!root.isConnected||index===max-1){pause();return;}index++;update();if(index===max-1)pause();},650);}
      if(b.hasAttribute('data-pair-run')&&data){var i=Number(b.dataset.pairRun);window.LearningTools.run('/run',{code:data.runs[i].code},b.closest('.comparison-side').querySelector('[data-side-output]'),b);}
      if(b.hasAttribute('data-pair-copy')&&data){var code=data.runs[Number(b.dataset.pairCopy)].code;if(navigator.clipboard)navigator.clipboard.writeText(code).then(function(){b.textContent='已复制';}).catch(function(){b.textContent='请在代码区选择复制';});else b.textContent='请在代码区选择复制';}
    });
    slider.addEventListener('input',function(){pause();var requested=Number(slider.value);if(fresh()){index=Math.max(0,Math.min(max-1,requested));update();}});
    active=function(){pause();clearTimeout(rebuild);};pauseActive=pause;build();
  }
  document.addEventListener('visibilitychange',function(){if(document.hidden&&pauseActive)pauseActive();});
  window.ComparisonLab={render:render,stop:stop};
})();
