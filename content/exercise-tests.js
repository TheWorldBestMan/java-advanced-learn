/* 全部为公开练习测试；网页展示输入与预期，本地 JDK 实际调用学员的方法。 */
(function (root) {
  'use strict';
  var banks = {};
  function literal(value) {
    if (Array.isArray(value)) return 'new int[]{' + value.join(',') + '}';
    return JSON.stringify(value);
  }
  function matrix(value) { return 'new int[][]{' + value.map(function (row) { return '{' + row.join(',') + '}'; }).join(',') + '}'; }
  function add(id, name, method, rows, transform) {
    banks[id] = { className: name, tests: rows.map(function (row, i) {
      var args = row[0], expected = row[1], note = row[2];
      var expression = 'call(subject,"' + method + '",' + args.map(literal).join(',') + ')';
      if (transform) expression = transform(args);
      return { id: id + '-t' + (i + 1), input: JSON.stringify(args), expected: String(expected), note: note,
        setup: 'Object subject=new ' + name + '();', expression: expression };
    }) };
  }
  add('ex-c1-1','ReverseString','reverseString',[
    [['hello'],'olleh','普通字符串'],[[''],'','空数组'],[['a'],'a','单元素'],[['ab'],'ba','偶数长度'],[['level'],'level','回文不改变']
  ],function(a){return 'reverseText(subject,'+literal(a[0])+')';});
  add('ex-c1-2','ReverseList','reverse',[
    [[[1,2,3]],'[3, 2, 1]','普通链表'],[[[]],'[]','空链表'],[[[7]],'[7]','单节点'],[[[1,1,2]],'[2, 1, 1]','重复值'],[[[-2,0,5]],'[5, 0, -2]','负数与零']
  ],function(a){return 'reverseList(subject,'+literal(a[0])+')';});
  add('ex-c1-3','ValidAnagram','isAnagram',[
    [['anagram','nagaram'],true,'相同计数'],[['rat','car'],false,'不同字符'],[['',''],true,'空字符串'],[['a','aa'],false,'长度不同'],[['aacc','abcc'],false,'计数不匹配']
  ]);
  add('ex-c2-1','ValidParentheses','isValid',[
    [['()[]{}'],true,'并列括号'],[['([)]'],false,'错误嵌套'],[[''],true,'空字符串'],[['((('],false,'多余左括号'],[[')('],false,'先出现右括号']
  ]);
  add('ex-c2-2','MyQueue','queue',[
    [['push:1,push:2,push:3,pop,peek'],'[1, 2]','基础 FIFO'],[['empty,push:7,peek,pop,empty'],'[true, 7, 7, true]','空队列状态'],[['push:1,push:2,pop,push:3,pop,pop'],'[1, 2, 3]','交错入队出队'],[['push:5,push:5,pop,pop,empty'],'[5, 5, true]','重复值'],[['push:-1,peek,peek,pop'],'[-1, -1, -1]','peek 不能移除元素']
  ],function(a){return 'queueScenario(subject,'+literal(a[0])+')';});
  add('ex-c2-3','TwoSum','twoSum',[
    [[[2,7,11,15],9],'[0, 1]','普通配对'],[[[3,3],6],'[0, 1]','两个不同下标的重复值'],[[[-3,4,3,90],0],'[0, 2]','正负数'],[[[0,4,3,0],0],'[0, 3]','两个零'],[[[1,5,8,12],20],'[2, 3]','答案在末端']
  ],function(a){return 'sortedIndices((int[])call(subject,"twoSum",'+literal(a[0])+','+a[1]+'))';});
  add('ex-c3-1','TwoSumII','twoSum',[
    [[[2,7,11,15],9],'[1, 2]','下标从 1 开始'],[[[2,3,4],6],'[1, 3]','首尾配对'],[[[-5,-2,0,7],5],'[2, 4]','负数'],[[[1,1],2],'[1, 2]','重复值'],[[[1,4,6,8,10],18],'[4, 5]','右端答案']
  ],function(a){return 'sortedIndices((int[])call(subject,"twoSum",'+literal(a[0])+','+a[1]+'))';});
  add('ex-c3-2','LongestSubstring','lengthOfLongestSubstring',[
    [['abcabcbb'],3,'重复窗口'],[[''],0,'空字符串'],[['bbbbb'],1,'全部相同'],[['abba'],2,'左边界不能倒退'],[['pwwkew'],3,'子串必须连续']
  ]);
  add('ex-c3-3','NumArray','sumRange',[
    [[[-2,0,3,-5,2,-1],0,2],1,'前缀区间'],[[[-2,0,3,-5,2,-1],2,5],-1,'内部到末尾'],[[[7],0,0],7,'单元素'],[[[1,2,3],1,1],2,'单点查询'],[[[-1,-2,-3],0,2],-6,'全负数']
  ],function(a){return 'call(subject,"sumRange",'+a[1]+','+a[2]+')';});
  banks['ex-c3-3'].tests.forEach(function(t){var a=JSON.parse(t.input);t.setup='Object subject=new NumArray('+literal(a[0])+');';});
  add('ex-c4-1','BinarySearch','search',[
    [[[1,3,5,7,9,11],7],3,'命中中间'],[[[1,3,5],4],-1,'目标不存在'],[[[],1],-1,'空数组'],[[[8],8],0,'单元素命中'],[[[1,3,5],5],2,'最后一个元素']
  ]);
  add('ex-c4-2','SearchRange','searchRange',[
    [[[5,7,7,8,8,10],8],'[3, 4]','重复段'],[[[5,7,7,8],6],'[-1, -1]','目标不存在'],[[[],0],'[-1, -1]','空数组'],[[[2,2,2],2],'[0, 2]','全部相同'],[[[1],1],'[0, 0]','单元素']
  ],function(a){return 'Arrays.toString((int[])call(subject,"searchRange",'+literal(a[0])+','+a[1]+'))';});
  var kth=[[[[3,2,1,5,6,4],2],5,'普通第 K 大'],[[[3,2,3,1,2,4,5,5,6],4],4,'重复元素也占名次'],[[[7],1],7,'单元素'],[[[-5,-1,-3],2],-3,'全负数'],[[[9,1,8],3],1,'K 等于数组长度']];
  add('ex-c4-3','KthLargest','findKthLargest',kth); add('ex-c7-1','KthLargest','findKthLargest',kth);
  add('ex-c5-1','Fibonacci','fib',[
    [[10],55,'普通值'],[[0],0,'n=0'],[[1],1,'n=1'],[[2],1,'首次递推'],[[20],6765,'较大输入']
  ]);
  function canonical(rows,sortInside){return rows.map(function(r){return JSON.stringify(sortInside?r.slice().sort(function(a,b){return a-b;}):r).replace(/,/g,', ');}).sort().join(' | ');}
  function permutations(a){if(!a.length)return [[]];var r=[];a.forEach(function(x,i){permutations(a.filter(function(_,j){return i!==j;})).forEach(function(p){r.push([x].concat(p));});});return r;}
  function subsets(a){var r=[[]];a.forEach(function(x){r=r.concat(r.map(function(p){return p.concat(x);}));});return r;}
  add('ex-c5-2','Permutations','permute',[[1,2,3],[],[5],[1,2],[-1,0,2]].map(function(a){return [[a],canonical(permutations(a),false),'比较全部排列，忽略答案列表的排列顺序'];}),function(a){return 'canonical(call(subject,"permute",'+literal(a[0])+'),false)';});
  add('ex-c5-3','Subsets','subsets',[[1,2,3],[],[5],[1,2],[-1,0]].map(function(a){return [[a],canonical(subsets(a),true),'比较全部子集，忽略子集与答案列表的顺序'];}),function(a){return 'canonical(call(subject,"subsets",'+literal(a[0])+'),true)';});
  function treeExpr(a,method){return 'treeCall(subject,"'+method+'",new Integer[]{'+a[0].map(function(x){return x===null?'null':x;}).join(',')+'})';}
  add('ex-c6-1','MaxDepth','maxDepth',[
    [[[3,9,20,null,null,15,7]],3,'普通树'],[[[]],0,'空树'],[[[1]],1,'单节点'],[[[1,2,null,3]],3,'左侧长链'],[[[1,null,2,null,3,null,4]],4,'右侧长链']
  ],function(a){return treeExpr(a,'maxDepth');});
  add('ex-c6-2','LevelOrder','levelOrder',[
    [[[3,9,20,null,null,15,7]],'[[3], [9, 20], [15, 7]]','按层分组'],[[[]],'[]','空树'],[[[1]],'[[1]]','单节点'],[[[1,2,3]],'[[1], [2, 3]]','两层'],[[[1,null,2,null,3]],'[[1], [2], [3]]','单侧链']
  ],function(a){return treeExpr(a,'levelOrder');});
  add('ex-c6-3','NumIslands','numIslands',[
    [[['110','010','101']],3,'三块陆地'],[[['000','000']],0,'全水'],[[['11','11']],1,'全陆地'],[[['10','01']],2,'对角不算相连'],[[['1']],1,'单格陆地']
  ],function(a){return 'call(subject,"numIslands",(Object)new char[][]{'+a[0].map(function(s){return literal(s)+'.toCharArray()';}).join(',')+'})';});
  add('ex-c7-2','FindContentChildren','findContentChildren',[
    [[[1,2,3],[1,1]],1,'饼干不足'],[[[1,2],[1,2,3]],2,'饼干充足'],[[[1],[]],0,'没有饼干'],[[[],[1]],0,'没有孩子'],[[[3,1,2],[3,1,2]],3,'需要排序']
  ]);
  add('ex-c7-3','CanJump','canJump',[
    [[[2,3,1,1,4]],true,'能够到达'],[[[3,2,1,0,4]],false,'被零阻断'],[[[0]],true,'已经在终点'],[[[0,1]],false,'起点不能前进'],[[[2,0,0]],true,'恰好到达终点']
  ]);
  add('ex-c8-1','ClimbStairs','climbStairs',[[[5],8,'普通值'],[[1],1,'一阶'],[[2],2,'两阶'],[[3],3,'首次递推'],[[10],89,'较大输入']]);
  add('ex-c8-2','MaxSubArray','maxSubArray',[
    [[[-2,1,-3,4,-1,2,1,-5,4]],6,'跨多个元素'],[[[-5,-2,-8]],-2,'全负数'],[[[7]],7,'单元素'],[[[1,2,3]],6,'全正数'],[[[0,-1,0]],0,'最大和为零']
  ]);
  add('ex-c8-3','LCS','longestCommonSubsequence',[
    [['abcde','ace'],3,'普通序列'],[['','abc'],0,'空字符串'],[['abc','abc'],3,'完全相同'],[['abc','def'],0,'没有共同字符'],[['aaaa','aa'],2,'重复字符']
  ]);
  add('ex-c9-1','Provinces','findCircleNum',[
    [[[[1,1,0],[1,1,0],[0,0,1]]],2,'两个分量'],[[[[1]]],1,'单节点'],[[[[1,0,0],[0,1,0],[0,0,1]]],3,'全部独立'],[[[[1,1,1],[1,1,1],[1,1,1]]],1,'全部连通'],[[[[1,1,0],[1,1,1],[0,1,1]]],1,'间接连通']
  ],function(a){return 'call(subject,"findCircleNum",(Object)'+matrix(a[0])+')';});
  add('ex-c9-2','CourseSchedule','canFinish',[
    [[2,[[1,0]]],true,'单向依赖'],[[2,[[1,0],[0,1]]],false,'两点环'],[[3,[]],true,'没有依赖'],[[1,[[0,0]]],false,'自环'],[[4,[[1,0],[2,1],[3,2]]],true,'依赖链']
  ],function(a){return 'call(subject,"canFinish",'+a[0]+','+matrix(a[1])+')';});
  add('ex-c9-3','RedundantConnection','findRedundantConnection',[
    [[[[1,2],[1,3],[2,3]]],'[2, 3]','三角形'],[[[[1,2],[2,3],[3,4],[1,4],[1,5]]],'[1, 4]','较长环'],[[[[1,2],[2,3],[3,1]]],'[3, 1]','最后一边闭环'],[[[[1,2],[1,3],[1,4],[2,4]]],'[2, 4]','分支之间闭环'],[[[[1,2],[2,3],[3,4],[4,5],[2,5]]],'[2, 5]','链尾连回中间']
  ],function(a){return 'Arrays.toString((int[])call(subject,"findRedundantConnection",(Object)'+matrix(a[0])+'))';});
  if (typeof module !== 'undefined' && module.exports) module.exports = banks;
  else root.EXERCISE_TESTS = banks;
})(typeof window !== 'undefined' ? window : this);
