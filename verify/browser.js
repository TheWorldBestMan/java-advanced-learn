// Browser smoke test using Edge's built-in DevTools protocol; no dependencies.
const {spawn} = require('child_process'), fs = require('fs'), os = require('os'), path = require('path'), assert = require('assert/strict');
const root=path.resolve(__dirname,'..'), port=18767, debug=19347;
const edge=process.env.EDGE_PATH||'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'java-learn-edge-'));
const server=spawn(process.execPath,[path.join(root,'server.js')],{cwd:root,env:{...process.env,PORT:String(port)},windowsHide:true});
let browser;
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function getPage(){for(let i=0;i<100;i++){try{const pages=await (await fetch(`http://127.0.0.1:${debug}/json`)).json(),page=pages.find(p=>p.type==='page'&&p.url.startsWith(`http://127.0.0.1:${port}/`));if(page?.webSocketDebuggerUrl)return page.webSocketDebuggerUrl;}catch{}await delay(100);}throw Error('Edge 启动失败');}
async function main(){
  for(let i=0;i<100;i++){try{if((await fetch(`http://127.0.0.1:${port}/api/status`)).ok)break;}catch{}await delay(100);}
  browser=spawn(edge,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port='+debug,'--user-data-dir='+profile,`http://127.0.0.1:${port}/`],{windowsHide:true,stdio:'ignore'});
  let socket=new WebSocket(await getPage()), seq=0, pending=new Map(),errors=[];
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  socket.onmessage=event=>{let msg=JSON.parse(event.data);if(msg.id&&pending.has(msg.id)){let p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(Error(msg.error.message)):p.resolve(msg.result);}if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails.text);};
  function send(method,params={}){return new Promise((resolve,reject)=>{let id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});}
  async function evalJs(expression){let r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
  async function waitFor(expr){for(let i=0;i<300;i++){if(await evalJs(expr))return;await delay(100);}throw Error('等待页面失败: '+expr+' '+JSON.stringify(await evalJs('({url:location.href,title:document.title,body:document.body.innerText.slice(-1200)})'))+' '+errors.join(','));}
  await send('Runtime.enable');await send('Page.enable');
  await waitFor("document.querySelector('.hero') && window.StudyHub && window.LearningProgress");
  assert.equal(await evalJs("document.querySelector('h1').textContent.includes('Java')"),true);
  for(const width of [320,390,1280]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:850,deviceScaleFactor:1,mobile:width<500});
    for(const hash of ['#/','#/c/c1/s/s1','#/c/c1/ex','#/library','#/review','#/c/c6/s/s1/guide~tree~traversal','#/c/c14/s/s1/guide~graph~dijkstra']){
      await evalJs(`location.hash=${JSON.stringify(hash)}`);await delay(250);
      const metrics=await evalJs('({body:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth})');
      assert.ok(metrics.body<=metrics.viewport+1,`${width} ${hash} 横向溢出 ${JSON.stringify(metrics)}`);
      if (width===390&&hash.includes('guide~tree~traversal')) {await evalJs("document.querySelector('[data-code-expand]').click()");assert.equal(await evalJs("document.querySelector('[data-code-expand]').getAttribute('aria-expanded')"),'true');}
      if ((width===390&&hash.includes('guide~tree~traversal'))||(width===1280&&hash.includes('guide~graph~dijkstra'))) {const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(os.tmpdir(),`java-chapters-${width}.png`),Buffer.from(shot.data,'base64'));}
    }
  }
  const routes=await evalJs("window.COURSE.flatMap(c=>c.sections.map(s=>'#/c/'+c.id+'/s/'+s.id).concat(['#/c/'+c.id+'/quiz','#/c/'+c.id+'/ex','#/c/'+c.id+'/interview']))");
  for(const hash of routes){await evalJs(`location.hash=${JSON.stringify(hash)}`);await delay(40);assert.equal(await evalJs("!!document.querySelector('#content .card')"),true,'路由未渲染: '+hash);}
  const sections=await evalJs("window.COURSE.flatMap(c=>c.sections.map(s=>'#/c/'+c.id+'/s/'+s.id))");
  for(const hash of sections){await evalJs(`location.hash=${JSON.stringify(hash)}`);await delay(40);assert.equal(await evalJs("!!document.querySelector('#lesson-interactions [data-inline-question]')"),true,'小节缺少随堂题: '+hash);}
  const topicRoutes=await evalJs("window.TOPIC_GUIDES.flatMap(t=>t.branches.map(b=>({url:window.TopicGuides.branchHref(t.id,b.id),id:'chapter-guide-'+t.id+'-'+b.id})))");
  for(const route of topicRoutes){await evalJs(`location.hash=${JSON.stringify(route.url)}`);await delay(50);assert.equal(await evalJs(`!!document.getElementById(${JSON.stringify(route.id)})?.open`),true,'章节讲解未打开: '+route.url);}
  await evalJs("location.hash='#/topics/tree/traversal'");await waitFor("document.querySelector('#chapter-guide-tree-traversal[open]')");
  assert.equal(await evalJs("location.hash.startsWith('#/c/c6/s/s1/')"),true);
  assert.equal(await evalJs("!!document.querySelector('.quick-start') && !!document.querySelector('.case-study') && !!document.querySelector('.algorithm-lab')"),true,'原有章节内容应保留');
  assert.equal(await evalJs("document.querySelector('#chapter-guide-tree-traversal .topic-problems a').href.includes('leetcode.cn/problems/')"),true);
  await evalJs("document.querySelector('[data-inline-question=\"tree-order\"] [data-inline-answer=\"0\"]').click()");
  assert.equal(await evalJs("document.querySelector('[data-inline-question=\"tree-order\"] .inline-feedback').textContent.includes('前序')"),true);
  assert.equal(await evalJs("document.activeElement.dataset.inlineAnswer"),'0');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:850,deviceScaleFactor:1,mobile:true});
  await evalJs("document.getElementById('lesson-interactions').scrollIntoView({block:'start'})");await delay(150);
  fs.writeFileSync(path.join(os.tmpdir(),'java-inline-practice-390.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
  assert.equal(await evalJs("document.documentElement.scrollWidth<=document.documentElement.clientWidth+1"),true);
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:850,deviceScaleFactor:1,mobile:false});
  await evalJs("document.querySelector('[data-inline-question=\"tree-order\"] [data-inline-answer=\"1\"]').click()");
  assert.equal(await evalJs("window.LearningProgress.flow().answers['tree-order'].correct"),true);
  assert.equal(await evalJs("window.LearningProgress.flow().answers['tree-order'].attempts"),2);
  await evalJs("document.querySelector('#chapter-guide-tree-traversal [data-review-toggle]').click();document.querySelector('#chapter-guide-tree-traversal [data-problem-done]').click()");
  assert.equal(await evalJs("window.LearningProgress.flow().problems['144']"),true);
  assert.deepEqual(await evalJs("window.AlgorithmLab.demos['tree-inorder'].build('').at(-1).view.result"),['D','B','E','A','C']);
  assert.deepEqual(await evalJs("window.AlgorithmLab.demos['graph-bfs-custom'].build('0-1,0-2,1-2,2-3;0').at(-1).vars.距离"),[0,1,1,2]);
  assert.deepEqual(await evalJs("window.AlgorithmLab.demos['graph-bfs-custom'].build('0-1,1-1;3').at(-1).vars.距离"),[-1,-1,-1,0]);
  await evalJs("document.querySelector('#lesson-demo').scrollIntoView({block:'start'})");await delay(1300);
  assert.equal(await evalJs("window.LearningProgress.flow().resume.section"),'c6/s1');
  await evalJs("document.querySelector('[data-topic-run]').click()");await waitFor("document.querySelector('.topic-output').textContent.includes('实际运行输出')");
  await evalJs("location.hash='#/review'");await waitFor("document.querySelector('[data-review-note=\"check:tree-order\"]')");
  await evalJs("(()=>{let n=document.querySelector('[data-review-note=\"check:tree-order\"]');n.value='中序先左后根';n.dispatchEvent(new Event('input',{bubbles:true}));})()");
  assert.equal(await evalJs("window.LearningProgress.flow().reviews['check:tree-order'].note"),'中序先左后根');
  await evalJs("document.querySelector('[data-review-done=\"check:tree-order\"]').click()");
  assert.equal(await evalJs("window.LearningProgress.flow().reviews['check:tree-order'].dueAt > Date.now()"),true);
  await evalJs("location.hash='#/'");await waitFor("document.querySelector('.resume-card [data-nav]')");
  await evalJs("document.querySelector('.resume-card [data-nav]').click()");await waitFor("location.hash.includes('resume~')");
  await evalJs("window.LearningProgress.toggleBookmark('topic-tree-traversal');location.hash='#/review'");await waitFor("document.querySelector('[data-review-unbookmark=\"topic-tree-traversal\"]')");
  await evalJs("document.querySelector('[data-review-unbookmark=\"topic-tree-traversal\"]').closest('.review-item').querySelector('[data-nav]').click()");await waitFor("document.querySelector('#chapter-guide-tree-traversal[open]')");
  await evalJs("location.hash='#/library?q=%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88'");await waitFor("document.querySelector('.library-results').textContent.includes('树与树形结构')");
  await evalJs("location.hash='#/c/c1/quiz'"); await waitFor("document.querySelector('[data-answer]')");
  await evalJs("(()=>{let q=window.COURSE.find(c=>c.id==='c1').quiz[0];document.querySelector('[data-answer=\"0:'+((q.answer+1)%q.options.length)+'\"]').click()})()");
  assert.equal(await evalJs("!!document.querySelector('[data-quiz-retry]')"),true);
  await evalJs("location.hash='#/review'");await waitFor("document.querySelector('.review-item')");
  assert.equal(await evalJs("document.querySelector('#content').textContent.includes('待复习 · 1')"),true);
  await evalJs("location.hash='#/c/c1/quiz'");await waitFor("document.querySelector('[data-quiz-retry]')");
  await evalJs("document.querySelector('[data-quiz-retry]').click();let q=window.COURSE.find(c=>c.id==='c1').quiz[0];document.querySelector('[data-answer=\"0:'+q.answer+'\"]').click()");
  await evalJs("location.hash='#/library'");await waitFor("document.querySelector('[data-bookmark]')");
  await evalJs("document.querySelector('[data-bookmark]').click();location.hash='#/review'");await waitFor("document.querySelector('[data-review-unbookmark]')");
  await send('Page.reload');await waitFor("document.querySelector('[data-review-unbookmark]')");
  await evalJs("location.hash='#/c/c1/ex'");await waitFor("document.querySelector('[data-ex-test]')");
  await evalJs("(()=>{let ex=window.COURSE.find(c=>c.id==='c1').exercises[0],ta=document.getElementById('code-'+ex.id);ta.value=ex.solution;ta.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-ex-test=\"'+ex.id+'\"]').click();})()");
  await waitFor("document.querySelector('[data-ex-status]').textContent.includes('已通过全部公开测试')");
  await evalJs("(()=>{let ta=document.querySelector('textarea.java-editor');ta.value+='\\n// edited';ta.dispatchEvent(new Event('input',{bubbles:true}));})()");
  assert.equal(await evalJs("document.querySelector('[data-ex-status]').textContent.includes('重新') || document.querySelector('[data-ex-status]').textContent.includes('已修改')"),true);
  await evalJs("(()=>{let ta=document.querySelector('textarea.java-editor'),id=ta.id.slice(5);document.dispatchEvent(new CustomEvent('learning:test-result',{detail:{id,code:ta.value,result:{passed:0,total:1,results:[{state:'wrong_answer',input:'sample'}]}}}));})()");
  await evalJs("location.hash='#/review'");await waitFor("document.querySelector('#content').textContent.includes('sample')");
  await evalJs("location.hash='#/'");await waitFor("document.querySelector('[data-export-progress]')");
  await evalJs("window.confirm=()=>true;window.backupBlob=null;URL.createObjectURL=b=>(window.backupBlob=b,'blob:test');HTMLAnchorElement.prototype.click=function(){};document.querySelector('[data-export-progress]').click()");
  let backup=await evalJs("backupBlob.text()");assert.equal(JSON.parse(backup).app,'java-advanced-learn');
  const savedFlow=JSON.parse(JSON.parse(backup).stores['java-advanced-progress-v1']).learningFlow;
  assert.equal(savedFlow.reviews['check:tree-order'].note,'中序先左后根');assert.equal(savedFlow.problems['144'],true);
  await evalJs(`(()=>{let f=new File([${JSON.stringify(backup)}],'backup.json',{type:'application/json'}),d=new DataTransfer();d.items.add(f);let input=document.getElementById('progressBackupFile');input.files=d.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await delay(500);await waitFor("document.querySelector('[data-export-progress]')");
  await evalJs("location.hash='#/review'");await waitFor("document.querySelector('[data-review-unbookmark]')");
  assert.equal(await evalJs("window.LearningProgress.flow().reviews['check:tree-order'].note"),'中序先左后根');
  const legacy=JSON.parse(backup),oldProgress=JSON.parse(legacy.stores['java-advanced-progress-v1']);delete oldProgress.learningFlow;legacy.stores['java-advanced-progress-v1']=JSON.stringify(oldProgress);
  await evalJs("location.hash='#/'");await waitFor("document.getElementById('progressBackupFile')");
  await evalJs(`(()=>{window.confirm=()=>true;let f=new File([${JSON.stringify(JSON.stringify(legacy))}],'old-backup.json',{type:'application/json'}),d=new DataTransfer();d.items.add(f);let input=document.getElementById('progressBackupFile');input.files=d.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await delay(500);await waitFor("document.getElementById('progressBackupFile')");
  assert.equal(await evalJs("window.LearningProgress.flow().version"),1);
  assert.equal(await evalJs("window.LearningProgress.bookmarked('topic-tree-traversal')"),true);
  await evalJs("location.hash='#/c/c1/ex'");await waitFor("document.querySelector('textarea.java-editor')");
  await evalJs("Storage.prototype.setItem=function(){throw new Error('quota')};let ta=document.querySelector('textarea.java-editor');ta.value+='x';ta.dispatchEvent(new Event('input',{bubbles:true}))");
  assert.equal(await evalJs("!document.getElementById('storageWarning').hidden"),true);
  assert.equal(await evalJs("document.querySelector('[data-ex-save]').textContent.includes('保存失败')"),true);
  assert.deepEqual(errors,[]);socket.close();console.log('Edge：320/390/1280px 路由、真实公开测试、代码修改、错题重做、收藏、备份恢复和存储失败提示通过。');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{if(browser)browser.kill();server.kill();});
