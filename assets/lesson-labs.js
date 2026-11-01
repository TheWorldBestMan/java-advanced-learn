(function(){
  'use strict';
  var lab=window.AlgorithmLab;
  function snapshot(value){return JSON.parse(JSON.stringify(value));}
  lab.register('c6/s1','tree-inorder','二叉树中序 · 调用栈与访问顺序',
    'void inorder(Node node) {\n    if (node == null) return;\n    inorder(node.left);\n    visit(node);\n    inorder(node.right);\n}',null,'固定示例：A 的孩子是 B、C，B 的孩子是 D、E。',function(){
      var labels=['A','B','C','D','E'],edges=[[0,1],[0,2],[1,3],[1,4]],children=[[1,2],[3,4],[null,null],[null,null],[null,null]],stack=[],order=[],frames=[];
      function push(line,text,active){frames.push(snapshot({line:line,text:text,view:{graph:{labels:labels,edges:edges,directed:true,layout:'tree'},active:active==null?[]:[active],stack:stack,result:order},vars:{调用栈:stack,访问顺序:order}}));}
      function visit(i){if(i==null)return;stack.push(labels[i]);push(2,'进入节点 '+labels[i]+'，先处理左子树。',i);if(children[i][0]!=null){push(3,'进入 '+labels[i]+' 的左子树。',i);visit(children[i][0]);}order.push(labels[i]);push(4,'左子树已完成，现在访问 '+labels[i]+'。',i);if(children[i][1]!=null){push(5,'进入 '+labels[i]+' 的右子树。',i);visit(children[i][1]);}stack.pop();push(6,'节点 '+labels[i]+' 的左右子树已处理，返回上一层。',i);}
      visit(0);push(6,'中序遍历完成：D、B、E、A、C。',null);return frames;
    });
  lab.register('c9/s1','graph-bfs-custom','无向图 BFS · 输入边与起点',
    'dist[start]=0; queue.offer(start);\nwhile (!queue.isEmpty()) {\n    int u=queue.poll();\n    for (int v:graph[u]) if (dist[v]<0) {\n        dist[v]=dist[u]+1; queue.offer(v);\n    }\n}', '0-1,0-2,1-2,2-3;0','无向边;起点，例如 0-1,0-2,1-2,2-3;0。节点编号 0～5。',function(text){
      var parts=text.trim().split(';');if(parts.length!==2||!/^\d+$/.test(parts[1].trim()))throw Error('格式为 边,边;起点，例如 0-1,1-2;0。');
      var start=Number(parts[1].trim()),raw=parts[0].trim(),edges=[];
      if(raw)raw.split(/[,，]/).forEach(function(s){var match=/^\s*(\d+)\s*-\s*(\d+)\s*$/.exec(s);if(!match)throw Error('每条边格式为 0-1，节点编号 0～5。');edges.push([Number(match[1]),Number(match[2])]);});
      if(edges.length>15||start>5||edges.some(function(e){return e[0]>5||e[1]>5;}))throw Error('节点编号为 0～5，最多输入 15 条边。');
      var n=Math.max(start+1,...edges.flat().map(function(x){return x+1;})),graph=Array.from({length:n},function(){return [];});edges.forEach(function(e){graph[e[0]].push(e[1]);if(e[0]!==e[1])graph[e[1]].push(e[0]);});
      var dist=Array(n).fill(-1),queue=[start],frames=[],labels=Array.from({length:n},function(_,i){return String(i);});dist[start]=0;
      function push(line,text,current){frames.push(snapshot({line:line,text:text,view:{graph:{labels:labels,edges:edges},active:current==null?[]:[current],visited:dist.map(function(d,i){return d<0?null:i;}).filter(function(x){return x!==null;}),queue:queue.map(String),result:dist},vars:{起点:start,距离:dist}}));}
      push(1,'起点 '+start+' 距离为 0，入队时即标记。',null);
      while(queue.length){var u=queue.shift();push(3,'取出节点 '+u+'，检查它的邻居。',u);graph[u].forEach(function(v){if(dist[v]<0){dist[v]=dist[u]+1;queue.push(v);push(5,'首次发现 '+v+'，距离为 '+dist[v]+'，加入队尾。',u);}else push(4,'节点 '+v+' 已发现，跳过；避免环导致重复入队。',u);});}
      push(7,'遍历结束；-1 表示从起点不可达。',null);return frames;
    });
  ['c6/s1','c9/s1'].forEach(function(key){var choices=lab.sections[key];choices.unshift(choices.pop());});
})();
