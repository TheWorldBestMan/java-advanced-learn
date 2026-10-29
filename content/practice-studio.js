/* 新练习均使用公开输入与真实 Java 方法调用；内容由浏览器与本地运行器共用。 */
(function(root){
  'use strict';
  var J=String.raw,bugs=[],projects=[],banks={};
  function arr(a){return 'new int[]{'+a.join(',')+'}';}
  function mat(a){return 'new int[][]{'+a.map(function(r){return '{'+r.join(',')+'}';}).join(',')+'}';}
  function str(s){return JSON.stringify(s);}
  function program(name,methods,main){return 'import java.util.*;\n\npublic class '+name+' {\n'+methods+'\n    public static void main(String[] args) {\n'+main+'\n    }\n}';}
  function tests(id,name,rows){var spec={className:name,tests:rows.map(function(r,i){return {id:id+'-t'+(i+1),input:JSON.stringify(r[0]),expected:String(r[2]),note:r[3],setup:'Object subject=new '+name+'();',expression:r[1]};})};banks[id]=spec;return spec.tests;}
  function bug(meta,methods,from,to,main,rows){if(!methods.includes(from))throw Error('未找到故障注入点：'+meta.id);meta.kind='bug';meta.solution=program(meta.className,methods,main);meta.starter=program(meta.className,methods.replace(from,to),main);meta.tests=tests(meta.id,meta.className,rows);bugs.push(meta);}
  bug({id:'bug-binary',className:'DebugBinary',title:'二分查找：最后一个候选去哪了？',chapterId:'c4',level:'入门',tags:['二分','边界'],brief:'程序能找到部分目标，却在单元素数组或某些端点上返回 -1。修好 search，保留 O(log n) 的查找过程。',contract:'int search(int[] a, int target)，升序且无重复值，找不到返回 -1。',requirements:['检查候选区间的开闭含义','覆盖单元素与未命中情况','每轮必须严格缩小范围'],hints:['先只输入一个元素，观察循环有没有执行。','本程序的 right 初值是 a.length-1，表示闭区间。','闭区间还剩一个候选时，也必须检查它。'],analysis:'left==right 时仍有一个候选位置。使用 left<=right 才能检查它；中点左右收缩仍分别使用 mid+1、mid-1。'},J`    public int search(int[] a,int target) {
        int left=0,right=a.length-1;
        while(left<=right) {
            int mid=left+(right-left)/2;
            if(a[mid]==target) return mid;
            if(a[mid]<target) left=mid+1; else right=mid-1;
        }
        return -1;
    }`,'while(left<=right)','while(left<right)',J`        System.out.println(new DebugBinary().search(new int[]{7},7));`,[
    [[[7],7],'call(subject,"search",'+arr([7])+',7)',0,'单个候选'],[[[1,3,5],5],'call(subject,"search",'+arr([1,3,5])+',5)',2,'末端命中'],[[[1,3,5],2],'call(subject,"search",'+arr([1,3,5])+',2)',-1,'未命中'],[[[],1],'call(subject,"search",'+arr([])+',1)',-1,'空数组'],[[[1,3,5,7],1],'call(subject,"search",'+arr([1,3,5,7])+',1)',0,'首端命中']]);
  bug({id:'bug-list',className:'DebugReverseList',title:'链表反转：后面的节点丢了',chapterId:'c1',level:'进阶',tags:['链表','指针'],brief:'反转后只剩一个节点。请复用原节点完成反转，禁止用新链表替代结果。',contract:'ListNode reverse(ListNode head)，空链表返回 null。',requirements:['保留尚未处理的后缀','每次只翻转一条 next 边','结果不能成环，且复用全部原节点'],hints:['修改 cur.next 后，原来的后继还在吗？','需要一个临时变量保存尚未处理的节点。','先保存 next，再翻转边，最后让 cur 前进到保存的位置。'],analysis:'错误代码在翻转 cur.next 后沿着已翻转的边前进，失去原后继。先保存 Node next=cur.next，再改变指针，才能继续遍历原链表。'},J`    static class ListNode { int val; ListNode next; ListNode(int val){this.val=val;} }
    public ListNode reverse(ListNode head) {
        ListNode prev=null,cur=head;
        while(cur!=null) {
            ListNode next=cur.next;
            cur.next=prev;
            prev=cur; cur=next;
        }
        return prev;
    }`,'ListNode next=cur.next;','ListNode next=prev;',J`        ListNode a=new ListNode(1);a.next=new ListNode(2);a.next.next=new ListNode(3);
        for(ListNode p=new DebugReverseList().reverse(a);p!=null;p=p.next)System.out.print(p.val+" ");`,[[],[1],[1,2,3],[1,1,2],[-1,0,2]].map(function(a){return [[a],'reverseList(subject,'+arr(a)+')',JSON.stringify(a.slice().reverse()).replace(/,/g,', '),'检查反转结果与原节点复用'];}));
  bug({id:'bug-stack',className:'DebugNextGreater',title:'单调栈：一次只弹一个够吗？',chapterId:'c2',level:'进阶',tags:['栈','单调栈'],brief:'部分元素明明能被当前值解决，却仍返回 -1。修好右侧首个更大值算法。',contract:'int[] next(int[] a)，没有更大值的位置为 -1，严格更大。',requirements:['一个新值可能解决多个旧下标','重复值不能互相作为更大值','保持总时间 O(n)'],hints:['试试 [2,1,3]，3 应该同时解决几个位置？','检查弹出栈顶后，新栈顶是否也满足条件。','这里需要反复判断，而非只判断一次。'],analysis:'把 if 改成 while。每个下标只入栈一次、出栈至多一次，反复弹栈的总工作量仍为 O(n)。'},J`    public int[] next(int[] a) {
        int[] answer=new int[a.length];Arrays.fill(answer,-1);
        Deque<Integer> stack=new ArrayDeque<>();
        for(int i=0;i<a.length;i++) {
            while(!stack.isEmpty() && a[i]>a[stack.peek()]) answer[stack.pop()]=a[i];
            stack.push(i);
        }
        return answer;
    }`,'while(!stack.isEmpty()','if(!stack.isEmpty()',J`        System.out.println(Arrays.toString(new DebugNextGreater().next(new int[]{2,1,3})));`,[
    [[2,1,3],[3,3,-1]],[[2,1,2,4,3],[4,2,4,-1,-1]],[[2,2,2],[-1,-1,-1]],[[],[]],[[3,2,1],[-1,-1,-1]]
  ].map(function(r){return [[r[0]],'Arrays.toString((int[])call(subject,"next",'+arr(r[0])+'))',JSON.stringify(r[1]).replace(/,/g,', '),'同时弹出、重复值与边界'];}));
  bug({id:'bug-backpack',className:'DebugKnapsack',title:'0-1 背包：一件物品被选了两次',chapterId:'c8',level:'进阶',tags:['动态规划','背包'],brief:'只有一件物品时，计算出的价值竟然像取了多件。修好容量更新方向。',contract:'int solve(int[] weight,int[] value,int capacity)，每件至多选一次，重量为正。',requirements:['明确 dp[c] 的含义','每件只能使用上一轮状态','允许不装满背包'],hints:['只有重量 2、价值 3 的一件物品，容量 4 应是多少？','正序更新时，dp[c-weight] 可能已经包含当前物品。','0-1 背包容量倒序，完全背包才通常正序。'],analysis:'倒序容量确保 dp[c-weight[i]] 尚未被本轮更新，当前物品不会被重复使用。'},J`    public int solve(int[] weight,int[] value,int capacity) {
        int[] dp=new int[capacity+1];
        for(int i=0;i<weight.length;i++) {
            for(int c=capacity;c>=weight[i];c--) dp[c]=Math.max(dp[c],dp[c-weight[i]]+value[i]);
        }
        return dp[capacity];
    }`,'for(int c=capacity;c>=weight[i];c--)','for(int c=weight[i];c<=capacity;c++)',J`        System.out.println(new DebugKnapsack().solve(new int[]{2},new int[]{3},4));`,[
    [[2],[3],4,3],[[2,3],[3,4],5,7],[[5],[9],3,0],[[],[],5,0],[[1,2],[2,3],2,3]
  ].map(function(a){return [[a[0],a[1],a[2]],'call(subject,"solve",'+arr(a[0])+','+arr(a[1])+','+a[2]+')',a[3],'防止重复选取与容量边界'];}));
  bug({id:'bug-window',className:'DebugWindow',title:'滑动窗口：左边界倒退了',chapterId:'c3',level:'进阶',tags:['滑动窗口','字符串'],brief:'abba 的答案被算成 3。找到重复字符以后，窗口左端只能向右移动。',contract:'int longest(String s)，返回最长无重复连续子串长度。',requirements:['只排除窗口内的旧重复字符','左边界不可倒退','空字符串返回 0'],hints:['处理最后一个 a 时，旧 a 是否还在当前窗口中？','记录最近下标不代表它一定在窗口里。','更新左边界时要与当前 left 取最大值。'],analysis:'使用 left=Math.max(left,last.get(c)+1)，避免窗口外的旧下标把左边界拉回去。'},J`    public int longest(String s) {
        Map<Character,Integer> last=new HashMap<>();int left=0,best=0;
        for(int right=0;right<s.length();right++) {
            char c=s.charAt(right);
            if(last.containsKey(c)) left=Math.max(left,last.get(c)+1);
            last.put(c,right);best=Math.max(best,right-left+1);
        }
        return best;
    }`,'left=Math.max(left,last.get(c)+1)','left=last.get(c)+1',J`        System.out.println(new DebugWindow().longest("abba"));`,[['abba',2],['',0],['abcabcbb',3],['bbbbb',1],['tmmzuxt',5]].map(function(r){return [[r[0]],'call(subject,"longest",'+str(r[0])+')',r[1],'窗口边界与重复字符'];}));
  bug({id:'bug-negative',className:'DebugMaximum',title:'最大子数组：全是负数怎么办？',chapterId:'c8',level:'入门',tags:['动态规划','数组'],brief:'输入全负数时返回了不存在的 0。题目要求至少选择一个元素。',contract:'int maxSum(int[] a)，数组非空，返回非空连续子数组的最大和。',requirements:['答案必须来自非空子数组','区分空前缀与合法答案','单个负数也要正确'],hints:['输入 [-5] 时，0 是合法答案吗？','检查 best 的初始值。','可以把 best 初始化为首元素，或最小整数。'],analysis:'best=0 等价于允许选空数组。将 best 初始化为 a[0]，保持“至少选一个元素”的定义。'},J`    public int maxSum(int[] a) {
        int current=0,best=a[0];
        for(int x:a){current=Math.max(x,current+x);best=Math.max(best,current);}
        return best;
    }`,'best=a[0]','best=0',J`        System.out.println(new DebugMaximum().maxSum(new int[]{-5,-2,-8}));`,[[[-5,-2,-8],-2],[[-7],-7],[[1,2,3],6],[[0,-1,0],0],[[-2,1,-3,4,-1,2,1,-5,4],6]].map(function(r){return [[r[0]],'call(subject,"maxSum",'+arr(r[0])+')',r[1],'非空要求与最大和'];}));
  var history=J`    public String edit(String operations) {
        Deque<String> undo=new ArrayDeque<>(),redo=new ArrayDeque<>();String text="";
        if(operations.isEmpty())return text;
        for(String op:operations.split(";")) {
            if(op.startsWith("TYPE:")){undo.push(text);text+=op.substring(5);redo.clear();}
            else if(op.equals("UNDO")&&!undo.isEmpty()){redo.push(text);text=undo.pop();}
            else if(op.equals("REDO")&&!redo.isEmpty()){undo.push(text);text=redo.pop();}
        }
        return text;
    }`;
  var historyRows=[['TYPE:a;TYPE:b;UNDO;TYPE:c;REDO','ac'],['TYPE:猫;TYPE:狗;UNDO;REDO','猫狗'],['UNDO;REDO',''],['TYPE:a;UNDO;TYPE:z;REDO','z'],['TYPE:abc;UNDO','']].map(function(r){return [[r[0]],'call(subject,"edit",'+str(r[0])+')',r[1],'撤销、重做与新编辑分支'];});
  bug({id:'bug-history',className:'DebugHistory',title:'撤销重做：旧分支又回来了',chapterId:'c2',level:'进阶',tags:['栈','撤销'],brief:'撤销后输入新文字，再点重做，竟回到了被丢弃的旧内容。修好历史分支。',contract:'String edit(String operations)，操作用分号分隔：TYPE:文字、UNDO、REDO；无历史时撤销/重做不改变文本。',requirements:['修改前保存旧状态','撤销与重做分别使用一个栈','新编辑应产生新的历史分支'],hints:['先输入 ab，撤销 b，再输入 c，期望文本是什么？','新分支产生后，旧的 redo 还有效吗？','发生 TYPE 时清空重做栈。'],analysis:'新编辑会使撤销前的重做分支失效，因此 TYPE 后必须执行 redo.clear()。'},history,'redo.clear();','',J`        System.out.println(new DebugHistory().edit("TYPE:a;TYPE:b;UNDO;TYPE:c;REDO"));`,historyRows);
  bug({id:'bug-topo',className:'DebugCourses',title:'课程依赖：孤立课程被漏掉了',chapterId:'c9',level:'进阶',tags:['图','拓扑排序'],brief:'没有依赖的课程也必须计入总数。修好初始化队列的规则。',contract:'boolean canFinish(int n,int[][] prerequisites)，每对 [course,pre] 表示先修 pre，课程编号 0~n-1。',requirements:['为所有课程统计入度','无前置依赖的孤立课程也可入队','处理数等于 n 才能全部完成'],hints:['n=3 且没有任何依赖时，答案应该是 true。','初始队列是否只检查了有出边的节点？','所有入度为 0 的节点都要入队，包括孤立节点。'],analysis:'初始入队条件只应是 indegree[i]==0，不能额外要求节点有出边。'},J`    public boolean canFinish(int n,int[][] prerequisites) {
        List<List<Integer>> graph=new ArrayList<>();for(int i=0;i<n;i++)graph.add(new ArrayList<>());
        int[] degree=new int[n];for(int[] edge:prerequisites){graph.get(edge[1]).add(edge[0]);degree[edge[0]]++;}
        Queue<Integer> queue=new ArrayDeque<>();for(int i=0;i<n;i++)if(degree[i]==0)queue.offer(i);
        int count=0;while(!queue.isEmpty()){int u=queue.poll();count++;for(int v:graph.get(u))if(--degree[v]==0)queue.offer(v);}
        return count==n;
    }`,'if(degree[i]==0)','if(degree[i]==0&&!graph.get(i).isEmpty())',J`        System.out.println(new DebugCourses().canFinish(3,new int[][]{}));`,[[3,[],true],[2,[[1,0]],true],[2,[[1,0],[0,1]],false],[1,[],true],[4,[[1,0]],true]].map(function(r){return [[r[0],r[1]],'call(subject,"canFinish",'+r[0]+','+mat(r[1])+')',r[2],'包含孤立节点、依赖与有向环'];}));

  function project(meta,methods,starterMethods,main,rows){meta.kind='project';meta.solution=program(meta.className,methods,main);meta.starter=program(meta.className,starterMethods,main);meta.tests=tests(meta.id,meta.className,rows);projects.push(meta);}
  var lru=J`    static class Node { int key,value;Node prev,next;Node(int key,int value){this.key=key;this.value=value;} }
    private Map<Integer,Node> index;
    private Node head,tail;
    private int capacity;
    private void remove(Node n){n.prev.next=n.next;n.next.prev=n.prev;}
    private void addFirst(Node n){n.next=head.next;n.prev=head;head.next.prev=n;head.next=n;}
    private int get(int key){Node n=index.get(key);if(n==null)return -1;remove(n);addFirst(n);return n.value;}
    private void put(int key,int value){
        Node n=index.get(key);
        if(n!=null){n.value=value;remove(n);addFirst(n);return;}
        n=new Node(key,value);index.put(key,n);addFirst(n);
        if(index.size()>capacity){Node old=tail.prev;remove(old);index.remove(old.key);}
    }
    public String simulate(int capacity,String operations){
        this.capacity=capacity;index=new HashMap<>();head=new Node(0,0);tail=new Node(0,0);head.next=tail;tail.prev=head;
        List<String> output=new ArrayList<>();
        for(String op:operations.split(";")){
            String[] part=op.split(":");
            if(part[0].equals("put"))put(Integer.parseInt(part[1]),Integer.parseInt(part[2]));
            else if(part[0].equals("get"))output.add(String.valueOf(get(Integer.parseInt(part[1]))));
        }
        return String.join(",",output);
    }`;
  var lruStarter=lru.replace('n.prev.next=n.next;n.next.prev=n.prev;','// TODO：从链表中摘掉 n，连接前后节点\n    ')
    .replace('n.next=head.next;n.prev=head;head.next.prev=n;head.next=n;','// TODO：把 n 放到 head 后面\n    ')
    .replace('Node n=index.get(key);if(n==null)return -1;remove(n);addFirst(n);return n.value;','// TODO：查询、移到最近使用端\n        return -1;')
    .replace(/    private void put\(int key,int value\)\{[\s\S]*?\n    \}/,'    private void put(int key,int value){\n        // TODO：更新已有值；插入新值；超容量时淘汰尾部节点\n    }');
  project({id:'project-lru',className:'LruWorkshop',title:'LRU 缓存实验室',chapterId:'c2',level:'挑战',tags:['哈希表','链表','缓存'],brief:'用哈希表定位节点，用双向链表维护最近访问顺序。实现容量限制、读取刷新、更新已有键和自动淘汰。',contract:'String simulate(int capacity,String operations)。操作以分号分隔，put:键:值 或 get:键；返回所有 get 结果，以逗号分隔，未命中为 -1。capacity 为 1~20。',requirements:['设计 Map 与双向链表节点','实现摘除与插到表头','get 命中后刷新顺序','put 更新时不增加节点数','容量超限时同时删除链表和 Map 中的旧项'],milestones:['画出 head、tail 与节点连接关系','完成 remove 和 addFirst','完成 get 的命中/未命中路径','完成 put 更新、插入、淘汰','通过容量 1、更新与交错访问测试'],hints:['head 和 tail 使用哨兵，省去首尾特判。','访问命中后把节点移到 head 后，tail.prev 就是最久未用节点。','淘汰时要同时从链表和 Map 删除，否则两种结构会不同步。'],analysis:'Map 保存 key→Node，双向链表按最近使用程度排列。get/put 命中时摘除再头插；新项加入后若超容量，删掉 tail.prev。单次操作平均 O(1)，空间 O(capacity)。'},lru,lruStarter,J`        System.out.println(new LruWorkshop().simulate(2,"put:1:10;put:2:20;get:1;put:3:30;get:2;get:3"));`,[
    [2,'put:1:10;put:2:20;get:1;put:3:30;get:2;get:3','10,-1,30'],[1,'put:1:10;get:1;put:2:20;get:1;get:2','10,-1,20'],[2,'put:1:1;put:1:9;get:1','9'],[2,'put:1:1;put:2:2;get:1;put:3:3;get:2','1,-1'],[2,'get:9;put:9:-4;get:9','-1,-4']
  ].map(function(r){return [[r[0],r[1]],'call(subject,"simulate",'+r[0]+','+str(r[1])+')',r[2],'容量、刷新顺序与更新已有键'];}));
  var maze=J`    public String shortestPath(String[] rows){
        int height=rows.length,width=rows[0].length(),start=-1,target=-1;
        for(int r=0;r<height;r++)for(int c=0;c<width;c++){
            if(rows[r].charAt(c)=='S')start=r*width+c;
            if(rows[r].charAt(c)=='T')target=r*width+c;
        }
        int[] parent=new int[height*width];Arrays.fill(parent,-2);parent[start]=-1;
        Queue<Integer> queue=new ArrayDeque<>();queue.offer(start);
        int[][] dirs={{0,1},{1,0},{0,-1},{-1,0}}; // 右、下、左、上；固定并列路线顺序
        while(!queue.isEmpty()){
            int u=queue.poll();if(u==target)break;
            for(int[] d:dirs){int r=u/width+d[0],c=u%width+d[1];
                if(r<0||r>=height||c<0||c>=width||rows[r].charAt(c)=='#')continue;
                int v=r*width+c;if(parent[v]!=-2)continue;
                parent[v]=u;queue.offer(v); // 入队就记录父节点，避免重复访问
            }
        }
        if(parent[target]==-2)return "NO_PATH";
        List<String> path=new ArrayList<>();
        for(int u=target;u!=-1;u=parent[u])path.add((u/width)+","+(u%width));
        Collections.reverse(path);return String.join("->",path);
    }`;
  project({id:'project-maze',className:'MazeWorkshop',title:'迷宫导航与路径还原',chapterId:'c6',level:'进阶',tags:['BFS','图','最短路径'],brief:'读取字符迷宫，找出最少步数路线，再用父节点从终点还原完整路径。',contract:'String shortestPath(String[] rows)，矩形网格 1~20 行列，恰有一个 S、一个 T；# 是墙，. 可走。返回坐标链 r,c->r,c；无路返回 NO_PATH。多条最短路按右、下、左、上顺序探索。',requirements:['定位起终点并校验上下左右边界','用 BFS 而非贪心猜方向','入队即标记并保存 parent','从终点回溯并反转路径','处理被墙隔断的终点'],milestones:['把二维坐标编码为一个整数','完成队列扩展和访问标记','记录每个格子的父节点','还原起点到终点的坐标链','通过有路、无路、分支和相邻终点测试'],hints:['编号 r*width+c 可用 /width 和 %width 还原坐标。','parent=-2 表示未访问，起点 parent=-1。','BFS 首次发现终点就是最短路；按 parent 倒走后要反转。'],analysis:'BFS 按距离递增扩展，每格最多入队一次。首次发现时记录父节点，从终点沿 parent 回溯到起点即可还原最短路。时间与空间均为 O(行×列)。'},maze,J`    public String shortestPath(String[] rows){
        // TODO 1：找到 S/T，建立访问标记与 parent
        // TODO 2：队列 BFS，按右、下、左、上扩展
        // TODO 3：还原路径；不可达时返回 NO_PATH
        return "NO_PATH";
    }`,J`        System.out.println(new MazeWorkshop().shortestPath(new String[]{"S..",".#.","..T"}));`,[
    [['S.T'],'0,0->0,1->0,2'],[['S#T'],'NO_PATH'],[['S..','.#.','..T'],'0,0->0,1->0,2->1,2->2,2'],[['S.','#T'],'0,0->0,1->1,1'],[['ST'],'0,0->0,1']
  ].map(function(r){return [[r[0]],'call(subject,"shortestPath",(Object)new String[]{'+r[0].map(str).join(',')+'})',r[1],'网格边界、最短路与路径顺序'];}));
  var scheduler=J`    public String schedule(int n,int[][] prerequisites,int[] priority){
        List<List<Integer>> graph=new ArrayList<>();for(int i=0;i<n;i++)graph.add(new ArrayList<>());
        int[] degree=new int[n];for(int[] edge:prerequisites){graph.get(edge[1]).add(edge[0]);degree[edge[0]]++;}
        PriorityQueue<Integer> ready=new PriorityQueue<>((a,b)->priority[a]!=priority[b]?Integer.compare(priority[a],priority[b]):Integer.compare(a,b));
        for(int i=0;i<n;i++)if(degree[i]==0)ready.offer(i);
        List<String> order=new ArrayList<>();
        while(!ready.isEmpty()){
            int u=ready.poll();order.add(String.valueOf(u));
            for(int v:graph.get(u))if(--degree[v]==0)ready.offer(v);
        }
        return order.size()==n?String.join(",",order):"CYCLE";
    }`;
  project({id:'project-scheduler',className:'SchedulerWorkshop',title:'带优先级的任务依赖调度器',chapterId:'c9',level:'挑战',tags:['拓扑排序','堆','图'],brief:'前置任务完成后才能执行后续任务；多个任务就绪时，优先处理优先级数字更小的任务。',contract:'String schedule(int n,int[][] prerequisites,int[] priority)。每对 [task,pre] 表示前置关系；编号 0~n-1，n 为 1~20。同优先级按编号升序，返回逗号分隔顺序；有环返回 CYCLE。',requirements:['构建邻接表和入度','把全部初始就绪任务加入优先队列','处理任务后释放后继依赖','优先级相同时按编号排序','处理不足 n 个任务时报告有环'],milestones:['从依赖对建立图与入度','实现就绪队列比较器','完成消除依赖的主循环','增加有向环检测','通过孤立任务、同优先级和有环测试'],hints:['把普通 Kahn 队列换成 PriorityQueue。','只有入度降到 0 才能进入就绪堆。','不能直接按全体任务的优先级排序，依赖关系优先。'],analysis:'拓扑排序保证前置条件，优先队列只在已就绪任务中选优先级最高者。每条边处理一次，堆操作共 O(n log n)，总时间 O(E+n log n)。'},scheduler,J`    public String schedule(int n,int[][] prerequisites,int[] priority){
        // TODO：建图、计算入度、就绪小顶堆、更新依赖与检测环
        return "CYCLE";
    }`,J`        System.out.println(new SchedulerWorkshop().schedule(4,new int[][]{{1,0},{2,0},{3,1},{3,2}},new int[]{5,3,1,0}));`,[
    [4,[[1,0],[2,0],[3,1],[3,2]],[5,3,1,0],'0,2,1,3'],[3,[],[3,1,2],'1,2,0'],[2,[[1,0],[0,1]],[1,2],'CYCLE'],[3,[[2,0]],[1,1,1],'0,1,2'],[4,[[1,0]],[4,2,0,1],'2,3,0,1']
  ].map(function(r){return [[r[0],r[1],r[2]],'call(subject,"schedule",'+r[0]+','+mat(r[1])+','+arr(r[2])+')',r[3],'依赖优先、优先级与并列次序'];}));
  project({id:'project-editor',className:'EditorWorkshop',title:'支持 Undo / Redo 的文本编辑器',chapterId:'c2',level:'进阶',tags:['栈','撤销','字符串'],brief:'实现文本追加、撤销、重做和新编辑分支，体会两个栈如何维护操作历史。',contract:'String edit(String operations)，操作以分号分隔：TYPE:文字、UNDO、REDO；文字不含分号。最多 200 条操作，无历史时保持原样，返回最终文本。',requirements:['追加前保存文本快照','Undo 把当前状态移到 redo','Redo 把当前状态移到 undo','新 TYPE 清空 redo','空历史操作保持文本不变'],milestones:['解析命令并完成 TYPE','用 undo 保存修改前快照','实现 REDO 的反向转移','处理新编辑分支','通过空历史和连续撤销重做测试'],hints:['两个栈里保存的是文本状态，而不是一个字符。','对称理解：撤销前保存到 redo，重做前保存到 undo。','新文字产生新分支，旧 redo 就要清空。'],analysis:'修改前保存完整状态，Undo/Redo 在两个栈之间转移快照，空栈时不做操作。示例采用完整文本快照，拼接和保存成本与文本长度有关；长文本可进一步改为命令增量记录。'},history,J`    public String edit(String operations){
        Deque<String> undo=new ArrayDeque<>(),redo=new ArrayDeque<>();String text="";
        // TODO：逐项解析 TYPE/UNDO/REDO，注意新编辑分支
        return text;
    }`,J`        System.out.println(new EditorWorkshop().edit("TYPE:猫;TYPE:狗;UNDO;TYPE:咪;REDO"));`,[
    ['TYPE:猫;TYPE:狗;UNDO;REDO','猫狗'],['TYPE:a;TYPE:b;UNDO;TYPE:c;REDO','ac'],['UNDO;REDO',''],['TYPE:a;TYPE:b;UNDO;UNDO;REDO','a'],['','']
  ].map(function(r){return [[r[0]],'call(subject,"edit",'+str(r[0])+')',r[1],'追加、双栈历史与分支'];}));
  var data={bugs:bugs,projects:projects,banks:banks};
  if(typeof module!=='undefined'&&module.exports)module.exports=data;else root.PRACTICE_STUDIO=data;
})(typeof window!=='undefined'?window:this);
