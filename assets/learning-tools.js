(function () {
  'use strict';
  var cases={},KEY='java-advanced-case-drafts-v1',drafts={};
  try{drafts=JSON.parse(localStorage.getItem(KEY)||'{}');if(!drafts||typeof drafts!=='object'||Array.isArray(drafts))drafts={};}catch(e){}
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function save(){return window.LearningStorage.write(KEY,JSON.stringify(drafts));}
  (window.COURSE||[]).forEach(function(ch){ch.sections.forEach(function(section){section.blocks.filter(function(b){return b.t==='case-studies';}).forEach(function(b){b.items.forEach(function(item,i){item.id='case-'+ch.id+'-'+section.id+'-'+(i+1);cases[item.id]=item;});});});});
  (window.COURSE||[]).forEach(function(ch){ch.sections.forEach(function(section){section.blocks.filter(function(b){return b.t==='quick-start';}).forEach(function(b){cases[b.item.id]=b.item;});});});
  function editor(item){
    var code=drafts[item.id]!=null?drafts[item.id]:item.code;
    return '<div class="case-workspace" data-case="'+item.id+'">'
      +'<div class="ex-actions"><button class="btn" type="button" data-case-edit="'+item.id+'" aria-expanded="false">编辑 / 运行代码</button>'
      +'<span class="muted small">修改自动保存在当前浏览器</span></div>'
      +'<div class="case-editor" hidden><label class="req-title" for="draft-'+item.id+'">修改 Java 程序与 main 中的测试输入</label>'
      +'<textarea spellcheck="false" class="java-editor" id="draft-'+item.id+'" data-case-draft="'+item.id+'">'+esc(code)+'</textarea>'
      +'<div class="ex-actions"><button class="btn run" type="button" data-case-run="'+item.id+'">▶ 运行当前代码</button>'
      +'<button class="btn ghost" type="button" data-case-copy="'+item.id+'">复制当前代码</button>'
      +'<button class="btn ghost" type="button" data-case-reset="'+item.id+'">恢复原代码</button></div>'
      +'<p class="muted small" aria-live="polite" data-draft-status>已保存的修改会在刷新后保留。</p><div class="case-run-output" aria-live="polite"></div></div></div>';
  }
  function notes(item){
    var lines=item.code.split('\n'),manual=(window.CASE_NOTES||{})[item.id]||[];
    var rows=manual.map(function(n){var at=lines.findIndex(function(line){return line.indexOf(n[0])>=0;});return at<0?null:{line:at+1,code:lines[at].trim(),note:n[1]};}).filter(Boolean);
    if(!rows.length) lines.forEach(function(line,i){var at=line.indexOf('//');if(at>=0)rows.push({line:i+1,code:line.slice(0,at).trim(),note:line.slice(at+2).trim()});});
    if(!rows.length)return '';
    return '<details class="code-explanation"><summary>分步骤读代码 · '+rows.length+' 个关键点</summary><ol>'
      +rows.map(function(r){return '<li><span class="line-badge">第 '+r.line+' 行</span> <code>'+esc(r.code||'关键说明')+'</code><p>'+esc(r.note)+'</p></li>';}).join('')+'</ol></details>';
  }
  function tradeoff(item){
    var match=/^case-(c\d+)-(s\d+)-(\d+)$/.exec(item.id||'');
    var list=match&&(window.CASE_TRADEOFFS||{})[match[1]+'/'+match[2]];
    var row=list&&list[Number(match[3])-1];
    if(!row)return '';
    return '<details class="case-tradeoff"><summary>为什么选这个方法？有没有更好的做法？</summary>'
      +'<div class="tradeoff-grid"><div><strong>另一种做法</strong><p>'+esc(row[0])+'</p></div>'
      +'<div><strong>当前案例</strong><p>'+esc(row[1])+'</p></div></div>'
      +'<p class="tradeoff-decision"><strong>实际怎么选：</strong>'+esc(row[2])+'</p></details>';
  }
  function testPanel(ex){var bank=(window.EXERCISE_TESTS||{})[ex.id];if(!bank)return '';
    return '<details class="public-tests"><summary>'+bank.tests.length+' 组公开测试 · 点击查看输入与预期</summary>'
      +'<p class="muted small">测试会调用题目要求的方法，覆盖以下输入；全部通过表示通过这些公开测试。</p>'
      +bank.tests.map(function(t,i){return '<div class="test-preview"><strong>测试 '+(i+1)+' · '+esc(t.note)+'</strong><div>输入：<code>'+esc(t.input)+'</code></div><div>预期：<code>'+esc(t.expected===''?'（空字符串）':t.expected)+'</code></div></div>';}).join('')+'</details>';
  }
  function guide(key){var g=(window.LESSON_GUIDES||{})[key];if(!g)return '';
    var id='case-'+key.replace('/','-')+'-'+g[1];
    return '<details class="method-guide" open><summary>深入理解：'+esc(g[0])+'</summary>'
      +'<div class="method-comparison"><div><strong>直接做法</strong><p>'+esc(g[2])+'</p></div><div><strong>本节方法</strong><p>'+esc(g[3])+'</p></div></div>'
      +'<p><strong>每一步都应成立：</strong>'+esc(g[4])+'</p><p><strong>时间与空间：</strong>'+esc(g[5])+'</p><p><strong>容易写错：</strong>'+esc(g[6])+'</p>'
      +'<button class="btn ghost" type="button" data-jump-case="'+id+'">查看对应完整代码与逐行讲解</button></details>';
  }
  function unavailable(){return '<div class="run-out warn">当前页面支持阅读和算法演示。运行 Java 和公开测试需要在电脑上启动本地学习网站并安装 JDK；手机可通过电脑开启的局域网地址运行。</div>';}
  function renderResult(d){
    if(d.error||d.compileError)return '<div class="run-out fail"><strong>'+(d.compileError?'编译错误':'无法运行')+'</strong><pre>'+esc(d.compileError||d.error)+'</pre></div>';
    if(d.results){return '<div class="run-out '+(d.passed===d.total?'ok':'fail')+'"><strong>公开测试：'+d.passed+' / '+d.total+' 通过</strong></div>'
      +d.results.map(function(t,i){var labels={passed:'通过',wrong_answer:'结果不符',runtime_error:'运行错误',time_limit:'超过 5 秒',output_limit:'输出超过长度上限'};
        return '<details class="test-result '+(t.state==='passed'?'pass':'fail')+'"'+(t.state==='passed'?'':' open')+'><summary>测试 '+(i+1)+' · '+esc(labels[t.state]||t.state)+' · '+esc(t.note)+'</summary>'
          +'<div>输入</div><pre>'+esc(t.input)+'</pre><div>预期结果</div><pre>'+esc(t.expected===''?'（空字符串）':t.expected)+'</pre><div>实际结果</div><pre>'+esc(t.actual===''?(t.state==='passed'||t.state==='wrong_answer'?'（空字符串）':'（无返回结果）'):t.actual)+'</pre>'
          +(t.stderr?'<div>错误信息</div><pre>'+esc(t.stderr)+'</pre>':'')+(t.debugOutput?'<div>程序调试输出</div><pre>'+esc(t.debugOutput)+'</pre>':'')+'</details>';
      }).join('');}
    return '<div class="run-out '+(d.runtimeError||d.timedOut?'fail':'ok')+'"><strong>'+(d.outputLimited?'输出超过长度上限':d.timedOut?'运行超过 5 秒':d.runtimeError?'运行错误':'实际运行输出')+'</strong><pre>'+esc(d.stdout||'（无输出）')+'</pre>'+(d.stderr?'<pre>'+esc(d.stderr)+'</pre>':'')+'</div>';
  }
  async function request(path,payload,out,button){
    if(location.protocol==='file:'||/\.github\.io$/i.test(location.hostname)){out.innerHTML=unavailable();return;}
    button.disabled=true;out.innerHTML='<div class="run-out" role="status">正在编译'+(path==='/test'?'并运行全部公开测试':'运行')+'…</div>';
    var controller=new AbortController(),timer=setTimeout(function(){controller.abort();},65000);
    try{var headers={'Content-Type':'application/json'},token=sessionStorage.getItem('java-learning-lan-token');if(token)headers['X-Learning-Token']=token;
      var response=await fetch(path,{method:'POST',headers:headers,body:JSON.stringify(payload),signal:controller.signal});
      var data=await response.json();
      if(response.status===403&&data.code==='lan_auth'){
        sessionStorage.removeItem('java-learning-lan-token');
        var entered=prompt('请输入电脑启动窗口中显示的局域网运行访问码。');
        if(!entered)throw new Error('未输入访问码，无法运行代码。');
        sessionStorage.setItem('java-learning-lan-token',entered.trim());headers['X-Learning-Token']=entered.trim();
        response=await fetch(path,{method:'POST',headers:headers,body:JSON.stringify(payload),signal:controller.signal});data=await response.json();
      }
      if(!response.ok)throw new Error(data.error||('服务返回 '+response.status));
      if(out.isConnected)out.innerHTML=renderResult(data);
      return data;
    }catch(e){if(out.isConnected)out.innerHTML='<div class="run-out fail">'+esc(e.name==='AbortError'?'请求等待超时，请检查本地服务后重试。':'无法完成运行：'+e.message)+'</div>';}
    finally{clearTimeout(timer);button.disabled=false;}
  }
  document.addEventListener('click',function(event){var button=event.target.closest('button');if(!button)return;var id;
    if((id=button.getAttribute('data-case-edit'))){var panel=button.closest('.case-workspace').querySelector('.case-editor');panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)panel.querySelector('textarea').focus();}
    if((id=button.getAttribute('data-case-run'))){var wrap=button.closest('.case-workspace'),ta=wrap.querySelector('textarea');drafts[id]=ta.value;save();request('/run',{code:ta.value},wrap.querySelector('.case-run-output'),button);}
    if((id=button.getAttribute('data-case-reset'))){var ta=document.getElementById('draft-'+id);if(ta.value!==cases[id].code&&!confirm('恢复原代码会覆盖当前案例的修改，确定恢复吗？'))return;ta.value=cases[id].code;delete drafts[id];var saved=save();button.closest('.case-workspace').querySelector('[data-draft-status]').textContent=saved?'已恢复原代码。':'保存失败，请复制代码。';button.closest('.case-workspace').querySelector('.case-run-output').innerHTML='';}
    if((id=button.getAttribute('data-case-copy'))){var ta=document.getElementById('draft-'+id);if(navigator.clipboard)navigator.clipboard.writeText(ta.value).then(function(){button.textContent='已复制';setTimeout(function(){button.textContent='复制当前代码';},1500);}).catch(function(){ta.select();});else ta.select();}
    if((id=button.getAttribute('data-ex-test'))){let testId=id,ta=document.getElementById('code-'+testId),code=ta.value;request('/test',{code:code,exerciseId:testId},document.getElementById('tests-'+testId),button).then(function(result){if(result&&(result.results||result.compileError))document.dispatchEvent(new CustomEvent('learning:test-result',{detail:{id:testId,code:code,result:result}}));});}
    if((id=button.getAttribute('data-jump-case'))){var target=document.getElementById(id);if(target)target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
  });
  document.addEventListener('input',function(e){var id=e.target.getAttribute('data-case-draft');if(id){drafts[id]=e.target.value;var saved=save();e.target.closest('.case-workspace').querySelector('[data-draft-status]').textContent=saved?'修改已保存。':'保存失败，请复制代码。';}});
  document.addEventListener('keydown',function(e){if(e.target.matches('textarea.java-editor')&&e.key==='Tab'&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();var ta=e.target,start=ta.selectionStart,end=ta.selectionEnd;ta.setRangeText('    ',start,end,'end');ta.dispatchEvent(new Event('input',{bubbles:true}));}});
  window.LearningTools={editor:editor,notes:notes,tradeoff:tradeoff,testPanel:testPanel,guide:guide,run:request,getDrafts:function(){return drafts;}};
})();
