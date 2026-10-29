(function(root){
  'use strict';
  var J=String.raw,pairs=[];
  function ints(text,max){var a=text.trim().split(/[,，\s]+/).filter(Boolean).map(Number);if(!a.length||a.length>(max||16)||a.some(function(x){return !Number.isInteger(x)||Math.abs(x)>99;}))throw Error('请输入 1~'+(max||16)+' 个 -99~99 的整数。');return a;}
  function arr(a){return 'new int[]{'+a.join(',')+'}';}
  function rec(){return {frames:[],operations:0,result:null,push:function(anchor,text,values,vars){this.frames.push(JSON.parse(JSON.stringify({anchor:anchor,text:text,values:values||[],vars:vars||{},operations:this.operations})));}};}
  function define(meta,parse,methods,args,arrayResult,model){
    meta.parse=parse;meta.methods=methods;
    meta.build=function(text){var input=parse(text),runs=model(input);runs.forEach(function(run,i){var name='Compare'+meta.id.replace(/(^|-)(\w)/g,function(_,a,b){return b.toUpperCase();})+(i?'Optimized':'Direct');var expression='solve('+args(input)+')';run.code='import java.util.*;\n\npublic class '+name+' {\n'+methods[i]+'\n    public static void main(String[] args){\n        System.out.println('+(arrayResult?'Arrays.toString('+expression+')':expression)+');\n    }\n}';run.frames.forEach(function(f){f.line=run.code.split('\n').findIndex(function(line){return line.indexOf(f.anchor)>=0;})+1;if(!f.line)throw Error('缺少代码行：'+meta.id+' '+f.anchor);});});return {input:input,runs:runs};};
    pairs.push(meta);
  }
  define({id:'next-greater',title:'右侧首个更大值',chapterId:'c2',tags:['单调栈','数组'],input:'2,1,2,4,3',hint:'整数数组，最多 16 项',labels:['逐项向右扫描','单调栈'],complexity:['时间 O(n²)，额外空间 O(n)','时间 O(n)，额外空间 O(n)'],units:['数值比较','数值比较'],lesson:'当一个新值能同时解决多个旧位置时，单调栈可以避免重复向右查找。'},ints,[J`    public static int[] solve(int[] a){
        int[] answer=new int[a.length];Arrays.fill(answer,-1);
        for(int i=0;i<a.length;i++)for(int j=i+1;j<a.length;j++){
            if(a[j]>a[i]){answer[i]=a[j];break;}
        }
        return answer;
    }`,J`    public static int[] solve(int[] a){
        int[] answer=new int[a.length];Arrays.fill(answer,-1);Deque<Integer> stack=new ArrayDeque<>();
        for(int i=0;i<a.length;i++){
            while(!stack.isEmpty()&&a[i]>a[stack.peek()])answer[stack.pop()]=a[i];
            stack.push(i);
        }
        return answer;
    }`],arr,true,function(a){
    var left=rec(),right=rec(),x=a.map(function(){return -1;}),y=x.slice(),stack=[];
    left.push('int[] answer','初始化全部为 -1。',a);right.push('int[] answer','初始化结果和待处理下标栈。',a);
    a.forEach(function(_,i){for(var j=i+1;j<a.length;j++){left.operations++;if(a[j]>a[i])x[i]=a[j];left.push('if(a[j]>a[i])','比较下标 '+i+' 与 '+j+'。',a,{i:i,j:j,answer:x});if(x[i]!==-1||a[j]>a[i])break;}});
    a.forEach(function(_,i){while(stack.length){var j=stack[stack.length-1];right.operations++;var larger=a[i]>a[j];if(larger)y[stack.pop()]=a[i];right.push('while(!stack.isEmpty()','当前值检查待处理栈顶。',a,{i:i,栈:stack,answer:y});if(!larger)break;}stack.push(i);right.push('stack.push(i)','当前下标入栈。',a,{i:i,栈:stack,answer:y});});
    left.result=x;right.result=y;left.push('return answer','返回结果。',x);right.push('return answer','返回结果。',y);return [left,right];
  });
  function withTarget(text){var p=text.split(';'),a=ints(p[0]);if(p.length!==2||!p[1].trim()||!Number.isInteger(Number(p[1])))throw Error('格式：数组;整数目标。');return {a:a,target:Number(p[1])};}
  define({id:'two-sum',title:'两数之和',chapterId:'c2',tags:['哈希表','数组'],input:'2,7,11,15;9',hint:'数组;目标，例如 2,7,11,15;9',labels:['枚举两数配对','哈希表查补数'],complexity:['时间 O(n²)，额外空间 O(1)','平均时间 O(n)，额外空间 O(n)'],units:['候选配对检查','补数查询'],lesson:'左侧计配对尝试，右侧计哈希查询，分别观察工作量增长。存在多组答案时，两侧可能返回不同的有效下标。'},withTarget,[J`    public static int[] solve(int[] a,int target){
        for(int i=0;i<a.length;i++)for(int j=i+1;j<a.length;j++){
            if(a[i]+a[j]==target)return new int[]{i,j};
        }
        return new int[]{-1,-1};
    }`,J`    public static int[] solve(int[] a,int target){
        Map<Integer,Integer> seen=new HashMap<>();
        for(int i=0;i<a.length;i++){
            if(seen.containsKey(target-a[i]))return new int[]{seen.get(target-a[i]),i};
            seen.put(a[i],i);
        }
        return new int[]{-1,-1};
    }`],function(p){return arr(p.a)+','+p.target;},true,function(p){var l=rec(),r=rec(),seen={},x=[-1,-1],y=x.slice();l.push('public static','准备枚举两个不同下标。',p.a);r.push('Map<Integer','准备补数表。',p.a);outer:for(var i=0;i<p.a.length;i++)for(var j=i+1;j<p.a.length;j++){l.operations++;l.push('if(a[i]+a[j]','检查 '+p.a[i]+'+'+p.a[j]+'。',p.a,{i:i,j:j});if(p.a[i]+p.a[j]===p.target){x=[i,j];break outer;}}for(var k=0;k<p.a.length;k++){r.operations++;var need=p.target-p.a[k];r.push('seen.containsKey','查询补数 '+need+'。',p.a,{i:k,seen:seen});if(Object.prototype.hasOwnProperty.call(seen,need)){y=[seen[need],k];break;}seen[p.a[k]]=k;r.push('seen.put','保存当前值，避免和自己配对。',p.a,{seen:seen});}l.result=x;r.result=y;l.push(x[0]<0?'return new int[]{-1':'if(a[i]+a[j]','返回配对。',x);r.push(y[0]<0?'return new int[]{-1':'seen.containsKey','返回配对。',y);return [l,r];});
  define({id:'search',title:'有序数组查找',chapterId:'c4',tags:['二分','数组'],input:'1,3,5,7,9,11;9',hint:'升序数组;目标',labels:['线性查找','二分查找'],complexity:['时间 O(n)，额外空间 O(1)','时间 O(log n)，额外空间 O(1)'],units:['检查位置','检查位置'],lesson:'二分利用有序性，每次排除约一半候选。这里计检查的位置数，不计分支条件数；重复值的命中位置可以不同。'},function(t){var p=withTarget(t);if(p.a.some(function(x,i){return i&&x<p.a[i-1];}))throw Error('二分示例必须按升序排列。');return p;},[J`    public static int solve(int[] a,int target){
        for(int i=0;i<a.length;i++)if(a[i]==target)return i;
        return -1;
    }`,J`    public static int solve(int[] a,int target){
        int left=0,right=a.length-1;
        while(left<=right){
            int mid=left+(right-left)/2;
            if(a[mid]==target)return mid;
            if(a[mid]<target)left=mid+1;else right=mid-1;
        }
        return -1;
    }`],function(p){return arr(p.a)+','+p.target;},false,function(p){var l=rec(),r=rec(),x=-1,y=-1;l.push('public static','从头扫描。',p.a);r.push('int left','初始化左右边界。',p.a);for(var i=0;i<p.a.length;i++){l.operations++;l.push('for(int i','比较当前值与目标。',p.a,{i:i});if(p.a[i]===p.target){x=i;break;}}var left=0,right=p.a.length-1;while(left<=right){var mid=Math.floor((left+right)/2);r.operations++;r.push('if(a[mid]==target)','比较中点与目标。',p.a,{left:left,right:right,mid:mid});if(p.a[mid]===p.target){y=mid;break;}if(p.a[mid]<p.target)left=mid+1;else right=mid-1;r.push('if(a[mid]<target)','排除一半候选。',p.a,{left:left,right:right});}l.result=x;r.result=y;l.push(x<0?'return -1':'for(int i','查找结束。',p.a,{answer:x});r.push(y<0?'return -1':'if(a[mid]==target)','查找结束。',p.a,{answer:y});return [l,r];});
  define({id:'substring',title:'最长无重复子串',chapterId:'c3',tags:['滑动窗口','字符串'],input:'abcabcbb',hint:'最多 16 个字符',labels:['枚举起点向右扩展','滑动窗口'],complexity:['平均时间 O(n²)，空间 O(字符种类数)','平均时间 O(n)，空间 O(字符种类数)'],units:['字符扫描','字符扫描'],lesson:'重复字符出现时，窗口直接跳过旧位置，避免从每个起点重新扫描。'},function(t){if(t.length>16)throw Error('最多输入 16 个字符。');return t;},[J`    public static int solve(String s){
        int best=0;
        for(int i=0;i<s.length();i++){
            Set<Character> seen=new HashSet<>();
            for(int j=i;j<s.length();j++){
                if(!seen.add(s.charAt(j)))break;
                best=Math.max(best,j-i+1);
            }
        }
        return best;
    }`,J`    public static int solve(String s){
        Map<Character,Integer> last=new HashMap<>();int left=0,best=0;
        for(int right=0;right<s.length();right++){
            char c=s.charAt(right);
            if(last.containsKey(c))left=Math.max(left,last.get(c)+1);
            last.put(c,right);best=Math.max(best,right-left+1);
        }
        return best;
    }`],JSON.stringify,false,function(s){var l=rec(),r=rec(),x=0,y=0,left=0,last={};l.push('int best','最大长度初始为 0。',s.split(''));r.push('Map<Character','准备最近下标表。',s.split(''));for(var i=0;i<s.length;i++){var seen=new Set();for(var j=i;j<s.length;j++){l.operations++;var duplicate=seen.has(s[j]);seen.add(s[j]);if(!duplicate)x=Math.max(x,j-i+1);l.push('if(!seen.add','从起点 '+i+' 扫描字符 '+s[j]+'。',s.split(''),{i:i,j:j,best:x});if(duplicate)break;}}for(var right=0;right<s.length;right++){r.operations++;var c=s[right];if(Object.prototype.hasOwnProperty.call(last,c))left=Math.max(left,last[c]+1);last[c]=right;y=Math.max(y,right-left+1);r.push('last.put','移动窗口并更新长度。',s.split(''),{left:left,right:right,best:y});}l.result=x;r.result=y;l.push('return best','返回最大长度。',s.split(''),{answer:x});r.push('return best','返回最大长度。',s.split(''),{answer:y});return [l,r];});
  define({id:'fibonacci',title:'斐波那契与重复子问题',chapterId:'c5',tags:['递归','动态规划'],input:'8',hint:'整数 n：0~10',labels:['朴素递归','递归 + 记忆化'],complexity:['时间 O(2^n)，递归空间 O(n)','时间 O(n)，缓存和递归空间 O(n)'],units:['函数调用','函数调用'],lesson:'缓存结果后，同一个 n 的数值只需计算一次；命中缓存仍计入一次函数调用。'},function(t){var n=Number(t);if(!t.trim()||!Number.isInteger(n)||n<0||n>10)throw Error('请输入 0~10 的整数。');return n;},[J`    public static int solve(int n){
        if(n<=1)return n;
        return solve(n-1)+solve(n-2);
    }`,J`    public static int solve(int n){int[] memo=new int[n+1];Arrays.fill(memo,-1);return fib(n,memo);}
    private static int fib(int n,int[] memo){
        if(n<=1)return n;
        if(memo[n]!=-1)return memo[n];
        memo[n]=fib(n-1,memo)+fib(n-2,memo);return memo[n];
    }`],String,false,function(n){var l=rec(),r=rec(),memo={};function f(x,depth){l.operations++;l.push('public static','调用 f('+x+')。',[],{n:x,depth:depth});if(x<=1)return x;return f(x-1,depth+1)+f(x-2,depth+1);}function g(x,depth){r.operations++;r.push('private static','调用记忆化 f('+x+')。',[],{n:x,depth:depth,memo:memo});if(x<=1)return x;if(Object.prototype.hasOwnProperty.call(memo,x)){r.push('if(memo[n]!=-1)','命中缓存，不再展开子问题。',[],{n:x,memo:memo});return memo[x];}memo[x]=g(x-1,depth+1)+g(x-2,depth+1);r.push('memo[n]=fib','缓存本次结果。',[],{n:x,memo:memo});return memo[x];}l.result=f(n,0);r.result=g(n,0);l.push(n<=1?'if(n<=1)':'return solve','计算结束。',[],{answer:l.result});r.push(n<=1?'if(n<=1)':'memo[n]=fib','计算结束。',[],{answer:r.result});return [l,r];});
  var rangesHelper=J`    private static int[][] ranges(int n){int[][] q=new int[12][2];for(int i=0;i<12;i++){q[i][0]=i%2==0?0:i%n;q[i][1]=n-1;}return q;}`;
  define({id:'range-sum',title:'多次区间求和',chapterId:'c3',tags:['前缀和','数组'],input:'2,4,6,8,10,12',hint:'整数数组；两侧执行同样的 12 次区间查询',labels:['每次重新遍历区间','前缀和预处理'],complexity:['q 次查询时间 O(qn)，额外空间 O(q)','预处理 O(n)，q 次查询 O(q)，空间 O(n+q)'],units:['输入 / 前缀读取','输入 / 前缀读取'],lesson:'计原输入和前缀数据读取，不计答案累加器。右侧包含预处理的两次读取和每次查询的两次前缀读取。少量短区间查询时，预处理不一定更划算。'},ints,[J`    public static int[] solve(int[] a){
        int[][] queries=ranges(a.length);int[] answer=new int[queries.length];
        for(int i=0;i<queries.length;i++)for(int j=queries[i][0];j<=queries[i][1];j++)answer[i]+=a[j];
        return answer;
    }
`+rangesHelper,J`    public static int[] solve(int[] a){
        int[] pre=new int[a.length+1];for(int i=0;i<a.length;i++)pre[i+1]=pre[i]+a[i];
        int[][] queries=ranges(a.length);int[] answer=new int[queries.length];
        for(int i=0;i<queries.length;i++)answer[i]=pre[queries[i][1]+1]-pre[queries[i][0]];
        return answer;
    }
`+rangesHelper],arr,true,function(a){var l=rec(),r=rec(),x=[],y=[],pre=[0];l.push('int[][] queries','准备相同的 12 次查询。',a);r.push('int[] pre','预处理从空前缀开始。',a);a.forEach(function(v,i){r.operations+=2;pre.push(pre[i]+v);r.push('int[] pre','读取一个原数组元素与一个旧前缀，建立新前缀。',pre,{i:i});});for(var i=0;i<12;i++){var start=i%2===0?0:i%a.length,end=a.length-1,sum=0;for(var j=start;j<=end;j++){sum+=a[j];l.operations++;l.push('answer[i]+=a[j]','为第 '+(i+1)+' 次查询读取 a['+j+']。',a,{left:start,right:end,当前和:sum});}x.push(sum);r.operations+=2;y.push(pre[end+1]-pre[start]);r.push('answer[i]=pre[','读取两个前缀回答第 '+(i+1)+' 次查询。',pre,{left:start,right:end,answer:y});}l.result=x;r.result=y;l.push('return answer','全部查询完成。',x);r.push('return answer','全部查询完成。',y);return [l,r];});
  define({id:'sorting',title:'数组排序',chapterId:'c4',tags:['排序','分治'],input:'6,5,4,3,2,1',hint:'整数数组，最多 16 项',labels:['冒泡排序','归并排序'],complexity:['时间 O(n²)，额外空间 O(1)','时间 O(n log n)，额外空间 O(n)'],units:['数值比较','数值比较'],lesson:'冒泡在原数组中交换；归并先拆分再线性合并。两侧只计元素之间的大小比较。'},ints,[J`    public static int[] solve(int[] a){
        for(int end=a.length-1;end>0;end--)for(int i=0;i<end;i++){
            if(a[i]>a[i+1]){int t=a[i];a[i]=a[i+1];a[i+1]=t;}
        }
        return a;
    }`,J`    public static int[] solve(int[] a){sort(a,0,a.length);return a;}
    private static void sort(int[] a,int l,int r){
        if(r-l<=1)return;int m=(l+r)/2;sort(a,l,m);sort(a,m,r);
        int[] temp=new int[r-l];int i=l,j=m,k=0;
        while(i<m&&j<r)temp[k++]=a[i]<=a[j]?a[i++]:a[j++];
        while(i<m)temp[k++]=a[i++];while(j<r)temp[k++]=a[j++];
        System.arraycopy(temp,0,a,l,temp.length);
    }`],arr,true,function(input){var a=input.slice(),b=input.slice(),l=rec(),r=rec();l.push('public static','准备冒泡。',a);r.push('public static','准备递归拆分。',b);for(var end=a.length-1;end>0;end--)for(var i=0;i<end;i++){l.operations++;if(a[i]>a[i+1])[a[i],a[i+1]]=[a[i+1],a[i]];l.push('if(a[i]>a[i+1])','比较并按需交换相邻元素。',a,{i:i,end:end});}function sort(lo,hi){if(hi-lo<=1)return;var mid=Math.floor((lo+hi)/2);sort(lo,mid);sort(mid,hi);var x=lo,y=mid,temp=[];while(x<mid&&y<hi){r.operations++;temp.push(b[x]<=b[y]?b[x++]:b[y++]);r.push('while(i<m&&j<r)','比较左右有序段的当前元素。',b,{left:x,right:y,临时结果:temp});}while(x<mid)temp.push(b[x++]);while(y<hi)temp.push(b[y++]);b.splice.apply(b,[lo,hi-lo].concat(temp));r.push('System.arraycopy','把合并结果写回原区间。',b,{left:lo,right:hi});}sort(0,b.length);l.result=a;r.result=b;l.push('return a','排序完成。',a);r.push('public static','排序完成并返回。',b);return [l,r];});
  define({id:'knapsack',title:'0-1 背包',chapterId:'c8',tags:['动态规划','背包'],input:'2,3,4;3,4,5;5',hint:'重量数组;价值数组;容量，最多 7 件，容量 0~20',labels:['枚举选 / 不选','容量动态规划'],complexity:['时间 O(2^n)，递归空间 O(n)','时间 O(nC)，额外空间 O(C)'],units:['搜索节点','容量状态更新'],lesson:'左侧计搜索节点，右侧计 dp 更新，计数单位不同。通过增大物品数量观察增长趋势；DP 还受容量 C 影响。'},function(t){var p=t.split(';');if(p.length!==3)throw Error('格式：重量;价值;容量。');var w=ints(p[0],7),v=ints(p[1],7),c=Number(p[2]);if(w.length!==v.length||w.some(function(x){return x<=0;})||v.some(function(x){return x<0;})||!p[2].trim()||!Number.isInteger(c)||c<0||c>20)throw Error('重量必须为正，价值非负，数量相同，容量 0~20。');return {w:w,v:v,c:c};},[J`    public static int solve(int[] w,int[] v,int capacity){return best(w,v,0,capacity);}
    private static int best(int[] w,int[] v,int i,int remaining){
        if(i==w.length)return 0;
        int answer=best(w,v,i+1,remaining);
        if(w[i]<=remaining)answer=Math.max(answer,v[i]+best(w,v,i+1,remaining-w[i]));
        return answer;
    }`,J`    public static int solve(int[] w,int[] v,int capacity){
        int[] dp=new int[capacity+1];
        for(int i=0;i<w.length;i++)for(int c=capacity;c>=w[i];c--)dp[c]=Math.max(dp[c],dp[c-w[i]]+v[i]);
        return dp[capacity];
    }`],function(p){return arr(p.w)+','+arr(p.v)+','+p.c;},false,function(p){var l=rec(),r=rec(),dp=Array(p.c+1).fill(0);function f(i,remaining){l.operations++;l.push('private static','进入选 / 不选子问题。',p.w,{i:i,剩余容量:remaining});if(i===p.w.length)return 0;var best=f(i+1,remaining);if(p.w[i]<=remaining)best=Math.max(best,p.v[i]+f(i+1,remaining-p.w[i]));return best;}l.result=f(0,p.c);r.push('int[] dp','初始化容量状态。',dp);p.w.forEach(function(w,i){for(var c=p.c;c>=w;c--){r.operations++;dp[c]=Math.max(dp[c],dp[c-w]+p.v[i]);r.push('for(int i=0','倒序更新容量，防止本件重复使用。',dp,{物品:i,容量:c});}});r.result=dp[p.c];l.push('return answer','返回最优价值。',[],{answer:l.result});r.push('return dp','返回容量上限内最优价值。',dp,{answer:r.result});return [l,r];});
  if(typeof module!=='undefined'&&module.exports)module.exports=pairs;else root.ALGORITHM_COMPARISONS=pairs;
})(typeof window!=='undefined'?window:this);
