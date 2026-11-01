(function () {
  'use strict';
  var topics = window.TOPIC_GUIDES || [], data = window.CHAPTER_DEEPENING;
  var exampleBranch = {'tree-depth':'tree/traversal','tree-levels':'tree/level-order','graph-bfs':'graph/unweighted','graph-topo':'graph/topological'};
  var checkSections = {
    tree:['c6/s1','c6/s2','c6/s3'],graph:['c9/s1','c14/s1','c14/s2'],array:['c3/s3','c3/s3'],
    'linked-list':['c1/s3','c1/s3'],'hash-stack':['c2/s3','c11/s1'],window:['c3/s2','c7/s2'],
    recursion:['c5/s3','c5/s1'],'sort-search':['c4/s1','c4/s1'],dp:['c8/s2','c8/s2'],
    'heap-greedy':['c7/s1','c7/s2'],strings:['c12/s1','c1/s2'],bit:['c10/s2','c10/s2'],range:['c3/s3','c13/s2']
  };
  var related = {
    'c6/s1':[['树的路径与最近公共祖先','tree','path'],['树的层序遍历','tree','level-order'],['树形动态规划','tree','tree-dp'],['树状数组与线段树','tree','range-tree']],
    'c9/s1':[['并查集与连通分量','graph','components'],['拓扑排序','graph','topological'],['带权最短路径','graph','dijkstra'],['负权与有限步数','graph','negative'],['最小生成树','graph','mst']]
  };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function branchHref(topic, branch) { var section=data.mapping[topic+'/'+branch]; if(!section)return '#/'; var parts=section.split('/'); return '#/c/'+parts[0]+'/s/'+parts[1]+'/guide~'+topic+'~'+branch; }
  function legacy(parts) { var topic=topics.find(function(t){return t.id===parts[1];}); if(!topic)return '#/'; var branch=topic.branches.find(function(b){return b.id===parts[2];}) || topic.branches[0]; return branchHref(topic.id,branch.id); }
  function code(example) { return '<article class="topic-code" data-topic-example="'+esc(example.id)+'"><h4>'+esc(example.title)+'</h4><p>'+esc(example.description)+'</p><pre><code>'+esc(example.code)+'</code></pre><p><strong>预期输出：</strong></p><pre><code>'+esc(example.output)+'</code></pre><div class="studio-actions"><button class="btn ghost" type="button" data-topic-copy>复制代码</button><button class="btn" type="button" data-topic-run>运行代码</button></div><div class="topic-output" aria-live="polite"></div></article>'; }
  function renderSection(chapterId, sectionId) {
    var section=chapterId+'/'+sectionId, items=[];
    topics.forEach(function(topic){topic.branches.forEach(function(branch){var key=topic.id+'/'+branch.id;if(data.mapping[key]===section)items.push({topic:topic,branch:branch,key:key});});});
    if(!items.length)return '';
    var html='<section class="chapter-deepening" aria-label="知识原理与题型详解"><h3>知识原理与题型详解</h3><p class="muted small">结合本节原有概念与案例，展开了解原理、手推过程、注意事项和常见题型。</p>';
    if(related[section])html+='<div class="learning-links chapter-related" aria-label="相关章节">'+related[section].map(function(link){return '<button type="button" class="learning-link" data-nav="'+esc(branchHref(link[1],link[2]))+'">'+esc(link[0])+' →</button>';}).join('')+'</div>';
    items.forEach(function(item,i){var branch=item.branch, extra=data.details[item.key]||[], examples=(item.topic.examples||[]).filter(function(ex){return exampleBranch[ex.id]===item.key;});
      html+='<details class="topic-branch chapter-guide" id="chapter-guide-'+esc(item.topic.id)+'-'+esc(branch.id)+'"><summary><span class="topic-index">'+String(i+1).padStart(2,'0')+'</span><span><strong>'+esc(branch.title)+'</strong><small>'+esc(branch.signal)+'</small></span></summary><div class="topic-content"><h4>核心概念</h4><p>'+esc(branch.core)+'</p><h4>为什么这样做</h4><p>'+esc(extra[0]||'')+'</p><h4>一步步理解</h4><p>'+esc(extra[1]||branch.example)+'</p><h4>解题步骤</h4><ol>'+branch.steps.map(function(s){return '<li>'+esc(s)+'</li>';}).join('')+'</ol><div class="topic-example"><strong>再看一个例子</strong><p>'+esc(branch.example)+'</p></div><h4>注意事项</h4><p>'+esc(branch.pitfalls)+'</p><h4>时间与空间</h4><p>'+esc(branch.cost)+'</p><h4>常见题型与练习</h4><ul class="topic-problems">'+branch.problems.map(function(p){return '<li><a href="https://leetcode.cn/problems/'+esc(p.slug)+'/" target="_blank" rel="noopener noreferrer">'+p.number+'. '+esc(p.name)+' ↗</a><span>'+esc(p.focus)+'</span></li>';}).join('')+'</ul>'+examples.map(code).join('')+'</div></details>';
    });
    var questions=[];topics.forEach(function(t){(t.checks||[]).forEach(function(check,i){if((checkSections[t.id]||[])[i]===section)questions.push(check);});});
    if(questions.length)html+='<div class="chapter-checks"><h4>学完自测</h4><p class="muted small">先自己思考，再展开参考思路。</p>'+questions.map(function(q,i){return '<div class="topic-check"><strong>'+(i+1)+'. '+esc(q[0])+'</strong><details><summary>查看参考思路</summary><p>'+esc(q[1])+'</p></details></div>';}).join('')+'</div>';
    return html+'</section>';
  }
  function mount(host) {
    host.querySelectorAll('[data-topic-example]').forEach(function(article){var example;topics.forEach(function(topic){(topic.examples||[]).forEach(function(x){if(x.id===article.dataset.topicExample)example=x;});});if(!example)return;
      article.querySelector('[data-topic-run]').addEventListener('click',function(){window.LearningTools.run('/run',{code:example.code},article.querySelector('.topic-output'),this);});
      article.querySelector('[data-topic-copy]').addEventListener('click',function(){var button=this;if(!navigator.clipboard){button.textContent='请手动选择代码复制';return;}navigator.clipboard.writeText(example.code).then(function(){button.textContent='已复制';},function(){button.textContent='请手动选择代码复制';});});
    });
  }
  function follow(parts) { if(parts[2]!=='s'||!parts[4]||parts[4].indexOf('guide~')!==0)return false; var pieces=parts[4].split('~'),target=document.getElementById('chapter-guide-'+pieces[1]+'-'+pieces[2]);if(target){target.open=true;requestAnimationFrame(function(){target.scrollIntoView({block:'start'});});}return true; }
  window.TopicGuides={renderSection:renderSection,mount:mount,follow:follow,branchHref:branchHref,legacy:legacy};
})();
