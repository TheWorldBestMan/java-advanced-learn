/* 进阶章节复用统一播放、自动更新与执行行高亮控制器。 */
(function(){
  'use strict';
  var lab=window.AlgorithmLab;
  function record(){var frames=[];return {frames:frames,push:function(line,text,view,vars){frames.push(JSON.parse(JSON.stringify({line:line,text:text,view:view||{},vars:vars||{}})));}};}
  function number(text,min,max){if(!String(text).trim())throw Error('缺少整数。');var n=Number(text);if(!Number.isInteger(n)||n<min||n>max)throw Error('请输入 '+min+' 到 '+max+' 的整数。');return n;}
  function array(text,max){var a=String(text).split(',').map(function(x){return number(x,-1000000,1000000);});if(!a.length||a.length>(max||10))throw Error('演示数组需有 1～'+(max||10)+' 项。');return a;}
  function parts(text,n){var p=text.split(';');if(p.length!==n)throw Error('请按提示用英文分号分隔 '+n+' 部分。');return p;}
  function add(key,id,title,code,input,hint,build){lab.register(key,id,title,code,input,hint,build);}
  add('c10/s1','bitCount','补码 · 每次删除最低位的 1',
    'int count=0;\nwhile (n!=0) {\n    n &= n-1;\n    count++;\n}\nreturn count;',
    '11','输入任意 32 位 int，例如 11、-1、-2147483648',function(text){
      var n=number(text,-2147483648,2147483647),count=0,r=record();
      function view(){return {array:(n>>>0).toString(2).padStart(32,'0').split(''),result:[count]};}
      r.push(1,'按 32 位补码显示输入，从 0 开始计数。',view(),{n:n,count:count});
      while(n!==0){var old=n;n=n&(n-1);r.push(3,'删除 '+old+' 的最低置位，剩余值为 '+n+'。',view(),{n:n,count:count});count++;r.push(4,'删除了一个 1，计数加一。',view(),{n:n,count:count});}
      r.push(6,'全部置位已删除，返回计数。',view(),{answer:count});return r.frames;
    });
  add('c10/s2','subsetMask','状态压缩 · 每个 mask 对应一个子集',
    'int answer=0;\nfor (int mask=0;mask<(1<<n);mask++) {\n    long sum=0;\n    for (int i=0;i<n;i++) {\n        if ((mask & (1<<i))!=0) sum+=nums[i];\n    }\n    if (sum==target) answer++;\n}\nreturn answer;',
    '1,2,3;3','数组;目标和，例如 1,2,3;3（最多 5 项）',function(text){
      var p=parts(text,2),a=array(p[0],5),target=number(p[1],-5000000,5000000),r=record(),answer=0;
      r.push(1,'从空集开始枚举，按下标区分选择。',{array:a},{target:target,answer:answer});
      for(var mask=0;mask<(1<<a.length);mask++){var sum=0,marks={};r.push(3,'mask='+mask+'，本轮累计和归零。',{array:a},{mask:mask.toString(2).padStart(a.length,'0'),sum:sum});for(var i=0;i<a.length;i++)if(mask&(1<<i)){sum+=a[i];marks[i]='选择';r.push(5,'选择下标 '+i+' 的 '+a[i]+'，累计和变为 '+sum+'。',{array:a,marks:marks},{mask:mask,sum:sum});}if(sum===target)answer++;r.push(7,sum===target?'本子集满足目标，数量加一。':'本子集不满足目标。',{array:a,marks:marks,result:[answer]},{sum:sum,target:target,answer:answer});}
      r.push(9,'所有下标集合已枚举。',{array:a,result:[answer]},{answer:answer});return r.frames;
    });
  // 已有的单调队列演示采用同一套下标过期与淘汰规则。
  lab.sections['c11/s1']=['windowMax'];
  add('c11/s2','difference','差分 · 标记端点并还原',
    'long[] diff=new long[n+1];\nfor (int[] u:updates) {\n    diff[u[0]]+=u[2];\n    diff[u[1]+1]-=u[2];\n}\nfor (int i=0;i<n;i++) {\n    running+=diff[i];\n    result[i]=running;\n}\nreturn result;',
    '5;0,2,10|1,4,5','站点数;左端,右端,增量|下一条更新，例如 5;0,2,10|1,4,5',function(text){
      var p=parts(text,2),n=number(p[0],1,10),updates=p[1].trim()?p[1].split('|').map(function(x){var row=array(x,3);if(row.length!==3||row[0]<0||row[1]<row[0]||row[1]>=n)throw Error('更新需为合法的 左端,右端,增量。');return row;}):[];
      if(updates.length>8)throw Error('步骤演示最多 8 条更新。');var diff=Array(n+1).fill(0),answer=[],running=0,r=record();
      r.push(1,'差分末尾多分配一个撤销标记位置。',{array:diff},{n:n});
      updates.forEach(function(u){diff[u[0]]+=u[2];r.push(3,'从 '+u[0]+' 开始增加 '+u[2]+'。',{array:diff,marks:{[u[0]]:'开始'}},{更新:u});diff[u[1]+1]-=u[2];r.push(4,'在 '+(u[1]+1)+' 撤销增量。',{array:diff,marks:{[u[1]+1]:'撤销'}},{更新:u});});
      for(var i=0;i<n;i++){running+=diff[i];r.push(7,'累加差分，当前站点值为 '+running+'。',{array:diff,marks:{[i]:'读取'},result:answer},{i:i,running:running});answer.push(running);r.push(8,'写入站点 '+i+' 的最终值。',{array:diff,result:answer},{i:i});}
      r.push(10,'忽略末尾哨兵，返回 n 个站点的值。',{array:diff,result:answer},{answer:answer});return r.frames;
    });
  add('c12/s1','triePrefix','Trie · 建立路径并查询前缀',
    `Node root=new Node();\nfor (String word:words) {\n    Node p=root; p.pass++;\n    for (char c:word.toCharArray()) {\n        if (p.next[c-'a']==null) p.next[c-'a']=new Node();\n        p=p.next[c-'a']; p.pass++;\n    }\n}\nNode p=root;\nfor (char c:prefix.toCharArray()) {\n    p=p.next[c-'a']; if (p==null) return 0;\n}\nreturn p.pass;`,
    'apple,app,apple,bat;app','词条用逗号分隔;查询前缀，例如 apple,app,apple,bat;app（小写字母，可查询空前缀）',function(text){
      var p=parts(text,2),words=p[0].split(','),query=p[1];if(words.length>6||words.some(function(w){return !/^[a-z]{0,8}$/.test(w);})||!/^[a-z]{0,8}$/.test(query))throw Error('最多 6 个词，每词与前缀最多 8 个小写字母。');
      var root={pass:0,next:{}},counts={'空前缀':0},r=record();function view(word){return {array:words,result:Object.keys(counts).map(function(k){return k+':'+counts[k];}),marks:word==null?{}:{[word]:'插入'}};}
      r.push(1,'根节点代表空前缀；每条路径共享相同前缀。',view(),{});
      words.forEach(function(w,i){var node=root,path='';node.pass++;counts['空前缀']=node.pass;r.push(3,'插入词条 '+(w||'空串')+'，根节点计数加一。',view(i),{词条:w});Array.from(w).forEach(function(c){path+=c;if(!node.next[c]){node.next[c]={pass:0,next:{}};r.push(5,'建立字符 '+c+' 对应路径 '+path+'。',view(i),{路径:path});}node=node.next[c];node.pass++;counts[path]=node.pass;r.push(6,'经过 '+path+' 的词条数加一。',view(i),{路径:path,pass:node.pass});});});
      var node=root,path='';r.push(9,'从根节点开始查询 '+(query||'空前缀')+'。',view(),{查询:query});for(var c of query){path+=c;node=node.next[c];r.push(11,node?'沿 '+path+' 找到节点。':'路径 '+path+' 不存在，返回 0。',view(),{路径:path,pass:node?node.pass:0});if(!node)return r.frames;}
      r.push(13,'返回该前缀的词条数，重复插入分别计数。',view(),{answer:node.pass});return r.frames;
    });
  add('c12/s2','kmp','KMP · 失配时复用相同前后缀',
    'if (pattern.isEmpty()) return 0;\nint[] pi=prefix(pattern);\nfor (int i=0,j=0;i<text.length();i++) {\n    while (j>0 && text.charAt(i)!=pattern.charAt(j)) j=pi[j-1];\n    if (text.charAt(i)==pattern.charAt(j)) j++;\n    if (j==pattern.length()) return i-pattern.length()+1;\n}\nreturn -1;',
    'ababcabcacbab;abcac','文本;模式，例如 ababcabcacbab;abcac（不在文本中使用分号，最多 30/12 个字符）',function(text){
      var p=parts(text,2),s=p[0],pat=p[1],r=record();if(s.length>30||pat.length>12)throw Error('演示文本最多 30 字符，模式最多 12 字符。');if(!pat.length){r.push(1,'空模式按接口约定返回 0。',{array:s.split('')},{answer:0});r.push(1,'空模式在文本开头匹配。',{array:s.split('')},{answer:0});return r.frames;}
      var pi=Array(pat.length).fill(0);for(var i=1,j=0;i<pat.length;i++){while(j>0&&pat[i]!==pat[j])j=pi[j-1];if(pat[i]===pat[j])j++;pi[i]=j;}
      r.push(2,'预处理模式前缀函数，pi 数值表示长度。',{array:pat.split(''),result:pi},{pattern:pat,pi:pi});var j=0;
      for(var i=0;i<s.length;i++){while(j>0&&s[i]!==pat[j]){var old=j;j=pi[j-1];r.push(4,'字符 '+s[i]+' 失配，j 从 '+old+' 回退到 '+j+'；i 保持不变。',{array:s.split(''),marks:{[i]:'比较'},result:pi},{i:i,j:j,pattern:pat});}var matched=s[i]===pat[j];if(matched)j++;r.push(5,matched?'当前字符相等，已匹配长度加一。':'当前字符不匹配且 j=0，继续读文本。',{array:s.split(''),marks:{[i]:'文本'},range:j?[i-j+1,i]:null,result:pi},{i:i,j:j,pattern:pat});if(j===pat.length){r.push(6,'完整匹配，返回起始下标 '+(i-pat.length+1)+'。',{array:s.split(''),range:[i-j+1,i],result:pi},{answer:i-pat.length+1});return r.frames;}}
      r.push(8,'文本扫描结束，未找到模式。',{array:s.split(''),result:pi},{answer:-1});return r.frames;
    });
  function dynamicInput(text){var p=parts(text,3),a=array(p[0],8),u=array(p[1],2),q=array(p[2],2);if(u.length!==2||q.length!==2||u[0]<0||u[0]>=a.length||q[0]<0||q[1]<q[0]||q[1]>=a.length)throw Error('更新下标与查询闭区间必须合法。');return {a:a,index:u[0],value:u[1],left:q[0],right:q[1]};}
  add('c13/s1','fenwick','树状数组 · 单点增量与前缀分解',
    'buildFenwick(initial);\nfor (int i=index+1;i<=n;i+=i&-i) {\n    bit[i]+=delta;\n}\nlong result=0;\nfor (int i=right+1;i>0;i-=i&-i) result+=bit[i];\nfor (int i=left;i>0;i-=i&-i) result-=bit[i];\nreturn result;',
    '1,2,3,4;2,5;1,3','初始数组;更新下标,增量;查询左端,右端，例如 1,2,3,4;2,5;1,3（最多 8 项）',function(text){
      var p=dynamicInput(text),n=p.a.length,bit=Array(n+1).fill(0),r=record();for(var k=0;k<n;k++)for(var i=k+1;i<=n;i+=i&-i)bit[i]+=p.a[k];
      r.push(1,'bit 的 0 位置不使用；每项负责以它结尾的 lowbit 长度区间。',{array:bit},{initial:p.a});
      for(var i=p.index+1;i<=n;i+=i&-i){bit[i]+=p.value;r.push(3,'内部下标 '+i+' 加 '+p.value+'，然后向上跳 lowbit。',{array:bit,marks:{[i]:'更新'}},{i:i,lowbit:i&-i});}
      var sum=0;r.push(5,'开始查询闭区间 ['+p.left+','+p.right+']。',{array:bit},{sum:sum});
      for(var i=p.right+1;i>0;i-=i&-i){sum+=bit[i];r.push(6,'累加前 '+(p.right+1)+' 项中的节点 '+i+'。',{array:bit,marks:{[i]:'相加'}},{i:i,sum:sum});}
      for(var i=p.left;i>0;i-=i&-i){sum-=bit[i];r.push(7,'减去左边界之前的节点 '+i+'。',{array:bit,marks:{[i]:'相减'}},{i:i,sum:sum});}
      r.push(8,'两个前缀相减，得到更新后的区间和。',{array:bit,result:[sum]},{answer:sum});return r.frames;
    });
  add('c13/s2','segmentMax','线段树 · 单点赋值与区间最大值',
    'buildMaxTree(initial);\ntree[size+index]=value;\nfor (int p=(size+index)/2;p>0;p/=2) tree[p]=Math.max(tree[2*p],tree[2*p+1]);\nlong best=Long.MIN_VALUE;\nfor (int l=left+size,r=right+size+1;l<r;l/=2,r/=2) {\n    if ((l&1)==1) best=Math.max(best,tree[l++]);\n    if ((r&1)==1) best=Math.max(best,tree[--r]);\n}\nreturn best;',
    '1,5,3;1,-2;0,2','初始数组;赋值下标,新值;查询左端,右端，例如 1,5,3;1,-2;0,2（最多 8 项）',function(text){
      var p=dynamicInput(text),size=1;while(size<p.a.length)size*=2;var tree=Array(size*2).fill(-Infinity),r=record();for(var i=0;i<p.a.length;i++)tree[size+i]=p.a[i];for(var i=size-1;i>0;i--)tree[i]=Math.max(tree[2*i],tree[2*i+1]);
      function view(at,best){return {array:tree.map(function(x,i){return i===0?'未用':x===-Infinity?'−∞':x;}),marks:at?{[at]:'节点 '+at}:{},result:best==null?[]:[best===-Infinity?'−∞':best]};}
      r.push(1,'根节点编号 1；额外叶子为负无穷，不影响最大值。',view(),{size:size});var pos=size+p.index;tree[pos]=p.value;r.push(2,'叶子赋值为 '+p.value+'，覆盖旧值。',view(pos),{index:p.index,value:p.value});for(pos=Math.floor(pos/2);pos>0;pos=Math.floor(pos/2)){tree[pos]=Math.max(tree[2*pos],tree[2*pos+1]);r.push(3,'重新合并父节点 '+pos+' 的两个孩子。',view(pos),{节点:pos});}
      var best=-Infinity;r.push(4,'查询初值为负无穷，支持全负数。',view(null,best),{left:p.left,right:p.right});for(var l=p.left+size,rr=p.right+size+1;l<rr;l=Math.floor(l/2),rr=Math.floor(rr/2)){if(l&1){best=Math.max(best,tree[l]);r.push(6,'左端是右孩子，纳入节点 '+l+'。',view(l,best),{l:l,r:rr});l++;}if(rr&1){rr--;best=Math.max(best,tree[rr]);r.push(7,'右端为奇数，纳入前一个节点 '+rr+'。',view(rr,best),{l:l,r:rr});}}
      r.push(9,'所有被选节点互不重叠，合并得到最大值。',view(null,best),{answer:best});return r.frames;
    });
  function graphInput(text,hasStart){var p=parts(text,hasStart?3:2),n=number(p[0],1,8),edges=p[1].trim()?p[1].split('|').map(function(row){var e=array(row,3);if(e.length!==3||e[0]<0||e[1]<0||e[0]>=n||e[1]>=n||e[2]<0)throw Error('边应为 起点,终点,非负权重，节点需在范围内。');return e;}):[];if(edges.length>16)throw Error('图演示最多 16 条边。');return {n:n,edges:edges,start:hasStart?number(p[2],0,n-1):0};}
  add('c14/s1','dijkstra','Dijkstra · 最短有效距离优先扩展',
    'dist[start]=0; pq.offer(new long[]{0,start});\nwhile (!pq.isEmpty()) {\n    long[] item=pq.poll(); int u=(int)item[1];\n    if (item[0]!=dist[u]) continue;\n    for (Edge edge:graph[u]) {\n        long next=dist[u]+edge.weight;\n        if (next<dist[edge.to]) {dist[edge.to]=next; pq.offer(new long[]{next,edge.to});}\n    }\n}\nreturn dist;',
    '4;0,1,4|0,2,1|2,1,2|1,3,1;0','节点数;起点,终点,权重|下一条边;起点，例如 4;0,1,4|0,2,1|2,1,2|1,3,1;0',function(text){
      var p=graphInput(text,true),dist=Array(p.n).fill(Infinity),g=Array.from({length:p.n},function(){return [];}),q=[],r=record();p.edges.forEach(function(e){g[e[0]].push(e);});dist[p.start]=0;q.push([0,p.start]);
      function view(u){return {array:dist.map(function(d){return d===Infinity?'∞':d;}),graph:{labels:Array.from({length:p.n},function(_,i){return i;}),edges:p.edges,directed:true},active:u==null?[]:[u],queue:q.slice().sort(function(a,b){return a[0]-b[0];}).map(function(x){return x[1]+':'+x[0];})};}
      r.push(1,'只有起点距离为 0；队列显示 节点:距离。',view(),{start:p.start,边:p.edges});while(q.length){q.sort(function(a,b){return a[0]-b[0];});var item=q.shift(),u=item[1];r.push(3,'取当前最短候选：节点 '+u+'，距离 '+item[0]+'。',view(u),{u:u,d:item[0]});if(item[0]!==dist[u]){r.push(4,'该候选已过期，跳过。',view(u),{当前最优:dist[u]});continue;}g[u].forEach(function(e){var next=dist[u]+e[2];r.push(6,'沿 '+u+'→'+e[1]+'（权重 '+e[2]+'）尝试距离 '+next+'。',view(u),{next:next});if(next<dist[e[1]]){dist[e[1]]=next;q.push([next,e[1]]);r.push(7,'距离更优，更新并加入候选。',view(e[1]),{节点:e[1],距离:next});}});}
      r.push(10,'队列为空；不可达节点在完整 Java 方法中转为 -1。',view(),{answer:dist.map(function(d){return d===Infinity?-1:d;})});return r.frames;
    });
  add('c14/s2','kruskal','Kruskal · 只选择连接不同分量的边',
    'sortEdgesByWeight(edges);\nint selected=0; long total=0;\nfor (Edge e:edges) {\n    int a=find(e.u), b=find(e.v);\n    if (a==b) continue;\n    union(a,b); total+=e.weight; selected++;\n}\nreturn selected==n-1 ? total : -1;',
    '4;0,1,1|1,2,2|0,2,4|2,3,3','节点数;端点,端点,成本|下一条边，例如 4;0,1,1|1,2,2|0,2,4|2,3,3',function(text){
      var p=graphInput(text,false),parent=Array.from({length:p.n},function(_,i){return i;}),edges=p.edges.slice().sort(function(a,b){return a[2]-b[2];}),chosen=[],total=0,r=record();function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
      function view(active){return {array:parent,graph:{labels:Array.from({length:p.n},function(_,i){return i;}),edges:chosen,directed:false},active:active||[],result:chosen.map(function(e){return e[0]+'—'+e[1]+':'+e[2];})};}
      r.push(1,'按成本升序处理，图中逐步显示已选边。',view(),{排序后边:edges});r.push(2,'每个节点先独立成分量，总成本为 0。',view(),{selected:0,total:0});edges.forEach(function(e){var a=find(e[0]),b=find(e[1]);r.push(4,'检查 '+e[0]+'—'+e[1]+'，成本 '+e[2]+'；代表元为 '+a+'、'+b+'。',view([e[0],e[1]]),{代表元:[a,b]});if(a===b)r.push(5,'两端已连通，加入会成环，跳过。',view([e[0],e[1]]),{total:total});else{parent[b]=a;total+=e[2];chosen.push(e);r.push(6,'合并不同分量，累计成本 '+total+'。',view([e[0],e[1]]),{selected:chosen.length,total:total});}});
      var answer=chosen.length===p.n-1?total:-1;r.push(8,answer<0?'选边不足 n-1，图不连通。':'已连通全部节点，返回最小总成本。',view(),{answer:answer});return r.frames;
    });
})();
