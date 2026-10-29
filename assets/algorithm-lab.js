(function(){
  'use strict';
  var demos={},instances=[];
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function clone(x){return JSON.parse(JSON.stringify(x));}
  function recorder(){var frames=[];return {frames:frames,push:function(line,text,view,vars){frames.push(clone({line:line,text:text,view:view||{},vars:vars||{}}));}};}
  function array(text){var a=text.trim().split(/[,，\s]+/).filter(Boolean).map(Number);if(!a.length||a.length>12||a.some(function(x){return !Number.isInteger(x)||Math.abs(x)>99;}))throw Error('请输入 1~12 个 -99 到 99 的整数，用逗号分隔。');return a;}
  function def(id,title,code,input,label,build){demos[id]={title:title,code:code.split('\n'),input:input,label:label,build:build};}
  def('brackets','括号匹配','for (char c : text.toCharArray()) {\n    if (isLeft(c)) stack.push(c);\n    else if (stack.isEmpty() || !match(stack.pop(),c)) return false;\n}\nreturn stack.isEmpty();','{[()]}','只含 ()[]{}，最多 20 个字符',function(text){
    if(!/^[()\[\]{}]{0,20}$/.test(text))throw Error('只能输入括号 ()[]{}，长度最多 20。');
    var r=recorder(),stack=[],pairs={')':'(',']':'[','}':'{'},a=text.split('');
    r.push(1,'栈为空，开始扫描。',{array:a,stack:stack},{index:0});
    for(var i=0;i<a.length;i++){
      if('([{'.indexOf(a[i])>=0){stack.push(a[i]);r.push(2,'遇到左括号 '+a[i]+'，压入栈顶。',{array:a,marks:{[i]:'当前'},stack:stack},{index:i});}
      else {var top=stack.pop(),ok=top===pairs[a[i]];r.push(3,ok?'栈顶 '+top+' 与 '+a[i]+' 匹配，弹出。':'栈顶与右括号不匹配，结果 false。',{array:a,marks:{[i]:'当前'},stack:stack},{index:i,匹配:ok});if(!ok)return r.frames;}
    }
    r.push(5,stack.length?'仍有左括号未闭合，结果 false。':'栈为空，所有括号正确闭合，结果 true。',{array:a,stack:stack},{result:stack.length===0});return r.frames;
  });
  def('monotonic','单调栈 · 下一个更大值','int[] answer=new int[n]; Arrays.fill(answer,-1);\nfor (int i=0; i<n; i++) {\n    while (!stack.isEmpty() && a[i] > a[stack.peek()]) {\n        answer[stack.pop()] = a[i];\n    }\n    stack.push(i);\n}\nreturn answer;','2,1,2,4,3','整数数组，最多 12 项',function(text){
    var a=array(text),r=recorder(),stack=[],answer=a.map(function(){return -1;});
    r.push(1,'所有答案先设为 -1，栈存未找到答案的下标。',{array:a,stack:[],result:answer},{});
    for(var i=0;i<a.length;i++){
      r.push(3,'用当前值 '+a[i]+' 检查栈顶。',{array:a,marks:{[i]:'i'},stack:stack.map(function(j){return j+':'+a[j];}),result:answer},{i:i});
      while(stack.length&&a[i]>a[stack[stack.length-1]]){var j=stack.pop();answer[j]=a[i];r.push(4,'下标 '+j+' 的右侧首个更大值是 '+a[i]+'，写入答案。',{array:a,marks:{[i]:'当前',[j]:'已解决'},stack:stack.map(function(k){return k+':'+a[k];}),result:answer},{i:i,弹出下标:j});}
      stack.push(i);r.push(6,'当前下标 '+i+' 入栈，等待后面的更大值。',{array:a,marks:{[i]:'入栈'},stack:stack.map(function(j){return j+':'+a[j];}),result:answer},{i:i});
    }
    r.push(8,'扫描完成；仍在栈中的位置右侧没有更大值。',{array:a,stack:stack.map(function(j){return j+':'+a[j];}),result:answer},{answer:answer});return r.frames;
  });
  def('palindrome','回文 · 首尾比较','int left=0, right=s.length()-1;\nwhile (left<right) {\n    if (s.charAt(left)!=s.charAt(right)) return false;\n    left++; right--;\n}\nreturn true;','level','最多 20 个字符',function(text){
    if(text.length>20)throw Error('最多输入 20 个字符。');var a=text.split(''),left=0,right=a.length-1,r=recorder();
    r.push(1,'从首尾开始。',{array:a,marks:{[left]:'left',[right]:'right'}},{left:left,right:right});
    while(left<right){var ok=a[left]===a[right];r.push(3,ok?'两端相同，可以继续向内。':'两端不同，结果 false。',{array:a,marks:{[left]:'left',[right]:'right'}},{left:left,right:right});if(!ok)return r.frames;left++;right--;r.push(4,'左右指针各向内一步。',{array:a,marks:{[left]:'left',[right]:'right'}},{left:left,right:right});}
    r.push(6,'所有对应字符都相同，结果 true。',{array:a},{result:true});return r.frames;
  });
  def('twoSum','双指针 · 有序两数之和','int left=0, right=a.length-1;\nwhile (left<right) {\n    int sum=a[left]+a[right];\n    if (sum==target) return new int[]{left,right};\n    if (sum<target) left++; else right--;\n}\nreturn new int[]{-1,-1};','1,2,4,7;9','有序数组;目标，例如 1,2,4,7;9',function(text){
    var parts=text.split(';'),a=array(parts[0]),target=Number(parts[1]);if(parts.length!==2||!parts[1].trim()||!Number.isInteger(target)||a.some(function(x,i){return i&&x<a[i-1];}))throw Error('请输入升序数组;整数目标值。');
    var left=0,right=a.length-1,r=recorder();r.push(1,'初始化两个端点。',{array:a,marks:{[left]:'left',[right]:'right'}},{target:target});
    while(left<right){var sum=a[left]+a[right];r.push(3,'当前和为 '+sum+'，目标为 '+target+'。',{array:a,marks:{[left]:'left',[right]:'right'}},{left:left,right:right,sum:sum});if(sum===target){r.push(4,'找到两个不同下标。',{array:a,marks:{[left]:'答案',[right]:'答案'}},{下标:[left,right]});return r.frames;}if(sum<target)left++;else right--;r.push(5,'根据和的大小移动一个端点。',{array:a,marks:{[left]:'left',[right]:'right'}},{left:left,right:right});}
    r.push(7,'所有候选已排除，没有配对。',{array:a},{result:[-1,-1]});return r.frames;
  });
  def('hash','哈希表 · 两数之和','Map<Integer,Integer> seen = new HashMap<>();\nfor (int i=0; i<a.length; i++) {\n    int need=target-a[i];\n    if (seen.containsKey(need)) return new int[]{seen.get(need),i};\n    seen.put(a[i],i);\n}\nreturn new int[]{-1,-1};','2,7,11,15;9','数组;目标，例如 2,7,11,15;9',function(text){
    var parts=text.split(';'),a=array(parts[0]),target=Number(parts[1]);if(parts.length!==2||!parts[1].trim()||!Number.isInteger(target))throw Error('格式为 数组;整数目标。');
    var r=recorder(),seen={};r.push(1,'表中尚无元素。',{array:a},{seen:seen});
    for(var i=0;i<a.length;i++){var need=target-a[i];r.push(3,'寻找补数 '+need+'。',{array:a,marks:{[i]:'i'}},{need:need,seen:seen});if(Object.prototype.hasOwnProperty.call(seen,need)){r.push(4,'在历史元素中找到补数，返回两个下标。',{array:a,marks:{[seen[need]]:'答案',[i]:'答案'}},{answer:[seen[need],i]});return r.frames;}seen[a[i]]=i;r.push(5,'补数不存在，记录当前值与下标。',{array:a,marks:{[i]:'入表'}},{seen:seen});}
    r.push(7,'扫描结束，没有配对。',{array:a},{answer:[-1,-1]});return r.frames;
  });
  def('reverse','链表 · 原地反转','Node prev=null, cur=head;\nwhile (cur!=null) {\n    Node next=cur.next;\n    cur.next=prev;\n    prev=cur; cur=next;\n}\nreturn prev;','1,2,3','链表节点值，最多 8 项',function(text){
    var a=array(text);if(a.length>8)throw Error('链表演示最多 8 个节点。');var r=recorder(),links=a.map(function(_,i){return i+1<a.length?i+1:null;}),prev=null,cur=0;
    function view(){return {graph:{labels:a,edges:links.flatMap(function(n,i){return n===null?[]:[[i,n]];}),directed:true},active:cur===null?[]:[cur]};}
    r.push(1,'prev 指向 null，cur 指向表头。',view(),{prev:prev,cur:cur});
    while(cur!==null){var next=links[cur];r.push(3,'先保存原后继 '+next+'。',view(),{prev:prev,cur:cur,next:next});links[cur]=prev;r.push(4,'翻转当前节点的 next 指针。',view(),{prev:prev,cur:cur,next:next});prev=cur;cur=next;r.push(5,'prev 与 cur 向前推进。',view(),{prev:prev,cur:cur});}
    r.push(7,'prev 是新表头，所有边已经反转。',view(),{新表头下标:prev});return r.frames;
  });
  def('window','滑动窗口 · 最长不重复子串','int left=0, best=0;\nfor (int right=0; right<s.length(); right++) {\n    if (last.containsKey(c)) left=Math.max(left,last.get(c)+1);\n    last.put(c,right);\n    best=Math.max(best,right-left+1);\n}\nreturn best;','abba','最多 20 个字符',function(text){
    if(text.length>20)throw Error('最多输入 20 个字符。');var a=text.split(''),left=0,best=0,last={},r=recorder();r.push(1,'初始窗口为空。',{array:a},{left:left,best:best});
    a.forEach(function(c,right){if(Object.prototype.hasOwnProperty.call(last,c))left=Math.max(left,last[c]+1);r.push(3,'处理 '+c+'，左边界只前进、不后退。',{array:a,marks:{[left]:'left',[right]:'right'},range:[left,right]},{left:left,right:right,last:last});last[c]=right;best=Math.max(best,right-left+1);r.push(5,'更新当前最长长度。',{array:a,range:[left,right]},{best:best,当前子串:text.slice(left,right+1)});});r.push(7,'扫描结束。',{array:a},{answer:best});return r.frames;
  });
  def('prefix','前缀和 · 预处理','int[] pre=new int[a.length+1];\nfor (int i=0; i<a.length; i++) {\n    pre[i+1]=pre[i]+a[i];\n}\nint sum=pre[right+1]-pre[left];','2,4,6','整数数组，演示查询整个数组',function(text){
    var a=array(text),pre=a.map(function(){return 0;});pre.unshift(0);var r=recorder();r.push(1,'多建一个位置，pre[0] 表示空前缀。',{array:a,result:pre},{});
    a.forEach(function(x,i){pre[i+1]=pre[i]+x;r.push(3,'pre['+(i+1)+'] = '+pre[i]+' + '+x+' = '+pre[i+1],{array:a,marks:{[i]:'i'},result:pre},{i:i});});r.push(5,'整个数组区间和等于最后前缀减空前缀。',{array:a,result:pre},{sum:pre[a.length]-pre[0]});return r.frames;
  });
  def('binary','二分查找','int left=0, right=a.length-1;\nwhile (left<=right) {\n    int mid=left+(right-left)/2;\n    if (a[mid]==target) return mid;\n    if (a[mid]<target) left=mid+1;\n    else right=mid-1;\n}\nreturn -1;','1,3,5,7,9,11;7','升序数组;目标，例如 1,3,5,7,9,11;7',function(text){
    var p=text.split(';'),a=array(p[0]),target=Number(p[1]);if(p.length!==2||!p[1].trim()||!Number.isInteger(target)||a.some(function(x,i){return i&&x<a[i-1];}))throw Error('请输入升序数组;整数目标。');
    var left=0,right=a.length-1,r=recorder();r.push(1,'在闭区间内查找。',{array:a,range:[left,right]},{target:target});
    while(left<=right){var mid=left+Math.floor((right-left)/2);r.push(3,'取中点，比较 '+a[mid]+' 与 '+target+'。',{array:a,marks:{[left]:'left',[right]:'right',[mid]:'mid'},range:[left,right]},{left:left,right:right,mid:mid});if(a[mid]===target){r.push(4,'命中目标。',{array:a,marks:{[mid]:'答案'}},{answer:mid});return r.frames;}if(a[mid]<target){left=mid+1;r.push(5,'目标更大，排除中点及左侧。',{array:a,range:[left,right]},{left:left,right:right});}else{right=mid-1;r.push(6,'目标更小，排除中点及右侧。',{array:a,range:[left,right]},{left:left,right:right});}}
    r.push(8,'候选区间为空，未找到目标。',{array:a},{answer:-1});return r.frames;
  });
  def('merge','归并排序','if (right-left<=1) return;\nint mid=(left+right)/2;\nsort(a,left,mid); sort(a,mid,right);\nmergeTwoSortedHalves(a,left,mid,right);','4,1,3,2','整数数组，最多 12 项',function(text){
    var a=array(text),r=recorder(),calls=[];
    function sort(l,h){calls.push('['+l+','+h+')');r.push(2,'划分区间 ['+l+','+h+')。',{array:a,range:[l,h-1],stack:calls},{left:l,right:h});if(h-l<=1){r.push(1,'单元素或空区间无需排序。',{array:a,stack:calls},{});calls.pop();return;}var m=Math.floor((l+h)/2);sort(l,m);sort(m,h);var merged=[],i=l,j=m;while(i<m&&j<h){merged.push(a[i]<=a[j]?a[i++]:a[j++]);r.push(4,'比较两侧当前元素，先取较小值。',{array:a,range:[l,h-1],stack:calls,result:merged},{left:i,right:j});}while(i<m)merged.push(a[i++]);while(j<h)merged.push(a[j++]);a.splice.apply(a,[l,h-l].concat(merged));r.push(4,'合并结果写回当前区间。',{array:a,range:[l,h-1],stack:calls},{left:l,mid:m,right:h});calls.pop();}
    sort(0,a.length);r.push(4,'排序完成。',{array:a},{answer:a});return r.frames;
  });
  def('factorial','递归 · 函数调用栈','long factorial(int n) {\n    if (n<=1) return 1;\n    return n*factorial(n-1);\n}','5','输入 1~8 的整数',function(text){var n=Number(text);if(!Number.isInteger(n)||n<1||n>8)throw Error('请输入 1~8。');var r=recorder(),stack=[];
    function f(x){stack.push('f('+x+')');r.push(1,'进入 f('+x+')，创建调用帧。',{stack:stack},{n:x});var answer;if(x<=1){answer=1;r.push(2,'到达终止条件，返回 1。',{stack:stack},{返回值:answer});}else{answer=x*f(x-1);r.push(3,'子调用返回，计算 '+x+' × '+answer/x+' = '+answer+'。',{stack:stack},{返回值:answer});}stack.pop();return answer;}
    var answer=f(n);r.push(3,'所有调用已返回，调用栈为空。',{stack:stack},{answer:answer});return r.frames;});
  def('backtrack','回溯 · 全排列','if (path.size()==n) saveCopy(path);\nfor (int i=0; i<n; i++) if (!used[i]) {\n    used[i]=true; path.add(a[i]);\n    backtrack();\n    path.removeLast(); used[i]=false;\n}','1,2,3','1~4 个互不相同的整数',function(text){var a=array(text);if(a.length>4||new Set(a).size!==a.length)throw Error('请输入 1~4 个互不相同的整数。');var r=recorder(),path=[],used=[],answers=[];
    function go(){if(path.length===a.length){answers.push(path.slice());r.push(1,'保存路径副本。',{array:a,stack:path,result:answers.map(function(x){return x.join('→');})},{答案数:answers.length});return;}a.forEach(function(x,i){if(used[i])return;used[i]=true;path.push(x);r.push(3,'选择 '+x+'。',{array:a,marks:{[i]:'选择'},stack:path},{used:used});go();path.pop();used[i]=false;r.push(5,'撤销 '+x+'，恢复到上一个分支前的状态。',{array:a,stack:path},{used:used});});}
    go();r.push(5,'所有分支完成。',{result:answers.map(function(x){return x.join('→');})},{count:answers.length});return r.frames;});
  ['bfs','dfs'].forEach(function(kind){def(kind,kind==='bfs'?'BFS · 队列分层':'DFS · 栈与深入访问',kind==='bfs'?'queue.offer(start); visited[start]=true;\nwhile (!queue.isEmpty()) {\n    int u=queue.poll(); visit(u);\n    for (int v:neighbors[u]) if (!visited[v]) {\n        visited[v]=true; queue.offer(v);\n    }\n}\nreturn order;':'stack.push(start);\nwhile (!stack.isEmpty()) {\n    int u=stack.pop();\n    if (visited[u]) continue;\n    visited[u]=true; visit(u);\n    pushUnvisitedNeighborsInReverseOrder(u);\n}\nreturn order;',null,'',function(){
    var graph=[[1,2],[3,4],[5],[],[],[]],edges=[[0,1],[0,2],[1,3],[1,4],[2,5]],names=['A','B','C','D','E','F'];
    var r=recorder(),pending=[0],seen=[],order=[],distance=[0];if(kind==='bfs')seen[0]=true;
    function view(u){var v={graph:{labels:names,edges:edges,directed:true,layout:'tree'},active:u===null?[]:[u],visited:seen.map(function(x,i){return x?i:null;}).filter(function(x){return x!==null;}),result:order};v[kind==='bfs'?'queue':'stack']=pending.map(function(i){return names[i];});return v;}
    r.push(1,'从 A 开始。',view(null),{});
    while(pending.length){var u=kind==='bfs'?pending.shift():pending.pop();if(kind==='dfs'&&seen[u])continue;seen[u]=true;order.push(names[u]);r.push(kind==='bfs'?3:5,'访问节点 '+names[u]+'。',view(u),kind==='bfs'?{节点:names[u],距离:distance[u]}:{节点:names[u]});var neighbors=graph[u].slice();if(kind==='dfs')neighbors.reverse();neighbors.forEach(function(v){if(!seen[v]){if(kind==='bfs')seen[v]=true;distance[v]=distance[u]+1;pending.push(v);r.push(kind==='bfs'?5:6,'把未访问邻居 '+names[v]+' 放入'+(kind==='bfs'?'队尾。':'栈顶。'),view(u),{来源:names[u],邻居:names[v]});}});}
    r.push(8,'遍历完成。',view(null),{访问顺序:order});return r.frames;
  });});
  def('windowMax','双端队列 · 窗口最大值','for (int i=0;i<n;i++) {\n    removeExpiredIndicesFromFront();\n    while (!q.isEmpty() && a[q.peekLast()]<=a[i]) q.pollLast();\n    q.offerLast(i);\n    if (i>=k-1) result.add(a[q.peekFirst()]);\n}','1,3,-1,-3,5;3','数组;窗口长度，例如 1,3,-1,-3,5;3',function(text){
    var p=text.split(';'),a=array(p[0]),k=Number(p[1]);if(p.length!==2||!Number.isInteger(k)||k<1||k>a.length)throw Error('窗口长度应为 1 到数组长度之间的整数。');var r=recorder(),q=[],answer=[];
    a.forEach(function(x,i){while(q.length&&q[0]<=i-k){var old=q.shift();r.push(2,'下标 '+old+' 已过期，移出队首。',{array:a,queue:q,result:answer},{i:i});}while(q.length&&a[q[q.length-1]]<=x){var removed=q.pop();r.push(3,'候选 '+removed+' 被更大且更晚过期的 '+i+' 淘汰。',{array:a,queue:q,result:answer},{i:i});}q.push(i);r.push(4,'当前下标入队，队首候选最大。',{array:a,range:[Math.max(0,i-k+1),i],queue:q.map(function(j){return j+':'+a[j];}),result:answer},{i:i});if(i>=k-1){answer.push(a[q[0]]);r.push(5,'记录当前窗口最大值 '+a[q[0]]+'。',{array:a,range:[i-k+1,i],queue:q.map(function(j){return j+':'+a[j];}),result:answer},{i:i});}});return r.frames;
  });
  def('heap','小顶堆 · 保留最大的 K 个','for (int x : a) {\n    minHeap.offer(x);\n    if (minHeap.size()>k) minHeap.poll();\n}\nreturn minHeap.peek();','3,2,1,5,6,4;2','数组;K，例如 3,2,1,5,6,4;2',function(text){var p=text.split(';'),a=array(p[0]),k=Number(p[1]);if(p.length!==2||!Number.isInteger(k)||k<1||k>a.length)throw Error('K 应为 1 到数组长度之间的整数。');var r=recorder(),heap=[];
    function view(i){return {array:a,marks:{[i]:'当前'},graph:{labels:heap,edges:heap.flatMap(function(_,j){return j?[[Math.floor((j-1)/2),j]]:[];}),directed:false,layout:'tree'},result:heap};}
    a.forEach(function(x,i){heap.push(x);var child=heap.length-1;while(child>0){var parent=Math.floor((child-1)/2);if(heap[parent]<=heap[child])break;[heap[parent],heap[child]]=[heap[child],heap[parent]];child=parent;}r.push(2,'加入 '+x+' 并上浮恢复小顶堆。',view(i),{K:k});if(heap.length>k){var removed=heap[0],tail=heap.pop();if(heap.length){heap[0]=tail;var parent=0;while(2*parent+1<heap.length){var c=2*parent+1;if(c+1<heap.length&&heap[c+1]<heap[c])c++;if(heap[parent]<=heap[c])break;[heap[parent],heap[c]]=[heap[c],heap[parent]];parent=c;}}r.push(3,'超过 K 项，弹出最小的 '+removed+' 并下沉恢复堆。',view(i),{K:k});}});r.push(5,'堆顶是第 K 大。',view(a.length-1),{answer:heap[0]});return r.frames;});
  def('greedy','贪心 · 最早结束的会议','sortByEndTime(intervals);\nint end=Integer.MIN_VALUE, count=0;\nfor (Interval m:intervals) {\n    if (m.start>=end) { count++; end=m.end; }\n}',null,'',function(){var r=recorder(),meetings=[[1,2],[1,3],[2,3],[3,5]],end=-999,count=0,chosen=[];r.push(1,'按结束时间排序，优先给后续留下更多空间。',{array:meetings.map(function(x){return '['+x+']';})},{});meetings.forEach(function(m,i){var yes=m[0]>=end;if(yes){end=m[1];count++;chosen.push('['+m+']');}r.push(4,yes?'选择 ['+m+']，更新结束时间。':'与已选会议重叠，跳过 ['+m+']。',{array:meetings.map(function(x){return '['+x+']';}),marks:{[i]:yes?'选择':'跳过'},result:chosen},{end:end,count:count});});return r.frames;});
  def('stairs','动态规划 · 爬楼梯','dp[0]=1; dp[1]=1;\nfor (int i=2; i<=n; i++) {\n    dp[i]=dp[i-1]+dp[i-2];\n}\nreturn dp[n];','5','输入 1~10 的整数',function(text){var n=Number(text);if(!Number.isInteger(n)||n<1||n>10)throw Error('请输入 1~10。');var dp=Array(n+1).fill(0);dp[0]=dp[1]=1;var r=recorder();r.push(1,'空台阶算一种走法，第一阶有一种走法。',{array:dp},{n:n});for(var i=2;i<=n;i++){dp[i]=dp[i-1]+dp[i-2];r.push(3,'最后一步从 '+(i-1)+' 或 '+(i-2)+' 阶过来，两类走法相加。',{array:dp,marks:{[i]:'当前',[i-1]:'前一阶',[i-2]:'前两阶'}},{i:i,走法:dp[i]});}r.push(5,'返回第 n 阶的走法数。',{array:dp},{answer:dp[n]});return r.frames;});
  def('backpack','0-1 背包 · 容量倒序','int[] dp=new int[capacity+1];\nfor (int i=0;i<items;i++) {\n    for (int c=capacity;c>=weight[i];c--) {\n        dp[c]=Math.max(dp[c],dp[c-weight[i]]+value[i]);\n    }\n}\nreturn dp[capacity];',null,'',function(){var weight=[2,3],value=[3,4],capacity=5,dp=Array(6).fill(0),r=recorder();r.push(1,'容量 0~5，所有状态初始为 0。',{array:dp},{weight:weight,value:value});for(var i=0;i<2;i++)for(var c=capacity;c>=weight[i];c--){var old=dp[c],candidate=dp[c-weight[i]]+value[i];dp[c]=Math.max(old,candidate);r.push(4,'物品 '+(i+1)+'，容量 '+c+'：比较不选 '+old+' 与选它 '+candidate+'。',{array:dp,marks:{[c]:'容量',[c-weight[i]]:'读取旧状态'}},{物品:i+1,容量:c,更新值:dp[c]});}r.push(7,'每件物品最多用一次，最大价值为 7。',{array:dp},{answer:dp[5]});return r.frames;});
  def('union','并查集 · 加边与判环','int x=find(a), y=find(b);\nif (x==y) reportCycle();\nelse parent[y]=x;',null, '',function(){var parent=[0,1,2,3],labels=['A','B','C','D'],r=recorder();function find(x){while(parent[x]!==x)x=parent[x];return x;}function view(){return {graph:{labels:labels,edges:parent.flatMap(function(p,i){return p===i?[]:[[i,p]];}),directed:true},result:parent.map(function(p){return labels[p];})};}r.push(1,'每个节点先独立成集合。',view(),{parent:parent});[[0,1],[1,2],[0,2],[2,3]].forEach(function(e){var x=find(e[0]),y=find(e[1]);r.push(1,'检查边 '+labels[e[0]]+'—'+labels[e[1]]+'，找到两端代表元。',view(),{rootA:labels[x],rootB:labels[y]});if(x===y)r.push(2,'已经同属一个集合，这条无向边会形成环。',view(),{成环:true});else{parent[y]=x;r.push(3,'两集合合并。',view(),{成环:false});}});return r.frames;});
  def('topo','拓扑排序 · 入度与队列','enqueueAllZeroIndegreeNodes();\nwhile (!queue.isEmpty()) {\n    int u=queue.poll(); order.add(u);\n    for (int v:neighbors[u]) {\n        if (--indegree[v]==0) queue.offer(v);\n    }\n}\nreturn order.size()==n; ',null,'',function(){var graph=[[1,2],[3],[3],[]],edges=[[0,1],[0,2],[1,3],[2,3]],labels=['A','B','C','D'],degree=[0,1,1,2],q=[0],order=[],r=recorder();function view(u){return {graph:{labels:labels,edges:edges,directed:true},active:u===null?[]:[u],queue:q.map(function(i){return labels[i];}),result:degree};}r.push(1,'只有 A 入度为 0，先入队。',view(null),{order:order});while(q.length){var u=q.shift();order.push(labels[u]);r.push(3,'完成 '+labels[u]+'。',view(u),{order:order});graph[u].forEach(function(v){degree[v]--;if(degree[v]===0)q.push(v);r.push(5,'移除一条先修依赖；'+labels[v]+' 的剩余入度为 '+degree[v]+'。',view(u),{order:order});});}r.push(8,'全部节点已处理，存在合法拓扑序。',view(null),{order:order});return r.frames;});

  var sections={
    'c1/s1':['twoSum','prefix'],'c1/s2':['palindrome'],'c1/s3':['reverse'],
    'c2/s1':['brackets','monotonic','factorial'],'c2/s2':['bfs','windowMax'],'c2/s3':['hash'],
    'c3/s1':['twoSum'],'c3/s2':['window','windowMax'],'c3/s3':['prefix'],
    'c4/s1':['binary'],'c4/s2':['merge'],'c5/s1':['factorial'],'c5/s2':['merge'],'c5/s3':['backtrack'],
    'c6/s1':['bfs','dfs'],'c6/s2':['bfs'],'c6/s3':['dfs'],'c7/s1':['heap'],'c7/s2':['greedy'],
    'c8/s1':['stairs'],'c8/s2':['backpack'],'c9/s1':['bfs','dfs'],'c9/s2':['union'],'c9/s3':['topo']
  };
  function panel(key){var ids=sections[key];if(!ids)return '';return '<section class="algorithm-lab" data-lab="'+key+'" aria-label="算法步骤演示">'
    +'<h3>算法步骤演示</h3><p class="muted small">跟随核心步骤观察变量和数据结构的变化，可与下方完整 Java 案例对照。</p>'
    +'<div class="lab-inputs"><label>选择演示<select data-demo>'+ids.map(function(id){return '<option value="'+id+'">'+esc(demos[id].title)+'</option>';}).join('')+'</select></label><label data-input-label>示例输入<input data-demo-input><small data-input-hint></small><small>修改后自动更新，也可按 Enter 立即更新。</small></label><button class="btn ghost" type="button" data-build>更新演示</button></div>'
    +'<p class="lab-input-status" role="status" data-input-status></p><p class="lab-error" role="alert"></p><div class="lab-controls"><button class="btn ghost" type="button" data-prev>上一步</button><button class="btn" type="button" data-play>自动播放</button><button class="btn ghost" type="button" data-next>下一步</button><button class="btn ghost" type="button" data-first>重置</button><label>速度<select data-speed><option value="1200">慢</option><option value="750" selected>正常</option><option value="350">快</option></select></label></div>'
    +'<label class="lab-scrub">步骤 <span data-step-count></span><input type="range" data-step min="0" max="0" value="0"></label><p class="lab-caption" aria-live="polite"></p>'
    +'<div class="lab-executing" aria-live="polite"><strong data-executing-label>当前执行</strong><span data-executing-line></span><code data-executing-code></code></div>'
    +'<div class="lab-layout"><div class="lab-stage"></div><div class="lab-source"><strong>算法核心步骤 · 箭头指向当前执行行</strong><ol></ol></div></div><dl class="lab-vars"></dl></section>';}
  function chips(items,marks,range){return '<div class="lab-array">'+items.map(function(x,i){var mark=marks&&marks[i];return '<div class="lab-cell '+(mark?'marked ':'')+(range&&i>=range[0]&&i<=range[1]?'in-range':'')+'"><small>'+i+'</small><strong>'+esc(x)+'</strong><span>'+esc(mark||'')+'</span></div>';}).join('')+'</div>';}
  function graphSvg(graph,active,visited,uid){var labels=graph.labels,n=labels.length;if(!n)return '';var width=500,height=230,positions=labels.map(function(_,i){if(graph.layout==='tree'){var level=Math.floor(Math.log2(i+1)),maxLevel=Math.floor(Math.log2(n)),offset=i-(Math.pow(2,level)-1);return [width*(offset+.5)/Math.pow(2,level),height*(level+1)/(maxLevel+2)];}if(n===4&&graph.edges.length===4&&graph.edges.some(function(e){return e[0]===0&&e[1]===2;}))return [[50,115],[210,45],[210,185],[430,115]][i];if(n<=4)return [65+i*115,115];return [65+(i%4)*115,65+Math.floor(i/4)*105];});
    return '<svg class="lab-graph" role="img" aria-label="节点与连接关系" viewBox="0 0 '+width+' '+height+'"><defs><marker id="arrow-'+uid+'" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="currentColor"/></marker></defs>'
      +graph.edges.map(function(e){var a=positions[e[0]],b=positions[e[1]],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1;return '<line x1="'+(a[0]+dx*24/length)+'" y1="'+(a[1]+dy*24/length)+'" x2="'+(b[0]-dx*28/length)+'" y2="'+(b[1]-dy*28/length)+'"'+(graph.directed?' marker-end="url(#arrow-'+uid+')"':'')+'/>'+(e.length>2?'<text class="lab-edge-weight" x="'+((a[0]+b[0])/2-dy*10/length)+'" y="'+((a[1]+b[1])/2+dx*10/length)+'" text-anchor="middle">'+esc(e[2])+'</text>':'');}).join('')
      +labels.map(function(x,i){var p=positions[i];return '<g class="'+((active||[]).includes(i)?'active-node':(visited||[]).includes(i)?'visited-node':'')+'"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="23"/><text x="'+p[0]+'" y="'+(p[1]+5)+'" text-anchor="middle">'+esc(x)+'</text></g>';}).join('')+'</svg>';}
  function stage(view,uid){var html='';if(view.array)html+='<strong>数据 / 状态数组</strong>'+chips(view.array,view.marks,view.range);if(view.graph)html+=graphSvg(view.graph,view.active,view.visited,uid);['stack','queue'].forEach(function(kind){if(view[kind])html+='<div class="lab-structure"><strong>'+(kind==='stack'?'栈：左为栈底，右为栈顶':'队列：左为队头，右为队尾')+'</strong><div class="lab-tokens">'+(view[kind].length?view[kind].map(function(x){return '<span>'+esc(x)+'</span>';}).join(''):'<em>空</em>')+'</div></div>';});if(view.result)html+='<strong>当前结果 / 辅助数组</strong>'+chips(view.result);return html||'<p>等待第一步。</p>';}
  function mountAll(){document.querySelectorAll('[data-lab]').forEach(function(el){
    if(el.dataset.bound)return;el.dataset.bound='1';
    var select=el.querySelector('[data-demo]'),input=el.querySelector('[data-demo-input]'),slider=el.querySelector('[data-step]'),speed=el.querySelector('[data-speed]');
    var frames=[],index=0,timer=null,rebuildTimer=null,composing=false,builtId=null,builtInput=null,uid=el.dataset.lab.replace('/','-');
    function stop(){if(timer)clearInterval(timer);timer=null;el.querySelector('[data-play]').textContent='自动播放';}
    function clearTrace(message){
      frames=[];index=0;slider.value=0;slider.max=0;slider.disabled=true;
      el.querySelector('[data-step-count]').textContent='待生成';
      el.querySelector('.lab-caption').textContent=message;
      el.querySelector('.lab-stage').innerHTML='<p class="muted">'+esc(message)+'</p>';
      el.querySelector('.lab-vars').innerHTML='';
      el.querySelectorAll('.lab-controls button').forEach(function(button){button.disabled=true;});
      el.querySelector('[data-executing-label]').textContent='等待演示';
      el.querySelector('[data-executing-line]').textContent='';
      el.querySelector('[data-executing-code]').textContent='输入有效示例后显示当前代码行。';
      el.querySelectorAll('.lab-source li').forEach(function(li){li.classList.remove('current');li.removeAttribute('aria-current');});
    }
    function render(){
      var frame=frames[index];if(!frame)return;
      el.querySelector('[data-step-count]').textContent=(index+1)+' / '+frames.length;slider.value=index;slider.disabled=false;
      el.querySelector('.lab-caption').textContent=frame.text;el.querySelector('.lab-stage').innerHTML=stage(frame.view,uid);
      el.querySelector('.lab-vars').innerHTML=Object.entries(frame.vars).map(function(pair){return '<div><dt>'+esc(pair[0])+'</dt><dd>'+esc(typeof pair[1]==='object'?JSON.stringify(pair[1]):pair[1])+'</dd></div>';}).join('');
      var demo=demos[builtId],line=demo.code[frame.line-1];
      el.querySelector('[data-executing-label]').textContent=index===frames.length-1?'本步代码 · 演示结束':'本步执行代码';
      el.querySelector('[data-executing-line]').textContent='第 '+frame.line+' 行';
      el.querySelector('[data-executing-code]').textContent=(line||'').trim();
      el.querySelectorAll('.lab-source li').forEach(function(li,i){
        var current=i+1===frame.line;li.classList.toggle('current',current);
        if(current){li.setAttribute('aria-current','step');var list=li.parentElement;if(li.offsetTop<list.scrollTop)list.scrollTop=li.offsetTop;else if(li.offsetTop+li.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=li.offsetTop+li.offsetHeight-list.clientHeight;}
        else li.removeAttribute('aria-current');
      });
      el.querySelector('.lab-controls [data-play]').disabled=false;el.querySelector('[data-first]').disabled=false;
      el.querySelector('[data-prev]').disabled=index===0;el.querySelector('[data-next]').disabled=index===frames.length-1;
    }
    function build(resetInput){
      clearTimeout(rebuildTimer);rebuildTimer=null;stop();var demo=demos[select.value];
      if(resetInput)input.value=demo.input==null?'':demo.input;
      el.querySelector('[data-input-label]').hidden=demo.input==null;input.setAttribute('aria-label',demo.label||'固定示例输入');input.title=demo.label||'';
      el.querySelector('[data-input-hint]').textContent=demo.label||'';
      el.querySelector('.lab-source ol').innerHTML=demo.code.map(function(line){return '<li><span class="lab-line-arrow" aria-hidden="true">▶</span><code>'+esc(line)+'</code></li>';}).join('');
      try{
        var next=demo.build(input.value);if(!next.length)throw new Error('该示例没有可展示的步骤。');
        frames=next;index=0;builtId=select.value;builtInput=input.value;slider.max=frames.length-1;
        el.querySelector('.lab-error').textContent='';
        el.querySelector('[data-input-status]').textContent=(demo.input==null?'固定教学示例':'已应用输入：'+builtInput)+' · 已生成 '+frames.length+' 步';render();return true;
      }catch(e){
        builtId=null;builtInput=null;clearTrace('请修正示例输入后继续。');
        el.querySelector('.lab-error').textContent=e.message;el.querySelector('[data-input-status]').textContent='当前输入无效，旧步骤已清空。';return false;
      }
    }
    function ensureFresh(){if(builtId!==select.value||builtInput!==input.value)return build(false);return frames.length>0;}
    function scheduleBuild(){
      clearTimeout(rebuildTimer);stop();clearTrace('正在根据新输入更新演示…');el.querySelector('.lab-error').textContent='';
      el.querySelector('[data-input-status]').textContent='输入已修改，正在重新生成步骤。';
      if(!composing)rebuildTimer=setTimeout(function(){if(el.isConnected)build(false);},200);
    }
    function play(){
      if(timer){stop();return;}if(!ensureFresh())return;if(index===frames.length-1)index=0;render();el.querySelector('[data-play]').textContent='暂停';
      timer=setInterval(function(){if(!el.isConnected||index>=frames.length-1){stop();return;}if(builtInput!==input.value){build(false);return;}index++;render();if(index===frames.length-1)stop();},Number(speed.value));
    }
    select.addEventListener('change',function(){build(true);});input.addEventListener('input',scheduleBuild);
    input.addEventListener('compositionstart',function(){composing=true;scheduleBuild();});input.addEventListener('compositionend',function(){composing=false;scheduleBuild();});
    input.addEventListener('change',function(){if(!composing&&(builtInput!==input.value||builtId!==select.value))build(false);});
    input.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.isComposing&&!composing){e.preventDefault();build(false);}});
    el.querySelector('[data-build]').addEventListener('click',function(){build(false);});el.querySelector('[data-play]').addEventListener('click',play);
    el.querySelector('[data-prev]').addEventListener('click',function(){stop();if(!ensureFresh())return;index=Math.max(0,index-1);render();});
    el.querySelector('[data-next]').addEventListener('click',function(){stop();if(!ensureFresh())return;index=Math.min(frames.length-1,index+1);render();});
    el.querySelector('[data-first]').addEventListener('click',function(){stop();if(!ensureFresh())return;index=0;render();});
    slider.addEventListener('input',function(){stop();var requested=Number(slider.value);if(!ensureFresh())return;index=Math.max(0,Math.min(frames.length-1,requested));render();});
    speed.addEventListener('change',function(){if(timer){stop();play();}});
    instances.push({stop:stop,dispose:function(){stop();clearTimeout(rebuildTimer);}});build(true);
  });}
  function stopAll(){instances.forEach(function(i){i.dispose();});instances=[];}
  document.addEventListener('visibilitychange',function(){if(document.hidden)instances.forEach(function(i){i.stop();});});
  function register(key,id,title,code,input,hint,build){
    if(demos[id])throw new Error('重复的算法演示：'+id);
    def(id,title,code,input,hint,build);
    (sections[key]||(sections[key]=[])).push(id);
  }
  window.AlgorithmLab={panel:panel,mountAll:mountAll,stopAll:stopAll,demos:demos,sections:sections,register:register};
})();
