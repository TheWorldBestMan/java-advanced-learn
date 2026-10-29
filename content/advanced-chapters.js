/* 第 10～14 章。浏览器与本地 JDK 共用题目及公开测试；沿用既有课程数据结构。 */
(function(root){
  'use strict';
  var chapters=[],banks={},guides={};
  // 经典题目沿用原课程 problems 块；slug 与题目数据一起维护，直接进入对应题目页。
  var classics={
    'c10/s1':[
      [191,'位1的个数','easy','number-of-1-bits','练习 n & (n-1) 删除最低置位。力扣本题限定正整数；本节案例额外演示了负数的 32 位补码。'],
      [136,'只出现一次的数字','easy','single-number','练习异或消去成对元素，解释为何顺序不影响结果，并明确“其他数字恰好出现两次”的前提。'],
      [338,'比特位计数','easy','counting-bits','把单个数字的计数推广到 0..n：尝试 ans[i]=ans[i&(i-1)]+1，复用已经计算的状态。'],
      [201,'数字范围按位与','medium','bitwise-and-of-numbers-range','进阶：寻找 left 与 right 的公共二进制前缀，理解区间内变化的低位为什么最终都会归零。']
    ],
    'c10/s2':[
      [78,'子集','medium','subsets','用 mask 的第 i 位表示是否选择 nums[i]，枚举全部子集。力扣原题元素互不相同，与本节按下标统计重复值的约定区分开。'],
      [318,'最大单词长度乘积','medium','maximum-product-of-word-lengths','把一个单词出现的字母压缩成 26 位集合，用 (maskA & maskB)==0 判断两个单词没有共同字母。'],
      [260,'只出现一次的数字 III','medium','single-number-iii','先异或得到两个唯一数字的差异，再用最低置位划分两组，分别消去成对元素。'],
      [698,'划分为k个相等的子集','medium','partition-to-k-equal-sum-subsets','进阶：用 mask 记录已使用的下标，并记录当前桶内的和；可在学习第 8 章动态规划后尝试状态压缩解法。']
    ],
    'c11/s1':[
      [239,'滑动窗口最大值','hard','sliding-window-maximum','对应本节完整案例：队列保存下标，先删过期队首，再淘汰队尾较小候选；用每个下标至多入出一次证明 O(n)。'],
      [1438,'绝对差不超过限制的最长连续子数组','medium','longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit','同时维护递减最大队列与递增最小队列；差值超限时收缩左边界，核对两个队列的过期条件。'],
      [862,'和至少为 K 的最短子数组','hard','shortest-subarray-with-sum-at-least-k','进阶：数组允许负数，普通正数滑窗不适用。先计算 long 前缀和，再维护前缀和递增的候选下标。'],
      [1425,'带限制的子序列和','hard','constrained-subsequence-sum','综合动态规划与单调队列：队列维护最近 k 个位置的最优 dp，注意允许只选当前元素以及全负数输入。']
    ],
    'c11/s2':[
      [1109,'航班预订统计','medium','corporate-flight-bookings','与预约增量案例对应：在起点加座位数、终点后一位撤销。原题航班从 1 编号，转换到 0-based 后再写差分。'],
      [1094,'拼车','medium','car-pooling','把上车记为正事件、下车记为负事件，扫描累计人数是否超过容量；同一地点先下车的效果可通过事件合并体现。'],
      [2251,'花期内花的数目','hard','number-of-flowers-in-full-bloom','练习闭区间事件：花期 [start,end] 在 end+1 才结束；将事件与查询按时间处理，或用两个有序端点数组二分。'],
      [732,'我的日程安排表 III','hard','my-calendar-iii','先用 TreeMap 差分累计每次预订后的最大重叠数；进一步比较第 13 章动态线段树的做法，注意预订为半开区间。']
    ],
    'c12/s1':[
      [208,'实现 Trie (前缀树)','medium','implement-trie-prefix-tree','先实现 insert、search、startsWith，重点区分“路径存在”与“完整单词 end 标记存在”。'],
      [648,'单词替换','medium','replace-words','对应最短词根案例：沿单词路径第一次遇到 end 就停止，保留找不到词根的原单词。'],
      [211,'添加与搜索单词 - 数据结构设计','medium','design-add-and-search-words-data-structure','在 Trie 上增加通配符搜索：普通字符沿一条边走，遇到点号时递归尝试所有存在的孩子。'],
      [212,'单词搜索 II','hard','word-search-ii','进阶：组合 Trie 与棋盘 DFS。搜索后恢复已访问标记，并用终点标记或结果集合避免重复收录同一个单词。']
    ],
    'c12/s2':[
      [28,'找出字符串中第一个匹配项的下标','easy','find-the-index-of-the-first-occurrence-in-a-string','对应首次匹配案例：构建 pi，失配时回退 j=pi[j-1]，完整匹配时返回 i-m+1；目标时间 O(n+m)。'],
      [459,'重复的子字符串','easy','repeated-substring-pattern','利用最长相等真前后缀长度 b，检查候选周期 n-b 是否能整除 n，并保证 b>0。'],
      [1392,'最长快乐前缀','hard','longest-happy-prefix','前缀函数的直接应用：最终 pi 值就是最长相等真前后缀长度；注意整个字符串不能算作真前缀。'],
      [214,'最短回文串','hard','shortest-palindrome','进阶：对 s、分隔符与 reverse(s) 的组合构建前缀函数，求最长回文前缀；分隔符应保证不在原字符集中。']
    ],
    'c13/s1':[
      [307,'区域和检索 - 数组可修改','medium','range-sum-query-mutable','对应动态区间求和：原题 update 是赋值，需要先算 delta=new-old，再更新树状数组，不能把新值直接当增量。'],
      [315,'计算右侧小于当前元素的个数','hard','count-of-smaller-numbers-after-self','从右往左扫描，坐标压缩后查询 rank-1 的频数；与逆序对总数案例相比，这题需要保存每个位置的答案。'],
      [493,'翻转对','hard','reverse-pairs','进阶：判断条件为 nums[i]>2*nums[j]，不是普通逆序对。比较和压缩查询边界时使用 long，处理严格不等号。'],
      [327,'区间和的个数','hard','count-of-range-sum','把子数组和转成两个前缀和的差；对前缀和值做坐标压缩，查询符合 [sum-upper,sum-lower] 的已有前缀数量。']
    ],
    'c13/s2':[
      [307,'区域和检索 - 数组可修改','medium','range-sum-query-mutable','先用线段树实现单点赋值与区间求和，再对照树状数组。聚合改为加法，单位元改为 0。'],
      [699,'掉落的方块','hard','falling-squares','用坐标压缩处理大坐标：先查询落点区间最大高度，再把覆盖区间赋值为新的顶部高度。此处是区间赋值，不能照搬区间加标记。'],
      [715,'Range 模块','hard','range-module','进阶：维护半开区间的覆盖、取消覆盖与查询；可用动态线段树，懒标记需要区分覆盖、取消和无待处理操作。'],
      [732,'我的日程安排表 III','hard','my-calendar-iii','用区间加与区间最大值统计并发预订。坐标范围很大时考虑动态开点，半开区间转整数闭区间时注意 end-1。']
    ],
    'c14/s1':[
      [743,'网络延迟时间','medium','network-delay-time','非负权有向图最短路：Dijkstra 得到所有距离后取最大值；任一点不可达则返回 -1，原题节点从 1 编号。'],
      [1631,'最小体力消耗路径','medium','path-with-minimum-effort','变式 Dijkstra：路径代价不是边权之和，而是路径上最大高度差；松弛改为 min(dist[v],max(dist[u],edgeCost))。'],
      [2290,'到达角落需要移除障碍物的最小数目','hard','minimum-obstacle-removal-to-reach-corner','进入空地的代价为 0、进入障碍的代价为 1，转成网格上的 0-1 BFS；比较先入队访问与按更短距离松弛的区别。'],
      [787,'K 站中转内最便宜的航班','medium','cheapest-flights-within-k-stops','带边数限制的最短路：最多 K 次中转对应至多 K+1 条边。分层 Bellman-Ford 每轮读取上一轮副本，避免一轮内串用更多边。']
    ],
    'c14/s2':[
      [1584,'连接所有点的最小费用','medium','min-cost-to-connect-all-points','把两点曼哈顿距离当无向边权，用 Kruskal 或 Prim 求总成本；对完全图比较显式存边与直接更新最短接入边的空间开销。'],
      [1631,'最小体力消耗路径','medium','path-with-minimum-effort','用 Kruskal 思维按相邻格子的高度差升序合并；起点与终点首次连通时的边权就是最优瓶颈，和最短路章节形成解法对照。'],
      [1489,'找到最小生成树里的关键边和伪关键边','hard','find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree','先求基准 MST 成本，再分别测试禁用和强制选入某条边；排序前保存原始下标，每次测试使用新的并查集。'],
      [1697,'检查边长度限制的路径是否存在','hard','checking-existence-of-edge-length-limited-paths','思维延伸：边和查询按阈值排序，用并查集逐步接入更轻的边；题意是严格小于 limit，等于阈值的边不能提前合并。']
    ]
  };
  function java(name,body,main){return 'import java.util.*;\n\npublic class '+name+' {\n'+body+'\n    public static void main(String[] args) {\n'+main+'\n    }\n}';}
  function example(name,scenario,question,sample,solution,body,main,output){return {name:name,scenario:scenario,question:question,sample:sample,solution:solution,code:java(name,body,main),main:main,expectedOutput:output};}
  function section(ch,no,title,tags,concept,guide,pitfalls,cases,practice){
    var key='c'+ch+'/s'+no;guides[key]=[title,1].concat(guide);
    return {id:'s'+no,title:ch+'.'+no+' '+title,short:title,minutes:45,tags:tags,blocks:[
      {t:'h',text:'概念与适用条件'},{t:'p',text:concept},
      {t:'h',text:'运用场景'},{t:'list',items:cases.map(function(c){return c.scenario;})},
      {t:'h',text:'使用案例'},{t:'case-studies',items:cases},
      {t:'pitfalls',items:pitfalls.map(function(p){return {t:p[0],d:p[1]};})},
      {t:'problems',title:'经典题目',items:classics[key].map(function(p){return {number:p[0],name:p[1],diff:p[2],slug:p[3],note:p[4]};})},
      {t:'practice',title:'先想一想，再看解析',items:practice}
    ]};
  }
  function exercise(ch,no,c,title,signature,stub,requirements,hints,tests,arrayResult){
    var id='ex-c'+ch+'-'+no,method=signature.match(/(\w+)\(/)[1];
    banks[id]={className:c.name,tests:tests.map(function(t,i){
      var expr='call(subject,"'+method+'",'+t[1]+')';
      if(arrayResult)expr='Arrays.toString(('+arrayResult+'[])'+expr+')';
      return {id:id+'-t'+(i+1),input:t[0],expected:String(t[2]),note:t[3],setup:'Object subject=new '+c.name+'();',expression:expr};
    })};
    return {id:id,title:title,level:c.name==='BitCountDemo'?'入门':c.name==='AdvancedWindowDemo'?'困难':'中等',brief:c.question,
      requirements:requirements,starter:java(c.name,'    '+signature+' {\n        // TODO：根据本节不变量完成方法；先运行公开测试观察边界。\n        '+stub+'\n    }',c.main),
      expectedOutput:c.expectedOutput,solution:c.code,analysis:c.solution,
      keyPoints:[{label:'保留题目要求的方法 '+method,test:method+'\\s*\\('},{label:'完成 TODO 后运行公开测试',test:'^(?![\\s\\S]*TODO)[\\s\\S]*$'}],hints:hints};
  }
  function chapter(id,title,tags,goals,prerequisites,sections,exercises,quiz,interview){
    sections[0].blocks.unshift({t:'info',text:'建议先学：'+prerequisites+'。本章案例都可直接运行；步骤演示展示核心状态变化，完整程序见下方案例。'});
    chapters.push({id:'c'+id,title:title,minutes:120,tags:tags,goals:goals,sections:sections,exercises:exercises,quiz:quiz.map(function(q){return {q:q[0],options:q[1],answer:q[2],explain:q[3]};}),interview:interview.map(function(q){return {q:q[0],a:q[1]};})});
  }

  var bitCount=example('BitCountDemo','二进制统计：统计置位数','实现 countBits(int n)，统计 Java int 的 32 位补码中有多少个 1，负数也需要正确处理。','n=11，二进制 1011，返回 3；n=-1，返回 32。','每次执行 n & (n-1)，恰好删除最右侧的一个 1。循环次数等于置位数 k；时间 O(k)，在固定 32 位 int 下至多 32 次，额外空间 O(1)。',
`    public static int countBits(int n) {
        int count = 0;
        // 只判断是否为零，不能写 n > 0，否则负数会直接跳过。
        while (n != 0) {
            n &= n - 1; // 删除最低位的 1；int 的补码溢出是 Java 定义的行为。
            count++;
        }
        return count;
    }`,
`        System.out.println(countBits(11));
        System.out.println(countBits(-1));`, '3\n32');
  var xor=example('XorUniqueDemo','成对消去：找到只出现一次的编号','非空 int 数组中仅一个数字出现一次，其余数字均恰好出现两次，返回这个数字。','[4,1,2,1,2] 返回 4；[-3,5,5] 返回 -3。','利用 a^a=0、a^0=a，异或满足交换律，全部元素异或后只剩单独的数字。时间 O(n)，额外空间 O(1)；若其余元素出现三次，这个结论不能直接套用。',
`    public static int single(int[] nums) {
        int answer = 0;
        // 相同数字的每一位都会两两抵消，负数也遵循同样的位规则。
        for (int x : nums) answer ^= x;
        return answer;
    }`, `        System.out.println(single(new int[]{4,1,2,1,2}));
        System.out.println(single(new int[]{-3,5,5}));`, '4\n-3');
  var subset=example('SubsetMaskDemo','状态压缩：统计符合预算的子集','实现 count(int[] nums,int target)，返回元素和等于 target 的子集数量。0≤n≤20，|nums[i]|≤10⁶；按下标区分元素，空集也计入。','nums=[1,2,3]，target=3，对应 {1,2}、{3}，返回 2；[0,0]、target=0 返回 4。','用 n 位整数的第 i 位表示是否选择 nums[i]；枚举 0 到 2^n-1，每个下标集合恰好对应一个 mask。和用 long 避免累计溢出；时间 O(n·2^n)，额外空间 O(1)，只适合较小 n。',
`    public static int count(int[] nums, int target) {
        if (nums.length > 20) throw new IllegalArgumentException("n 必须不超过 20");
        int answer = 0, limit = 1 << nums.length;
        for (int mask = 0; mask < limit; mask++) {
            long sum = 0;
            for (int i = 0; i < nums.length; i++) {
                // 括号固定优先级：先得到第 i 位，再与 mask 做按位与。
                if ((mask & (1 << i)) != 0) sum += nums[i];
            }
            if (sum == target) answer++; // mask=0 表示空集，和为 0。
        }
        return answer;
    }`, `        System.out.println(count(new int[]{1,2,3}, 3));
        System.out.println(count(new int[]{0,0}, 0));`, '2\n4');
  var permissions=example('PermissionMaskDemo','权限集合：添加、检查与删除权限','用三个独立 bit 表示 READ、WRITE、EXECUTE；依次添加读写权限、检查写权限、删除写权限，输出剩余状态。','初始为 0，添加 READ|WRITE 后为 3；删除 WRITE 后为 1。','独立标记设为 1<<k。添加用 |，检查全部权限用 (mask&required)==required，删除用 &~required。每次操作 O(1)，空间 O(1)；普通数字 1、2、3 不能表示三个互不重叠的权限。',
`    static final int READ = 1 << 0, WRITE = 1 << 1, EXECUTE = 1 << 2;
    public static boolean contains(int mask, int required) {
        // 检查 required 中的所有位；只写 !=0 仅代表有任意交集。
        return (mask & required) == required;
    }`, `        int mask = READ | WRITE;
        System.out.println(mask);
        System.out.println(contains(mask, WRITE));
        mask &= ~WRITE; // 清除写权限，不影响其他位。
        System.out.println(mask);
        System.out.println(contains(mask, READ | EXECUTE));`, '3\ntrue\n1\nfalse');
  chapter(10,'位运算与状态压缩',['位运算','补码','异或','状态压缩'],['理解补码与位操作的边界','用异或消去成对元素','用 mask 表示集合并枚举子集'],'数组、循环、复杂度（第 1、5 章）',[
    section(10,1,'位运算基础',['位运算','异或'],'Java int 是 32 位有符号整数。&、|、^ 分别逐位计算交、并、差异；~ 翻转所有位。>> 保留符号位，>>> 高位补零。位运算适合有限标记和二进制性质明确的问题；先写清输入约定，再使用“位技巧”。',
      ['逐位查看 32 个 bit，或用哈希表计数。','删除最低位的 1；成对编号用异或累积。','每轮删除恰好一个 1；异或前缀等于已读元素的总异或。','统计 O(k)、异或 O(n)，均额外 O(1)。','负数不能以 n>0 为循环条件；Java 位移距离对 int 取低 5 位。'],
      [['负数与右移','-1 >> 1 仍为 -1；若逐位循环，应使用 >>> 或固定循环 32 次。'],['位移越界','1<<32 等价于 1<<0；大集合应换 long 或 BitSet，并检查容量。']], [bitCount,xor],
      [['为什么 n & (n-1) 能删除一个 1？','最低的 1 在减一后变成 0，右侧的 0 变成 1；与原值相与时，这些右侧位仍为 0，更高位保持不变。'],['[2,2,2,7] 能用总异或找到 7 吗？','不能。题目中的“其余恰好出现两次”是必要前提；2^2^2^7=5。']] ),
    section(10,2,'集合与子集枚举',['状态压缩','位运算'],'n 个是否选取的决策可以编码为 n 个 bit。mask=0 表示空集；全集为 (1<<n)-1。本节先理解“一个 mask 对应一个下标集合”，再用于权限和子集问题。2^n 增长很快，不能只因为代码简短就忽略规模。',
      ['递归分两支：选或不选。','用 mask 的第 i 位记录是否选第 i 个元素。','已经检查的 bit 与本次选择的元素一一对应。','枚举时间 O(n·2^n)，空间 O(1)；权限操作 O(1)。','相同数值的不同下标仍是不同选择；空集不能漏掉。'],
      [['指数规模','n=30 时超过十亿个 mask；本题明确限制 n≤20。'],['权限判断','检查多个权限时用等于 required，不能只看是否有交集。']], [subset,permissions],
      [['数组 [1,1] 中和为 1 的子集有几个？','按下标区分有 2 个：选择第一个 1 或第二个 1。'],['如何检查 A 是 B 的子集？','(A & B)==A；等价于 (A & ~B)==0。']] )
  ],[
    exercise(10,1,bitCount,'统计 32 位补码中的 1','public static int countBits(int n)','return 0;',['保留 countBits(int n)，返回 int。','支持全部 int 值，包括 0、负数和 Integer.MIN_VALUE。','不要把 n 转成字符串；额外空间 O(1)。'],['从最右侧的 1 开始考虑。','比较 n 和 n-1 的二进制。','循环应以 n!=0 为条件。'],[
      ['11','11',3,'普通正数'],['0','0',0,'全零'],['-1','-1',32,'全部 32 位为 1'],['Integer.MIN_VALUE','Integer.MIN_VALUE',1,'只有符号位为 1'],['Integer.MAX_VALUE','Integer.MAX_VALUE',31,'最大正数']]),
    exercise(10,2,subset,'按下标统计目标和子集','public static int count(int[] nums, int target)','return 0;',['0≤n≤20，|nums[i]|≤10⁶，target 为 int。','空集计入；相同数值按不同下标区分。','返回数量 int，累计和使用 long。'],['每个元素只有选与不选两种状态。','mask 从 0 开始。','不要按数值去重，也不要因 sum>target 提前终止，数组可能有负数。'],[
      ['[1,2,3]; target=3','new int[]{1,2,3},3',2,'两种组合'],['[]; target=0','new int[]{},0',1,'空集'],['[0,0]; target=0','new int[]{0,0},0',4,'零形成不同选择'],['[-1,1,2]; target=1','new int[]{-1,1,2},1',2,'包含负数'],['[2,4]; target=3','new int[]{2,4},3',0,'没有解']])
  ],[
    ['-1 在 Java int 的补码中有多少个 1？',['0','1','31','32'],3,'-1 的 32 个 bit 都是 1。'],
    ['清除 mask 中的 WRITE 位应该使用？',['mask | WRITE','mask & ~WRITE','mask ^ ~WRITE','mask & WRITE'],1,'&~ 仅清除指定位置。异或会切换，不能保证清除。'],
    ['含 n 个元素的下标集合有多少个子集？',['n','n²','2^n','n!'],2,'每个下标选或不选，共 2^n 种。'],
    ['检查 A 包含 B 的所有权限应该使用？',['(A&B)!=0','(A|B)==0','(A&B)==B','A==B'],2,'有交集不足以代表包含 B 的每一位。']
  ],[['位运算一定比普通算法快吗？','不能只看单条操作。枚举 2^n 个 mask 仍是指数复杂度；选择算法首先看规模和状态数，再考虑常数。'],['异或找唯一数有什么前提？','恰好一个数字出现一次，其他数字均出现两次。出现次数改变后需要重新推导，不能照搬。']]);

  var windowMax=example('AdvancedWindowDemo','持续监控：最近 K 次采样的最大值','实现 maxWindow(int[] nums,int k)，返回每个长度为 k 的连续窗口最大值；空数组且 k=0 返回空数组，非空时 1≤k≤n。','[1,3,-1,-3,5,3,6,7]，k=3，返回 [3,3,5,5,6,7]。','双端队列存下标，队首先移除过期下标，再从队尾移除不大于当前值的候选。每个下标至多入队和出队一次，因此时间 O(n)，辅助队列 O(k)，结果 O(n-k+1)。',
`    public static int[] maxWindow(int[] nums, int k) {
        if (nums.length == 0 && k == 0) return new int[0];
        if (k < 1 || k > nums.length) throw new IllegalArgumentException("窗口长度无效");
        Deque<Integer> q = new ArrayDeque<>();
        int[] result = new int[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            // 存下标才能识别过期元素；窗口左端为 i-k+1。
            while (!q.isEmpty() && q.peekFirst() <= i-k) q.pollFirst();
            while (!q.isEmpty() && nums[q.peekLast()] <= nums[i]) q.pollLast();
            q.offerLast(i); // 更晚且更大的值可替代前面的候选。
            if (i >= k-1) result[i-k+1] = nums[q.peekFirst()];
        }
        return result;
    }`, `        System.out.println(Arrays.toString(maxWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3)));`, '[3, 3, 5, 5, 6, 7]');
  var bounded=example('BoundedSubarrayDemo','波动控制：最长稳定连续区间','给定 int 数组和非负 limit，返回最大值与最小值之差不超过 limit 的最长连续子数组长度。','[8,2,4,7]，limit=4，返回 2；[10,1,2,4,7,2]，limit=5，返回 4。','用递减队列维护最大值、递增队列维护最小值；差值超限时移动左端并删除过期下标。两个队列的元素各至多入出一次，时间 O(n)，额外空间最坏 O(n)。差值转 long，避免最大 int 减最小 int 溢出。',
`    public static int longest(int[] a, int limit) {
        if (limit < 0) throw new IllegalArgumentException("limit 必须非负");
        Deque<Integer> max = new ArrayDeque<>(), min = new ArrayDeque<>();
        int left = 0, best = 0;
        for (int right = 0; right < a.length; right++) {
            while (!max.isEmpty() && a[max.peekLast()] <= a[right]) max.pollLast();
            while (!min.isEmpty() && a[min.peekLast()] >= a[right]) min.pollLast();
            max.offerLast(right); min.offerLast(right);
            while ((long)a[max.peekFirst()] - a[min.peekFirst()] > limit) {
                // 先移除将要离开窗口的下标，再前进左边界。
                if (max.peekFirst() == left) max.pollFirst();
                if (min.peekFirst() == left) min.pollFirst();
                left++;
            }
            best = Math.max(best, right-left+1);
        }
        return best;
    }`, `        System.out.println(longest(new int[]{8,2,4,7}, 4));
        System.out.println(longest(new int[]{10,1,2,4,7,2}, 5));`, '2\n4');
  var difference=example('DifferenceBookingsDemo','批量区间增量：统计各站预约人数','实现 bookings(int n,int[][] updates)，初始 n 个站点均为 0，每条 [l,r,delta] 对闭区间增加 delta，返回最终 long[]。下标从 0 开始，允许负增量。','n=5，updates=[[0,2,10],[1,4,5]]，结果 [10,15,15,5,5]。','差分数组记录变化：d[l]+=delta，d[r+1]-=delta；最后做前缀和还原。为 r=n-1 预留哨兵 n。m 次更新总时间 O(n+m)，额外空间 O(n)；它适合所有更新结束后统一查询。',
`    public static long[] bookings(int n, int[][] updates) {
        long[] diff = new long[n+1]; // n 是右端撤销标记的哨兵位置。
        for (int[] u : updates) {
            diff[u[0]] += u[2];
            diff[u[1]+1] -= (long)u[2]; // 先转 long，负 int 极值也不会溢出。
        }
        long[] result = new long[n];
        long running = 0;
        for (int i = 0; i < n; i++) {
            running += diff[i];
            result[i] = running;
        }
        return result;
    }`, `        System.out.println(Arrays.toString(bookings(5, new int[][]{{0,2,10},{1,4,5}})));`, '[10, 15, 15, 5, 5]');
  var sweep=example('MeetingSweepDemo','稀疏时间轴：最多同时进行的会议','会议以 [start,end) 表示，start<end，返回最多同时进行的会议数；时间可很大，不建立逐时刻数组。','[[0,30],[5,10],[10,20]] 返回 2。10 点结束的会议不占用 10 点开始的时段。','TreeMap 将开始记为 +1、结束记为 -1；同一时刻合并增减后扫描。半开区间让相邻会议不重叠。m 场会议时间 O(m log m)，空间 O(m)。',
`    public static int peak(int[][] meetings) {
        TreeMap<Integer,Integer> events = new TreeMap<>();
        for (int[] m : meetings) {
            // 半开区间在开始时占用，在结束时释放；相同时间合并事件。
            events.merge(m[0], 1, Integer::sum);
            events.merge(m[1], -1, Integer::sum);
        }
        int active = 0, best = 0;
        for (int change : events.values()) {
            active += change; // 同时刻开始与结束先合并，符合 [start,end)。
            best = Math.max(best, active);
        }
        return best;
    }`, `        System.out.println(peak(new int[][]{{0,30},{5,10},{10,20}}));
        System.out.println(peak(new int[][]{{1,2},{2,3}}));`, '2\n1');
  chapter(11,'单调队列、差分与扫描线',['单调队列','滑动窗口','差分','扫描线'],['推导候选淘汰与过期规则','用两个队列维护窗口波动','用差分和事件处理批量区间更新'],'队列、滑动窗口、前缀和（第 2、3 章）',[
    section(11,1,'单调队列与双队列窗口',['单调队列','滑动窗口'],'单调队列保留“将来仍可能成为答案”的候选。值更大且时间更晚的元素，会使较小的旧候选失去成为最大值的机会。与单调栈的区别在于：窗口还需要从队首删除过期下标。',
      ['每个窗口扫描 K 个数，时间 O(nK)。','用双端队列保存递减候选，队首直接给最大值。','下标递增、值递减，且下标都在当前窗口中。','总时间 O(n)；单队列 O(k)，双队列最坏 O(n)。','先删除过期下标再读答案；保存下标而非仅保存数值。'],
      [['相等值如何处理','使用 <= 删除旧的相等值，因为新下标更晚过期；使用 < 也能正确，但会保留更多候选。'],['差值溢出','极大值减极小值需要先转 long，不能计算完 int 差再强转。']], [windowMax,bounded],
      [['为什么一个 while 循环嵌在 for 中仍是 O(n)？','每个下标只入队一次，最多从队首或队尾被删除一次，总删除次数至多 n。'],['窗口从 [0,2] 移到 [1,3] 时哪个下标过期？','下标 0。右端 i=3、k=3 时，删除 <=i-k 的下标。']] ),
    section(11,2,'差分数组与事件扫描',['差分','扫描线'],'前缀和善于查询静态区间，差分善于批量修改区间。连续且规模可控的下标用数组记录变化；时间跨度巨大、事件稀疏时用有序事件表。闭区间与半开区间必须先约定清楚。',
      ['每次对 [l,r] 中每项做加法。','只修改差分的两个端点，最后一次前缀和还原。','running 等于当前位置所有已经生效且尚未撤销的增量之和。','差分 O(n+m)/O(n)；TreeMap 扫描 O(m log m)/O(m)。','闭区间在 r+1 撤销；半开区间在 end 撤销。'],
      [['更新与查询交错','每次更新后都重新还原会退回 O(nm)；交错操作请学习第 13 章树状数组或线段树。'],['哨兵空间','闭区间右端可能为 n-1，需要 diff[n]，分配 n+1 个位置。']], [difference,sweep],
      [['给闭区间 [1,3] 加 5，应改哪两项？','diff[1]+=5，diff[4]-=5，前缀和在下标 4 恢复原来的增量。'],['会议 [1,2) 和 [2,3) 需要两个房间吗？','不需要，同一时刻的 +1 与 -1 抵消，最多一场会议同时进行。']] )
  ],[
    exercise(11,1,windowMax,'输出所有滑动窗口最大值','public static int[] maxWindow(int[] nums, int k)','return new int[0];',['0≤n≤10⁵；空数组 k=0，否则 1≤k≤n。','返回 int[]；重复值与负数也要正确。','目标时间 O(n)，不修改输入数组。'],['队列存下标。','先移除过期下标，再从尾部淘汰弱候选。','形成第一个完整窗口后再输出。'],[
      ['[1,3,-1,-3,5]; k=3','new int[]{1,3,-1,-3,5},3','[3, 3, 5]','常规窗口'],['[]; k=0','new int[]{},0','[]','空数组'],['[2,2,2]; k=2','new int[]{2,2,2},2','[2, 2]','相等候选'],['[-5,-2,-8]; k=1','new int[]{-5,-2,-8},1','[-5, -2, -8]','单元素窗口'],['[5,4,3,2]; k=4','new int[]{5,4,3,2},4','[5]','整段窗口']],'int'),
    exercise(11,2,difference,'批量区间预约增量','public static long[] bookings(int n, int[][] updates)','return new long[n];',['0≤n≤10⁵；每项更新 [l,r,delta] 满足 0≤l≤r<n。','n=0 时 updates 为空；delta 为 int，可为负。','返回 long[]，目标时间 O(n+m)。'],['只记录增量在何处开始与结束。','闭区间的撤销位置是 r+1。','累加器和差分数组均用 long。'],[
      ['n=5; [[0,2,10],[1,4,5]]','5,new int[][]{{0,2,10},{1,4,5}}','[10, 15, 15, 5, 5]','重叠更新'],['n=0; []','0,new int[][]{}','[]','空站点'],['n=3; []','3,new int[][]{}','[0, 0, 0]','无更新'],['n=2; [[0,1,2147483647],[0,1,1]]','2,new int[][]{{0,1,2147483647},{0,1,1}}','[2147483648, 2147483648]','累计超过 int'],['n=3; [[0,2,5],[1,1,-8]]','3,new int[][]{{0,2,5},{1,1,-8}}','[5, -3, 5]','负增量与单点']],'long')
  ],[
    ['单调队列保存下标的主要原因？',['下标总比值小','判断过期并查取数值','省掉所有比较','让数组有序'],1,'下标既给出数值位置，也给出离开窗口的时机。'],
    ['每个下标入队一次、出队至多一次，总复杂度？',['O(n²)','O(n log n)','O(n)','O(1)'],2,'摊还计数得到 O(n)。'],
    ['闭区间 [l,r] 加 v，差分的撤销位置？',['l-1','r','r+1','n-1'],2,'r 仍需要增量，从 r+1 开始撤销。'],
    ['极稀疏且跨度巨大的时间轴适合？',['建立最大时间长度数组','TreeMap 记录变化事件','每分钟轮询','只记录最早时间'],1,'按实际事件数量分配空间。']
  ],[['单调队列为什么可以扔掉某些旧元素？','新元素更大且更晚过期；当旧元素还在窗口时，新元素也在且不小于它，旧元素永远不会再成为必要的最大值候选。'],['差分与树状数组怎么选？','离线批量区间更新、最后统一还原用差分；需要频繁交错查询时考虑树状数组或线段树。']]);

  var trie=example('TriePrefixDemo','搜索补全：统计以某前缀开头的词','实现 prefixCounts(String[] words,String[] prefixes)。单词和前缀只含 a-z，允许空串；重复插入分别计数，返回每个前缀的词条数。','words=[apple,app,apple,bat]；prefixes=[app,apple,b,cat,空串]，返回 [3,2,1,0,4]。','Trie 节点按字符向下，pass 记录经过该节点的词条数；根节点计数对应空前缀。建立耗时 O(单词总字符数)，查询 O(前缀总字符数)，空间 O(26·节点数)。',
`    static class Node {
        Node[] next = new Node[26];
        int pass;
    }
    public static int[] prefixCounts(String[] words, String[] prefixes) {
        Node root = new Node();
        for (String word : words) {
            Node p = root;
            p.pass++; // 空前缀匹配所有词条，包括空字符串。
            for (char c : word.toCharArray()) {
                int i = c-'a';
                if (p.next[i] == null) p.next[i] = new Node();
                p = p.next[i]; p.pass++; // 重复单词也单独累计。
            }
        }
        int[] result = new int[prefixes.length];
        for (int i = 0; i < prefixes.length; i++) {
            Node p = root;
            for (char c : prefixes[i].toCharArray()) {
                p = p.next[c-'a'];
                if (p == null) break;
            }
            result[i] = p == null ? 0 : p.pass;
        }
        return result;
    }`, `        System.out.println(Arrays.toString(prefixCounts(new String[]{"apple","app","apple","bat"}, new String[]{"app","apple","b","cat",""})));`, '[3, 2, 1, 0, 4]');
  var trieWord=example('TrieDictionaryDemo','词典查询：区分完整单词与前缀','插入 apple 后，查询 app 与 apple 是否为完整词；再插入 app，重新查询。','apple 存在不代表 app 已被收录；插入 app 后其 end 标记变为 true。','沿字符建树，在单词终点设置 end。路径存在只表示前缀存在，完整词查询还需要 end。插入与查询耗时 O(L)，树空间与不同前缀数成正比。',
`    static class Node { Node[] next = new Node[26]; boolean end; }
    private final Node root = new Node();
    public void insert(String word) {
        Node p = root;
        for (char c : word.toCharArray()) {
            int i = c-'a';
            if (p.next[i] == null) p.next[i] = new Node();
            p = p.next[i];
        }
        p.end = true; // 仅到达路径不代表一个完整单词。
    }
    public boolean search(String word) {
        Node p = root;
        for (char c : word.toCharArray()) {
            p = p.next[c-'a'];
            if (p == null) return false;
        }
        return p.end;
    }`, `        TrieDictionaryDemo dict = new TrieDictionaryDemo();
        dict.insert("apple");
        System.out.println(dict.search("app"));
        System.out.println(dict.search("apple"));
        dict.insert("app");
        System.out.println(dict.search("app"));`, 'false\ntrue\ntrue');
  var trieReplace=example('TrieRootReplaceDemo','词根替换：找到句子中每个词的最短词根','词根列表为 cat、bat、rat；把句子中的单词替换为其最短词根，找不到则保留原词。输入为小写单词，以单个空格分隔。','the cattle was rattled by the battery → the cat was rat by the bat。','把词根插入 Trie。扫描单词时第一次碰到 end 即找到最短词根，可以立即停止。建立与替换总时间 O(词根总长度+句子总长度)，额外空间 O(Trie 节点数+输出长度)。',
`    static class Node { Node[] next = new Node[26]; boolean end; }
    public static String replace(String[] roots, String sentence) {
        Node root = new Node();
        for (String word : roots) {
            Node p = root;
            for (char c : word.toCharArray()) {
                int i = c-'a';
                if (p.next[i] == null) p.next[i] = new Node();
                p = p.next[i];
            }
            p.end = true;
        }
        String[] words = sentence.split(" ");
        for (int w = 0; w < words.length; w++) {
            Node p = root;
            for (int i = 0; i < words[w].length(); i++) {
                p = p.next[words[w].charAt(i)-'a'];
                if (p == null) break; // 找不到任何词根，保留原单词。
                if (p.end) { words[w] = words[w].substring(0,i+1); break; }
            }
        }
        return String.join(" ", words);
    }`, `        System.out.println(replace(new String[]{"cat","bat","rat"}, "the cattle was rattled by the battery"));`, 'the cat was rat by the bat');
  var kmp=example('KmpSearchDemo','文本检索：线性时间查找子串','实现 indexOf(String text,String pattern)，返回第一次匹配的下标，不存在返回 -1；空模式返回 0。以 Java char 为单位。','text=ababcabcacbab，pattern=abcac，返回 5。','pi[i] 记录 pattern[0..i] 的最长相等真前后缀长度。失配时把已匹配长度 j 回退到 pi[j-1]，主串位置无需倒退。时间 O(n+m)，辅助空间 O(m)。',
`    public static int[] prefix(String p) {
        int[] pi = new int[p.length()];
        for (int i = 1, j = 0; i < p.length(); i++) {
            while (j > 0 && p.charAt(i) != p.charAt(j)) j = pi[j-1];
            if (p.charAt(i) == p.charAt(j)) j++;
            pi[i] = j;
        }
        return pi;
    }
    public static int indexOf(String text, String pattern) {
        if (pattern.isEmpty()) return 0;
        int[] pi = prefix(pattern);
        for (int i = 0, j = 0; i < text.length(); i++) {
            // 复用已知相同的前后缀；j 为 0 时不能访问 pi[-1]。
            while (j > 0 && text.charAt(i) != pattern.charAt(j)) j = pi[j-1];
            if (text.charAt(i) == pattern.charAt(j)) j++;
            if (j == pattern.length()) return i-pattern.length()+1;
        }
        return -1;
    }`, `        System.out.println(indexOf("ababcabcacbab", "abcac"));
        System.out.println(indexOf("aaaaa", "b"));`, '5\n-1');
  var kmpAll=example('KmpOverlapDemo','重复定位：查找所有重叠匹配','给定非空 pattern，返回它在 text 中所有出现位置，允许重叠。','text=aaaaa，pattern=aaa，返回 [0,1,2]。','匹配完成后记录起点，再令 j=pi[j-1]，复用结尾中可成为下一次前缀的部分。不能直接把 j 清零，否则会漏掉重叠。时间 O(n+m)，辅助空间 O(m)，输出另计 O(k)。',
`    public static List<Integer> findAll(String text, String p) {
        if (p.isEmpty()) throw new IllegalArgumentException("本例要求模式非空");
        int[] pi = new int[p.length()];
        for (int i=1,j=0; i<p.length(); i++) {
            while (j>0 && p.charAt(i)!=p.charAt(j)) j=pi[j-1];
            if (p.charAt(i)==p.charAt(j)) j++;
            pi[i]=j;
        }
        List<Integer> answer = new ArrayList<>();
        for (int i=0,j=0; i<text.length(); i++) {
            while (j>0 && text.charAt(i)!=p.charAt(j)) j=pi[j-1];
            if (text.charAt(i)==p.charAt(j)) j++;
            if (j==p.length()) {
                answer.add(i-p.length()+1);
                j=pi[j-1]; // 保留可重叠的前后缀，下一轮不会越界。
            }
        }
        return answer;
    }`, `        System.out.println(findAll("aaaaa", "aaa"));`, '[0, 1, 2]');
  chapter(12,'字典树与 KMP 字符串匹配',['字符串','字典树','Trie','KMP'],['区分完整词与前缀','用 Trie 统计、替换前缀','推导前缀函数与失配回退'],'字符串、数组、树（第 1、6 章）',[
    section(12,1,'字典树 Trie',['字典树','Trie','字符串'],'Trie 把共享前缀合并成共享路径，每条边表示一个字符。它适合大量前缀查询、词典和词根匹配；只做完整键查找时，哈希表也很合适。本节限定 a-z，其他字符集应改用 Map<Character,Node> 等结构。',
      ['每个查询对所有词做 startsWith。','预先建立 Trie，沿查询前缀走到节点。','节点 pass 是经过此路径的词条总数；end 代表完整词终点。','建树 O(总字符数)，单次查询 O(L)，空间 O(26·节点数)。','根节点也需要维护空前缀计数；查询完整词要检查 end。'],
      [['重复词条','pass 每次插入都加一；若需求是不同单词数量，应先去重，不能混淆约定。'],['字符范围','数组下标 c-a 仅适合 a-z；中文或大写字母不能直接套用。']], [trie,trieWord,trieReplace],
      [['插入 apple 后，app 一定是完整词吗？','不是。app 对应路径存在，但其终点未必有 end=true。'],['空前缀应匹配几个词条？','匹配所有词条，因此根节点 pass 应在每次插入时加一。']] ),
    section(12,2,'KMP 与前缀函数',['KMP','字符串'],'KMP 解决“文本中找模式”的问题。pi[i] 是模式前缀 p[0..i] 的最长相等真前后缀长度；“真”表示不能包含整个串。j 始终表示已匹配的模式长度；失配后依照 pi 回退，保留已知可复用部分。',
      ['每个起点重新逐字符匹配，最坏 O(nm)。','预处理 pi，失配只回退 j，主串 i 单向移动。','text 中以 i-1 结尾的已匹配后缀等于 pattern[0..j-1]。','时间 O(n+m)，辅助空间 O(m)，所有匹配的输出空间另计。','失配应回退 pi[j-1]，不是 j--；找到所有结果时保留重叠。'],
      [['长度与下标','pi 存长度，j-1 才是已匹配最后一个字符的下标。'],['空模式与重叠','首次匹配例规定空模式返回 0；所有匹配例要求模式非空。不要混用两种接口约定。']], [kmp,kmpAll],
      [['模式 abab 的 pi 数组是多少？','[0,0,1,2]；最后的 ab 是最长相等真前后缀。'],['aaaaa 中 aaa 的重叠匹配为何有 3 个？','起点 0、1、2 都成立；匹配后回退到长度 2 保留重叠部分。']] )
  ],[
    exercise(12,1,trie,'批量统计词条前缀','public static int[] prefixCounts(String[] words, String[] prefixes)','return new int[prefixes.length];',['单词与查询仅含 a-z，允许空串；重复词分别计数。','总输入字符数≤10⁵，返回 int[]。','空前缀匹配全部词条，找不到返回 0。'],['根节点计数也要维护。','每经过一个节点，pass 加一。','查询中途找不到边，应停止并返回 0。'],[
      ['words=[apple,app,apple,bat]; prefixes=[app,apple,b,cat,空串]','new String[]{"apple","app","apple","bat"},new String[]{"app","apple","b","cat",""}','[3, 2, 1, 0, 4]','重复与不存在'],['words=[]; prefixes=[a,空串]','new String[]{},new String[]{"a",""}','[0, 0]','空词典'],['words=[空串,a]; prefixes=[空串,a,aa]','new String[]{"","a"},new String[]{"","a","aa"}','[2, 1, 0]','空词条'],['words=[abc]; prefixes=[]','new String[]{"abc"},new String[]{}','[]','无查询'],['words=[a,ab,abc,b]; prefixes=[a,ab,abc,b]','new String[]{"a","ab","abc","b"},new String[]{"a","ab","abc","b"}','[3, 2, 1, 1]','层层前缀']],'int'),
    exercise(12,2,kmp,'实现 KMP 首次子串查找','public static int indexOf(String text, String pattern)','return -1;',['字符串非 null，以 Java char 为单位，下标从 0 开始。','空模式返回 0；找不到返回 -1。','总长度≤2×10⁵，不调用 String.indexOf，目标 O(n+m)。'],['先构建模式的 pi 数组。','失配时 while 回退到 pi[j-1]，不是只退一次。','完全匹配时起点等于 i-pattern.length()+1。'],[
      ['ababcabcacbab; abcac','"ababcabcacbab","abcac"',5,'多次失配回退'],['abc; 空串','"abc",""',0,'空模式'],['空串; a','"","a"',-1,'空文本'],['aaaaab; aaab','"aaaaab","aaab"',2,'重复前缀'],['abc; abcd','"abc","abcd"',-1,'模式比文本长']])
  ],[
    ['Trie 路径存在能说明什么？',['一定是完整单词','该前缀存在','词典只有一个词','所有子节点都存在'],1,'完整词还要检查 end 标记。'],
    ['a-z Trie 每个节点的直接孩子槽位数？',['2','10','26','128'],2,'每个小写字母一个槽位；其他字符集需要调整。'],
    ['abab 的前缀函数最后一项是多少？',['0','1','2','4'],2,'最长相等真前后缀是 ab，长度为 2。'],
    ['KMP 失配时应如何回退已匹配长度 j？',['i=0','j=pi[j-1]','j=pi[i]','j++'],1,'依照已匹配部分的最长真前后缀回退，主串位置无需倒退。']
  ],[['Trie 与 HashMap 有什么不同？','HashMap 善于完整键查询；Trie 共享前缀，前缀统计与最短词根检索自然沿路径完成，但节点与字符槽位会消耗更多内存。'],['KMP 的 while 为什么不让整体退化为 O(nm)？','j 的增长总数受主串前进次数限制，每次回退严格减少 j。累计增长和回退次数都是线性的。']]);

  var fenwick=example('FenwickOperationsDemo','动态统计：单点增量与区间求和','实现 process(int[] initial,int[][] ops)，操作 [0,i,delta] 表示给 a[i] 加 delta；[1,l,r] 表示查询闭区间和，按顺序返回 long[]。','initial=[1,2,3,4]；查询 [1,3] 得 9，给下标 2 加 5，再查 [1,3] 得 14。','树状数组内部使用 1-based 下标，bit[i] 管理以 i 结尾、长度为 lowbit(i) 的区间。更新向上 i+=lowbit(i)，前缀查询向前 i-=lowbit(i)。区间和=prefix(r+1)-prefix(l)。建树 O(n log n)，m 次操作 O(m log n)，空间 O(n+查询数)。',
`    public static long[] process(int[] initial, int[][] ops) {
        int n = initial.length;
        long[] bit = new long[n+1];
        for (int i=0; i<n; i++) add(bit, i+1, initial[i]);
        List<Long> answer = new ArrayList<>();
        for (int[] op : ops) {
            if (op[0] == 0) add(bit, op[1]+1, op[2]);
            else answer.add(prefix(bit,op[2]+1)-prefix(bit,op[1]));
        }
        long[] result = new long[answer.size()];
        for (int i=0; i<result.length; i++) result[i]=answer.get(i);
        return result;
    }
    static void add(long[] bit, int i, long delta) {
        // 外部 0-based 先加 1；i=0 时 lowbit=0，会导致死循环。
        for (; i<bit.length; i+=i&-i) bit[i]+=delta;
    }
    static long prefix(long[] bit, int i) {
        long sum=0;
        // i 表示前 i 项，即原数组的半开区间 [0,i)。
        for (; i>0; i-=i&-i) sum+=bit[i];
        return sum;
    }`, `        System.out.println(Arrays.toString(process(new int[]{1,2,3,4}, new int[][]{{1,1,3},{0,2,5},{1,1,3}})));`, '[9, 14]');
  var inversions=example('FenwickInversionDemo','排序分析：树状数组统计逆序对','给定 int 数组，返回满足 i<j 且 a[i]>a[j] 的数对数量，用 long 保存。','[3,1,2] 返回 2；[2,2,1] 返回 2，相等值不是逆序。','先排序去重做坐标压缩，再从右向左扫描。查询比当前排名小的已出现元素数，随后把当前排名计数加一。压缩不改变大小关系。时间 O(n log n)，空间 O(n)。',
`    public static long inversions(int[] a) {
        int[] sorted = a.clone(); Arrays.sort(sorted);
        // 压缩只保留相对大小，原始值可以为负或很大。
        Map<Integer,Integer> rank = new HashMap<>();
        for (int x : sorted) if (!rank.containsKey(x)) rank.put(x,rank.size()+1);
        int[] bit = new int[rank.size()+1];
        long answer=0;
        for (int i=a.length-1; i>=0; i--) {
            int r=rank.get(a[i]);
            // 查询 r-1：严格小于当前值，不包含相等值。
            for (int j=r-1; j>0; j-=j&-j) answer+=bit[j];
            for (int j=r; j<bit.length; j+=j&-j) bit[j]++;
        }
        return answer;
    }`, `        System.out.println(inversions(new int[]{3,1,2}));
        System.out.println(inversions(new int[]{2,2,1}));`, '2\n2');
  var segment=example('SegmentMaxDemo','动态看板：单点赋值与区间最大值','实现 process(int[] initial,int[][] ops)。[0,i,value] 将 a[i] 赋值为 value；[1,l,r] 查询闭区间最大值，按顺序返回 long[]。n≥1。','[1,5,3] 先查 [0,2] 得 5；将 a[1] 设为 -2，再查 [0,2] 得 3。','线段树每个节点保存区间最大值。用 2 的幂扩充叶子，额外叶子设为 Long.MIN_VALUE。单点赋值后逐层合并；迭代查询把闭区间转为半开区间。建树 O(n)，每次更新/查询 O(log n)，空间 O(n+查询数)。',
`    public static long[] process(int[] initial, int[][] ops) {
        int size=1;
        while (size<initial.length) size*=2;
        long[] tree=new long[2*size]; Arrays.fill(tree,Long.MIN_VALUE);
        for (int i=0; i<initial.length; i++) tree[size+i]=initial[i];
        for (int i=size-1; i>0; i--) tree[i]=Math.max(tree[2*i],tree[2*i+1]);
        List<Long> answer=new ArrayList<>();
        for (int[] op : ops) {
            if (op[0]==0) {
                int p=size+op[1]; tree[p]=op[2]; // 赋值，不是增量。
                for (p/=2; p>0; p/=2) tree[p]=Math.max(tree[2*p],tree[2*p+1]);
            } else {
                int l=size+op[1], r=size+op[2]+1; // [l,r)，右端不包含。
                long best=Long.MIN_VALUE; // 不能设为 0，数据可能全为负数。
                while (l<r) {
                    if ((l&1)==1) best=Math.max(best,tree[l++]);
                    if ((r&1)==1) best=Math.max(best,tree[--r]);
                    l/=2; r/=2;
                }
                answer.add(best);
            }
        }
        long[] result=new long[answer.size()];
        for (int i=0; i<result.length; i++) result[i]=answer.get(i);
        return result;
    }`, `        System.out.println(Arrays.toString(process(new int[]{1,5,3}, new int[][]{{1,0,2},{0,1,-2},{1,0,2}})));`, '[5, 3]');
  var lazy=example('LazyRangeSumDemo','批量修改与即时查询：带懒标记的区间求和','初始数组 [1,2,3,4]，给闭区间 [1,3] 加 5，查询全区间和与 [2,3] 的和。','更新后为 [1,7,8,9]，两次查询分别返回 25、17。','节点 sum 保存区间和，lazy 保存尚未传给孩子的统一增量。整段覆盖时直接 sum+=delta×长度；部分访问时先下传，再递归合并。建树 O(n)，每次区间加/查询 O(log n)，空间 O(n)。',
`    private final int n;
    private final long[] sum, lazy;
    public LazyRangeSumDemo(int[] a) {
        n=a.length; sum=new long[4*n]; lazy=new long[4*n]; build(1,0,n-1,a);
    }
    void build(int p,int l,int r,int[] a) {
        if(l==r){sum[p]=a[l];return;}
        int m=(l+r)>>>1; build(p*2,l,m,a); build(p*2+1,m+1,r,a);
        sum[p]=sum[p*2]+sum[p*2+1];
    }
    void apply(int p,int l,int r,long delta) {
        sum[p]+=delta*(r-l+1); lazy[p]+=delta; // 增量乘区间长度。
    }
    void push(int p,int l,int r) {
        if(lazy[p]==0 || l==r)return;
        int m=(l+r)>>>1;
        apply(p*2,l,m,lazy[p]); apply(p*2+1,m+1,r,lazy[p]);
        lazy[p]=0; // 已传给孩子，必须清空以免重复累加。
    }
    public void add(int ql,int qr,long d){add(1,0,n-1,ql,qr,d);}
    void add(int p,int l,int r,int ql,int qr,long d) {
        if(ql<=l && r<=qr){apply(p,l,r,d);return;}
        push(p,l,r); int m=(l+r)>>>1;
        if(ql<=m)add(p*2,l,m,ql,qr,d);
        if(qr>m)add(p*2+1,m+1,r,ql,qr,d);
        sum[p]=sum[p*2]+sum[p*2+1];
    }
    public long query(int ql,int qr){return query(1,0,n-1,ql,qr);}
    long query(int p,int l,int r,int ql,int qr) {
        if(ql<=l && r<=qr)return sum[p];
        push(p,l,r); int m=(l+r)>>>1; long answer=0;
        if(ql<=m)answer+=query(p*2,l,m,ql,qr);
        if(qr>m)answer+=query(p*2+1,m+1,r,ql,qr);
        return answer;
    }`, `        LazyRangeSumDemo tree=new LazyRangeSumDemo(new int[]{1,2,3,4});
        tree.add(1,3,5); // 本例要求数组非空、所有闭区间合法。
        System.out.println(tree.query(0,3));
        System.out.println(tree.query(2,3));`, '25\n17');
  var segmentSum=example('SegmentSumDemo','聚合替换：用同一棵树查询区间和','建立 [2,1,5,3] 的区间和线段树，查询闭区间 [1,3] 的和。','结果为 1+5+3=9；查询 [0,0] 返回 2。','聚合从 max 换成加法，单位元从负无穷换成 0。叶子扩充到 2 的幂，父节点保存两个孩子之和；查询仍分解为互不重叠节点。建树 O(n)，查询 O(log n)，空间 O(n)。',
`    public static long rangeSum(int[] a,int left,int right) {
        int size=1; while(size<a.length)size*=2;
        long[] tree=new long[2*size];
        for(int i=0;i<a.length;i++)tree[size+i]=a[i];
        for(int i=size-1;i>0;i--)tree[i]=tree[2*i]+tree[2*i+1];
        long answer=0;
        // 本方法演示建树与单次查询；频繁查询时应把 tree 保存为对象字段。
        for(int l=left+size,r=right+size+1;l<r;l/=2,r/=2){
            if((l&1)==1)answer+=tree[l++];
            if((r&1)==1)answer+=tree[--r];
        }
        return answer;
    }`, `        System.out.println(rangeSum(new int[]{2,1,5,3},1,3));
        System.out.println(rangeSum(new int[]{2,1,5,3},0,0));`, '9\n2');
  chapter(13,'树状数组与线段树',['树状数组','Fenwick','线段树','懒标记','区间查询'],['掌握 lowbit 和内部下标约定','用坐标压缩统计逆序对','实现单点更新、区间聚合与懒标记'],'前缀和、位运算、树与递归（第 3、6、10 章）',[
    section(13,1,'树状数组与坐标压缩',['树状数组','Fenwick','坐标压缩'],'静态前缀和在单点修改后需要重算很多项。树状数组把前缀拆成 O(log n) 个区间，支持高效的单点增量与区间和。lowbit(i)=i&-i，表示 i 的最低置位值。外部数组下标从 0 开始，内部从 1 开始。',
      ['直接数组查询 O(n)，或每次修改后重建前缀和 O(n)。','树状数组单点增量与前缀查询都只走 O(log n) 个节点。','bit[i] 保存内部下标区间 [i-lowbit(i)+1,i] 的和。','本实现建树 O(n log n)，单次 O(log n)，树空间 O(n)。','内部下标不能为 0；查询 [l,r] 要取 prefix(r+1)-prefix(l)。'],
      [['赋值不是加法','若 API 要求赋值，应先保存原值，转为 delta=new-old 后更新。'],['坐标压缩保留什么','只保留相等和大小顺序，不保留原始距离；逆序对查 rank-1 才排除相等值。']], [fenwick,inversions],
      [['lowbit(12) 等于多少？','12 的二进制是 1100，最低位的 1 对应 4，因此 lowbit=4。'],['为什么区间和可由两个前缀相减，而最大值不可以？','和可减去共同前缀；单个前缀最大值无法知道删除部分之后的新最大值。']] ),
    section(13,2,'线段树与懒标记',['线段树','懒标记','区间查询'],'线段树把数组递归分成区间，用可结合的运算合并孩子，如求和、最大值、最小值。区间加可以用 lazy 延迟下传。本节先实现单点赋值+区间最大值，再阅读懒标记的完整程序，最后对照“求和”的聚合与单位元。',
      ['每次查询遍历 [l,r]，时间 O(n)。','把查询区间拆成 O(log n) 个树节点，合并聚合值。','每个节点保存所负责区间的聚合结果；lazy 已计入本节点，但尚未计入孩子。','建树 O(n)，单点更新/区间查询 O(log n)，带 lazy 的区间加 O(log n)，空间 O(n)。','最大值的单位元是负无穷；下传后必须清空父节点 lazy。'],
      [['全负数的最大值','best=0 会把不存在的 0 当答案，应设 Long.MIN_VALUE。'],['区间加影响求和','长度为 len 的区间加 d，sum 应增加 d*len，不能只加 d。'],['下传与回收','部分覆盖先 push，递归后更新父节点；整段覆盖可直接 apply。']], [segment,lazy,segmentSum],
      [['给长度 4 的区间统一加 3，区间和增加多少？','增加 12；最大值则只增加 3。不同聚合需要不同的 apply 规则。'],['什么时候该用线段树而不是普通树状数组？','需要动态区间最大值、最小值、复杂区间修改，且能定义正确的合并与标记规则时。']] )
  ],[
    exercise(13,1,fenwick,'树状数组：交错更新与求和','public static long[] process(int[] initial, int[][] ops)','return new long[0];',['1≤n≤10⁵，操作数≤10⁵；所有下标与区间合法。','[0,i,delta] 是单点增量；[1,l,r] 是闭区间和。','初值和 delta 为 int，返回 long[]，不修改 initial。'],['外部下标加 1 进入树状数组。','查询 [l,r] 等于前 r+1 项减前 l 项。','每次增量更新逐层向上累加。'],[
      ['[1,2,3,4]; 查询1..3，加(2,5)，查询1..3','new int[]{1,2,3,4},new int[][]{{1,1,3},{0,2,5},{1,1,3}}','[9, 14]','查询与更新交错'],['[-5]; 查0..0，加(0,2)，查0..0','new int[]{-5},new int[][]{{1,0,0},{0,0,2},{1,0,0}}','[-5, -3]','单点与负数'],['[1,2]; 无操作','new int[]{1,2},new int[][]{}','[]','没有查询'],['[2147483647,2147483647]; 查询0..1','new int[]{2147483647,2147483647},new int[][]{{1,0,1}}','[4294967294]','和超过 int'],['[0,0,0]; 加首3，加尾-2，查全，查尾','new int[]{0,0,0},new int[][]{{0,0,3},{0,2,-2},{1,0,2},{1,2,2}}','[1, -2]','首尾边界']],'long'),
    exercise(13,2,segment,'线段树：赋值后查询区间最大值','public static long[] process(int[] initial, int[][] ops)','return new long[0];',['1≤n≤10⁵，操作数≤10⁵；所有区间合法。','[0,i,value] 为赋值；[1,l,r] 返回闭区间最大值。','返回 long[]，支持全负数，目标每次 O(log n)。'],['叶子补齐为 2 的幂。','未使用叶子与查询初值都设为 Long.MIN_VALUE。','单点赋值后沿父节点重新取 max。'],[
      ['[1,5,3]; 查全，设(1,-2)，查全','new int[]{1,5,3},new int[][]{{1,0,2},{0,1,-2},{1,0,2}}','[5, 3]','赋值改变最大项'],['[-5,-2,-9]; 查全，查2..2','new int[]{-5,-2,-9},new int[][]{{1,0,2},{1,2,2}}','[-2, -9]','全负数与末尾'],['[7]; 查，设-4，查','new int[]{7},new int[][]{{1,0,0},{0,0,-4},{1,0,0}}','[7, -4]','单叶子'],['[2,3]; 无操作','new int[]{2,3},new int[][]{}','[]','空操作'],['[5,5,1]; 设0为0，查0..1，设1为-1，查0..2','new int[]{5,5,1},new int[][]{{0,0,0},{1,0,1},{0,1,-1},{1,0,2}}','[5, 1]','相等最大值与连续赋值']],'long')
  ],[
    ['树状数组内部下标从 1 开始的重要原因？',['Java 数组不能使用0','lowbit(0)=0，更新无法前进','节省一个位置','强制数组有序'],1,'i+=lowbit(i) 在 i=0 时无法前进。'],
    ['逆序对中相等元素是否计数？',['计数两次','计数一次','不计数','由排序顺序决定'],2,'定义是严格 a[i]>a[j]，因此查询 rank-1。'],
    ['区间最大值的合适单位元是？',['0','1','负无穷','区间长度'],2,'任何合法值与负无穷取 max 仍为原值。'],
    ['懒标记下传给孩子后应做什么？',['保留不变','父节点 lazy 清零','孩子 sum 清零','删除节点'],1,'避免后续重复施加相同增量。']
  ],[['树状数组为何不能用“前缀最大值相减”求区间最大值？','最大值没有减法逆运算，两个前缀最大值无法还原区间最大值。动态区间最大值可以使用线段树。'],['懒标记究竟延迟了什么？','延迟把统一更新逐层传到孩子。本节点 sum 已经反映更新；只有需要进入孩子时才下传，避免把整段更新展开成逐点修改。']]);

  var dijkstra=example('DijkstraShortestDemo','导航距离：非负权有向图的最短路','实现 shortest(int n,int[][] edges,int start)，边为 [u,v,w]，w≥0；返回从 start 到所有节点的 long 距离，不可达填 -1。','n=4，边 [[0,1,4],[0,2,1],[2,1,2],[1,3,1]]，start=0，返回 [0,3,1,4]。','邻接表配优先队列，每次取当前最短距离；若弹出距离已过期则跳过，否则松弛出边。非负边保证最短的有效队首可以确定。支持平行边；本实现允许重复入堆，时间 O(n+E log(E+1))，辅助空间 O(n+E)。',
`    public static long[] shortest(int n, int[][] edges, int start) {
        List<List<int[]>> graph=new ArrayList<>();
        for(int i=0;i<n;i++)graph.add(new ArrayList<>());
        for(int[] e:edges){
            if(e[2]<0)throw new IllegalArgumentException("Dijkstra 要求边权非负");
            graph.get(e[0]).add(new int[]{e[1],e[2]});
        }
        long[] dist=new long[n]; Arrays.fill(dist,Long.MAX_VALUE); dist[start]=0;
        PriorityQueue<long[]> pq=new PriorityQueue<>(Comparator.comparingLong(a->a[0]));
        pq.offer(new long[]{0,start});
        while(!pq.isEmpty()){
            long[] item=pq.poll(); int u=(int)item[1]; long d=item[0];
            if(d!=dist[u])continue; // 曾经入堆的较差距离已失效。
            for(int[] edge:graph.get(u)){
                int v=edge[0]; long next=d+edge[1]; // long 累计路径长度。
                if(next<dist[v]){dist[v]=next;pq.offer(new long[]{next,v});}
            }
        }
        for(int i=0;i<n;i++)if(dist[i]==Long.MAX_VALUE)dist[i]=-1;
        return dist;
    }`, `        System.out.println(Arrays.toString(shortest(4,new int[][]{{0,1,4},{0,2,1},{2,1,2},{1,3,1}},0)));`, '[0, 3, 1, 4]');
  var zeroOne=example('ZeroOneBfsDemo','免费与收费通道：0-1 BFS','有向图的边权仅为 0 或 1，求起点到所有点的最短距离，不可达为 -1。','n=4，边 [[0,1,1],[0,2,0],[2,1,0],[1,3,1]]，起点 0，返回 [0,0,0,1]。','距离不增加的 0 边放队首，增加 1 的边放队尾，以双端队列维护分层距离。记录入队时的距离并跳过过期项，每个有效出队点只扫描一次，时间 O(n+E)，空间 O(n+E)。',
`    public static int[] shortest(int n,int[][] edges,int start){
        List<List<int[]>> g=new ArrayList<>();
        for(int i=0;i<n;i++)g.add(new ArrayList<>());
        for(int[] e:edges){
            if(e[2]!=0 && e[2]!=1)throw new IllegalArgumentException("边权只允许 0 或 1");
            g.get(e[0]).add(new int[]{e[1],e[2]});
        }
        int[] dist=new int[n];Arrays.fill(dist,Integer.MAX_VALUE);dist[start]=0;
        Deque<int[]> q=new ArrayDeque<>();q.offerFirst(new int[]{start,0});
        while(!q.isEmpty()){
            int[] item=q.pollFirst();int u=item[0];
            // 同一节点可能被更短距离重新入队，旧条目不再扩展。
            if(item[1]!=dist[u])continue;
            for(int[] e:g.get(u))if(dist[u]+e[1]<dist[e[0]]){
                dist[e[0]]=dist[u]+e[1];int[] next={e[0],dist[e[0]]};
                // 0 边不增加距离，放队首；1 边进入下一距离层，放队尾。
                if(e[1]==0)q.offerFirst(next);else q.offerLast(next);
            }
        }
        for(int i=0;i<n;i++)if(dist[i]==Integer.MAX_VALUE)dist[i]=-1;
        return dist;
    }`, `        System.out.println(Arrays.toString(shortest(4,new int[][]{{0,1,1},{0,2,0},{2,1,0},{1,3,1}},0)));`, '[0, 0, 0, 1]');
  var bellman=example('BellmanFordDemo','带负优惠的路线：Bellman-Ford 与负环检测','有向图允许负边。求起点最短距离；若存在从起点可达的负环，抛出异常；不可达距离输出 -1。','边 [[0,1,4],[0,2,5],[1,2,-2]] 的距离为 [0,4,2]。','重复松弛所有边至多 n-1 轮；第 n 轮仍能改善的可达边说明存在可达负环。无负环时最短简单路径至多 n-1 条边。时间 O(nE)，空间 O(n)。这里输出的 -1 也可能是合法负距离，真实系统可另存 reachable 标记。',
`    public static long[] shortest(int n,int[][] edges,int start){
        long[] d=new long[n];Arrays.fill(d,Long.MAX_VALUE);d[start]=0;
        for(int round=1;round<n;round++){
            boolean changed=false;
            for(int[] e:edges)if(d[e[0]]!=Long.MAX_VALUE && d[e[0]]+e[2]<d[e[1]]){
                d[e[1]]=d[e[0]]+e[2];changed=true;
            }
            if(!changed)break; // 一轮无改进即可提前结束。
        }
        // 第 n 轮仍能改善一条可达边，说明存在可达负环。
        for(int[] e:edges)if(d[e[0]]!=Long.MAX_VALUE && d[e[0]]+e[2]<d[e[1]])
            throw new IllegalArgumentException("存在从起点可达的负环");
        for(int i=0;i<n;i++)if(d[i]==Long.MAX_VALUE)d[i]=-1;
        return d;
    }`, `        System.out.println(Arrays.toString(shortest(3,new int[][]{{0,1,4},{0,2,5},{1,2,-2}},0)));
        try { shortest(2,new int[][]{{0,1,1},{1,0,-2}},0); }
        catch(IllegalArgumentException e){System.out.println("检测到负环");}`, '[0, 4, 2]\n检测到负环');
  var kruskal=example('KruskalMstDemo','最低布线成本：Kruskal 最小生成树','实现 minimumCost(int n,int[][] edges)，无向边为 [u,v,cost]，cost≥0。用最小总成本连通全部节点；无法连通返回 -1，单节点返回 0。','n=4，边 [[0,1,1],[1,2,2],[0,2,4],[2,3,3]]，返回 6。','边按权重从小到大排序；两端在不同连通分量时加入，用并查集合并。只选跨分量边，始终不成环；成功选 n-1 条边即连通。时间 O(E log(E+1)+Eα(n)+n)，空间 O(n+E)，复制外层数组避免改变输入顺序。',
`    public static long minimumCost(int n,int[][] edges){
        int[][] sorted=edges.clone();Arrays.sort(sorted,Comparator.comparingInt(e->e[2]));
        int[] parent=new int[n],size=new int[n];
        for(int i=0;i<n;i++){parent[i]=i;size[i]=1;}
        long total=0;int selected=0;
        for(int[] e:sorted){
            int a=find(parent,e[0]),b=find(parent,e[1]);
            if(a==b)continue; // 包括自环：加入就会成环。
            if(size[a]<size[b]){int tmp=a;a=b;b=tmp;}
            parent[b]=a;size[a]+=size[b];total+=e[2];selected++;
            if(selected==n-1)break;
        }
        return selected==n-1?total:-1; // 不连通图不能把森林成本当答案。
    }
    static int find(int[] p,int x){
        while(p[x]!=x){p[x]=p[p[x]];x=p[x];} // 路径压缩。
        return x;
    }`, `        System.out.println(minimumCost(4,new int[][]{{0,1,1},{1,2,2},{0,2,4},{2,3,3}}));
        System.out.println(minimumCost(3,new int[][]{{0,1,1}}));`, '6\n-1');
  var prim=example('PrimMstDemo','逐站接入：Prim 最小生成树','对无向带权图，从节点 0 开始，每次用最便宜的跨边把一个新节点接入，返回最小总成本；不连通返回 -1。','与 Kruskal 示例相同的图，总成本也为 6。','优先队列存从已接入点出发的候选边；弹出已经接入的点时跳过，新点接入后扩展出边。每次选择跨越当前切分的最轻边。重复候选堆实现时间 O(n+E log(E+1))，空间 O(n+E)。',
`    public static long minimumCost(int n,int[][] edges){
        List<List<int[]>> g=new ArrayList<>();for(int i=0;i<n;i++)g.add(new ArrayList<>());
        for(int[] e:edges){g.get(e[0]).add(new int[]{e[1],e[2]});g.get(e[1]).add(new int[]{e[0],e[2]});}
        boolean[] used=new boolean[n];int count=0;long total=0;
        PriorityQueue<int[]> pq=new PriorityQueue<>(Comparator.comparingInt(e->e[1]));
        pq.offer(new int[]{0,0}); // 起点接入成本为 0，不是一条真实边。
        while(!pq.isEmpty()){
            int[] edge=pq.poll();int u=edge[0];if(used[u])continue;
            // 累计接入边的成本，不是从起点到该点的距离。
            used[u]=true;count++;total+=edge[1];
            for(int[] next:g.get(u))if(!used[next[0]])pq.offer(next);
        }
        return count==n?total:-1;
    }`, `        System.out.println(minimumCost(4,new int[][]{{0,1,1},{1,2,2},{0,2,4},{2,3,3}}));`, '6');
  var mstDistinction=example('MstVersusPathDemo','目标辨析：最短路树与最小生成树','无向图边为 A-B=2、A-C=2、B-C=1。分别输出以 A 为起点的最短路树总边权和最小生成树总边权。','最短路树选 A-B、A-C，总边权 4；MST 选 B-C 加任一条权重 2 的边，总权重 3。','枚举三条边中任意两条，每组在这个三角形图中都构成生成树，最小和为 3；A 到 B、C 的直接边都是最短路，总和为 4。这个小型穷举用作反例验证，时间与空间均 O(1)，不替代一般图算法。',
`    public static long minimumTreeCost(int[] weights){
        long best=Long.MAX_VALUE;
        // 仅适用于三角形：任意两条不同边都恰好连通三个点。
        for(int i=0;i<3;i++)for(int j=i+1;j<3;j++)
            best=Math.min(best,(long)weights[i]+weights[j]);
        return best;
    }`, `        int ab=2,ac=2,bc=1;
        long shortestTree=(long)Math.min(ab,ac+bc)+Math.min(ac,ab+bc);
        System.out.println(shortestTree);
        System.out.println(minimumTreeCost(new int[]{ab,ac,bc}));`, '4\n3');
  chapter(14,'最短路径与最小生成树',['图','Dijkstra','0-1 BFS','Bellman-Ford','最小生成树','Kruskal','Prim'],['按边权条件选择最短路算法','识别不可达、负边与负环','用 Kruskal 与 Prim 最小成本连通网络'],'图、堆、并查集（第 7、9 章）',[
    section(14,1,'带权最短路径',['图','Dijkstra','0-1 BFS','Bellman-Ford'],'无权图的 BFS 按边数分层；带权图按累计距离选择扩展顺序。所有边权为 1 用 BFS，只有 0/1 用双端队列，一般非负权用 Dijkstra，允许负边时考虑 Bellman-Ford。存在从起点可达且能影响目标的负环时，目标最短距离可无限减小。',
      ['反复松弛所有边，用 Bellman-Ford 覆盖负边情况。','非负边用最小堆优先扩展当前距离最小的节点。','dist[v] 始终是一条真实已发现路径的长度；非负权保证有效最短队首不会再被改善。','此堆实现 O(n+E log(E+1))、空间 O(n+E)；0-1 BFS O(n+E)，Bellman-Ford O(nE)。','不能在第一次入堆时标记完成；旧距离弹出要跳过。'],
      [['负权边','Dijkstra 的非负前提不能省略；负边用 Bellman-Ford，且需要检测起点可达的负环。'],['距离溢出','路径和与优先队列距离都使用 long；不要用两数相减实现比较器。'],['有向与无向','本节最短路例子按有向边建表；若需求无向，必须额外加入反向边。']], [dijkstra,zeroOne,bellman],
      [['起点到某点先找到距离 10，之后找到距离 3，堆中的 10 怎么办？','可以保留，弹出时发现 d!=dist[u] 后跳过。这是过期项，不能再用它扩展。'],['0 权边能否使用普通 BFS 的首次入队即访问规则？','不能直接套用按边数的 BFS；0 权路径可能通过更多边获得更小距离，需要按距离松弛。']] ),
    section(14,2,'最小生成树与切分',['最小生成树','Kruskal','Prim','并查集'],'最小生成树要求用 n-1 条边连通全部点，最小化所有选中边的总权重。它适合布线和网络建设。Kruskal 从全图最轻边逐步合并分量；Prim 从一个已连接集合逐步接入新点。它们依据切分性质：跨越某个切分的最轻边是安全选择之一。',
      ['枚举所有 n-1 条边组合并检查连通，规模很快失控。','按边权排序，用并查集跳过成环边。','已选边形成森林，每次只合并两个不同分量，且可扩展为某棵 MST。','Kruskal O(E log(E+1)+Eα(n)+n)，此 Prim 堆实现 O(n+E log(E+1))。','必须检查连通；MST 不保证任意起点到每点都是最短路。'],
      [['不连通','选边不足 n-1 时只有生成森林，应按题意返回 -1。'],['相等边权','最小生成树可能不唯一，但最小总成本相同。'],['自环与平行边','自环直接跳过；平行边允许存在，排序与并查集会选择有用的便宜边。']], [kruskal,prim,mstDistinction],
      [['n 个点的生成树必须有多少条边？','n-1 条；还必须连通且无环，仅边数足够不能保证是生成树。'],['为什么最短路树不一定是 MST？','优化目标不同：最短路树优化起点到各点的距离，MST 优化选中边的总成本。三角形案例给出 4 与 3 的具体反例。']] )
  ],[
    exercise(14,1,dijkstra,'Dijkstra：所有节点最短距离','public static long[] shortest(int n, int[][] edges, int start)','return new long[n];',['1≤n≤10⁵，0≤E≤2×10⁵，节点 0..n-1。','有向边，权重为非负 int，允许平行边与自环。','返回 long[]，dist[start]=0，不可达为 -1；start 可为任意合法节点。'],['建邻接表，初始只有 start 距离为 0。','优先队列按 long 距离排序。','每次只处理 d==dist[u] 的有效条目。'],[
      ['n=4; edges=[[0,1,4],[0,2,1],[2,1,2],[1,3,1]]; start=0','4,new int[][]{{0,1,4},{0,2,1},{2,1,2},{1,3,1}},0','[0, 3, 1, 4]','较短路线覆盖旧距离'],['n=3; edges=[]; start=1','3,new int[][]{},1','[-1, 0, -1]','任意起点与不可达'],['n=3; edges=[[0,1,0],[1,2,0],[2,0,0]]; start=0','3,new int[][]{{0,1,0},{1,2,0},{2,0,0}},0','[0, 0, 0]','零权环'],['n=3; edges=[[0,1,2147483647],[1,2,2147483647]]; start=0','3,new int[][]{{0,1,2147483647},{1,2,2147483647}},0','[0, 2147483647, 4294967294]','距离超过 int'],['n=2; edges=[[0,0,0],[0,1,9],[0,1,2]]; start=0','2,new int[][]{{0,0,0},{0,1,9},{0,1,2}},0','[0, 2]','自环与平行边']],'long'),
    exercise(14,2,kruskal,'Kruskal：最低连通成本','public static long minimumCost(int n,int[][] edges)','return 0;',['1≤n≤10⁵，0≤E≤2×10⁵，节点 0..n-1。','无向边，成本为非负 int，允许平行边与自环。','返回 long；不连通返回 -1，单节点无边返回 0，不改变输入顺序。'],['按边权升序。','两端代表元相同时跳过。','累计选边数，最后判断是否为 n-1。'],[
      ['n=4; [[0,1,1],[1,2,2],[0,2,4],[2,3,3]]','4,new int[][]{{0,1,1},{1,2,2},{0,2,4},{2,3,3}}',6,'常规连通图'],['n=3; [[0,1,1]]','3,new int[][]{{0,1,1}}',-1,'不连通'],['n=1; []','1,new int[][]{}',0,'单节点'],['n=3; [[0,0,0],[0,1,9],[0,1,2],[1,2,3]]','3,new int[][]{{0,0,0},{0,1,9},{0,1,2},{1,2,3}}',5,'跳过自环与较贵平行边'],['n=3; [[0,1,2147483647],[1,2,2147483647],[0,2,2147483647]]','3,new int[][]{{0,1,2147483647},{1,2,2147483647},{0,2,2147483647}}','4294967294','成本超过 int']])
  ],[
    ['Dijkstra 的边权条件？',['所有边必须为1','所有边非负','必须有负边','所有边不同'],1,'非负边保证最小有效距离的贪心扩展正确。'],
    ['0-1 BFS 中权重 0 的改进应放哪里？',['队首','队尾','随意','不入队'],0,'0 权改进不增加距离，应优先处理。'],
    ['Kruskal 通过什么避免选边成环？',['入度','并查集判断两端是否同分量','字符串比较','DFS 深度'],1,'已同分量的边会形成环。'],
    ['关于最短路树与 MST，哪个正确？',['必定相同','MST 优化所有起点距离','优化目标不同，可能选不同边','MST 必须以0为根'],2,'MST 最小化总边权；最短路树最小化给定起点到各点距离。']
  ],[['Dijkstra 为何需要跳过过期堆元素？','一个点可能被多次改善并入堆。旧条目对应较差距离，跳过能避免重复扩展，也让复杂度推导与实际实现一致。'],['Kruskal 选最便宜边为何不是随意贪心？','按权重处理跨分量边，对当前分量构成的切分，这条边是最轻跨边之一，可由交换论证证明不会排除所有最优生成树。']]);

  var pack={version:1,chapters:chapters,banks:banks,guides:guides};
  if(typeof module!=='undefined' && module.exports)module.exports=pack;
  else {
    root.COURSE=(root.COURSE||[]).concat(chapters);
    root.EXERCISE_TESTS=Object.assign(root.EXERCISE_TESTS||{},banks);
    root.LESSON_GUIDES=Object.assign(root.LESSON_GUIDES||{},guides);
    root.ADVANCED_CHAPTERS=pack;
  }
})(typeof window!=='undefined'?window:globalThis);
