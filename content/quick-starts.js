/* 概念与运用场景之间的入门层：符号/方法速查 + 独立可运行的最小示例。 */
(function(root){
  'use strict';
  var entries={};
  function add(key,title,intro,rows,body,output,steps,pitfall,helpers){
    var parts=key.split('/'),name='Quick'+parts[0].toUpperCase()+parts[1].toUpperCase();
    entries[key]={t:'quick-start',title:title,intro:intro,rows:rows,steps:steps,pitfall:pitfall,
      item:{id:'quick-'+parts.join('-'),scenario:title,code:'import java.util.*;\n\npublic class '+name+' {\n'+(helpers?helpers+'\n':'')+'    public static void main(String[] args) {\n'+body+'\n    }\n}',expectedOutput:output}};
  }
  add('c1/s1','读取、修改并遍历一个数组','先用三个数字观察下标、长度和遍历；数组下标从 0 开始。',[
    ['int[] a = {...}','创建固定长度的整数数组','int[] a = {3,4,5};','创建后长度不随元素赋值而改变。'],
    ['a.length','读取数组长度','a.length','这是字段，不加括号；本例为 3。'],
    ['a[i]','按下标读取或修改','a[1] = 9;','第 2 项变为 9；合法下标为 0..length-1。'],
    ['for (int x : a)','依次读取数组元素','sum += x;','增强 for 适合读取；要按位置修改时使用下标。'],
    ['Arrays.toString(a)','得到便于查看的数组内容','Arrays.toString(a)','直接打印 a 通常不会得到元素列表。']
  ],`        int[] a = {3,4,5};
        System.out.println(a.length); // 长度是 3，下标范围是 0..2。
        System.out.println(a[1]);
        a[1] = 9; // 修改第二项。
        int sum = 0;
        for (int x : a) sum += x;
        System.out.println(Arrays.toString(a));
        System.out.println(sum);`, '3\n4\n[3, 9, 5]\n17',
    ['先读长度与第二项，确认长度不是最后一个下标。','修改 a[1] 后再遍历，因此求和使用的是 3、9、5。'],
    '循环读取 a[i] 时必须保证 i<a.length；不要写成 i<=a.length。');
  add('c1/s2','访问字符、截取和反转字符串','用一个短单词区分长度、字符、子串和新字符串。',[
    ['s.length()','字符串长度','s.length()','String 使用方法；数组使用 .length 字段。'],
    ['s.charAt(i)','读取一个 char','s.charAt(1)','下标从 0 开始；char 是 UTF-16 代码单元。'],
    ['s.substring(l,r)','提取半开区间','s.substring(1,3)','包含 l，不包含 r；本例得到 av。'],
    ['s.equals(other)','比较文本内容','s.equals("java")','== 比较引用；equals 比较内容。'],
    ['StringBuilder.reverse()','反转构建器中的字符序列','new StringBuilder(s).reverse()','本例使用普通英文字母；结果再转成 String。']
  ],`        String s = "java";
        System.out.println(s.length());
        System.out.println(s.charAt(1)); // 第二个字符是 a。
        System.out.println(s.substring(1,3)); // [1,3)，不包含下标 3。
        System.out.println(s.equals(new String("java")));
        System.out.println(new StringBuilder(s).reverse().toString());`, '4\na\nav\ntrue\navaj',
    ['对照下标 0:j、1:a、2:v、3:a 读取字符和子串。','反转得到新结果，原来的 s 仍然是 java。'],
    'String 不可变；调用返回新字符串的方法后，需要接收返回值。');
  add('c1/s3','在两个节点之间插入一个节点','只处理 1→3，在中间插入 2，先看清引用如何连接。',[
    ['Node（自定义）','表示一个节点','new Node(2)','本例在类中定义 value 和 next，不是 JDK 内置 Node。'],
    ['p.next','保存后继节点的引用','first.next = third;','这里存的是下一个节点的引用。'],
    ['null','表示没有后继','p.next == null','可以用来判断尾节点。'],
    ['newNode.next = p.next','先保留原来的后继','second.next = first.next;','先接后面，避免丢失原链表。'],
    ['p = p.next','向后走一个节点','p = p.next;','只移动遍历变量，不会修改节点之间的连接。']
  ],`        Node first = new Node(1), third = new Node(3);
        first.next = third;
        Node second = new Node(2);
        second.next = first.next; // 先把新节点接到原后继。
        first.next = second; // 再让前驱指向新节点。
        StringJoiner result = new StringJoiner(" -> ");
        for (Node p=first; p!=null; p=p.next) result.add(String.valueOf(p.value));
        System.out.println(result);`, '1 -> 2 -> 3',
    ['原来 first.next 指向 3；先让新节点 2 也指向 3。','再把 first.next 改为 2，最终形成 1→2→3。'],
    '如果先改 first.next，又用它寻找原后继，可能丢失原链表或连出环。',
`    static class Node {
        int value; Node next;
        Node(int value) { this.value=value; }
    }`);
  add('c2/s3','给水果计数并去重','先认识 Map 的键值读写，以及 Set 如何判断重复。',[
    ['Map<K,V>','保存键到值的映射','Map<String,Integer> count = new HashMap<>();','K 是键类型，V 是值类型；泛型使用 Integer 等引用类型。'],
    ['put(key,value)','添加或覆盖键值','count.put("apple",2);','同一个键再次 put 会替换原值。'],
    ['getOrDefault(key,default)','读取，不存在则给默认值','count.getOrDefault("banana",0)','避免直接读取不存在的 Integer 后拆箱。'],
    ['merge(key,value,函数)','合并新值与旧值','count.merge("apple",1,Integer::sum);','存在时求和，不存在时放入 1。'],
    ['Set.add(value)','添加并报告是否首次出现','seen.add("apple")','首次添加为 true，再次添加相同值为 false。']
  ],`        Map<String,Integer> count = new HashMap<>();
        count.put("apple",2);
        count.merge("apple",1,Integer::sum); // 把原来的 2 加上 1。
        System.out.println(count.get("apple"));
        System.out.println(count.getOrDefault("banana",0));
        Set<String> seen = new HashSet<>();
        System.out.println(seen.add("apple"));
        System.out.println(seen.add("apple"));`, '3\n0\ntrue\nfalse',
    ['同一个键 apple 的计数从 2 合并为 3。','Set 第二次添加 apple 返回 false，可以用这个结果识别重复。'],
    'HashMap、HashSet 不保证遍历顺序；需要按原顺序输出时应另存顺序或选择对应容器。');
  add('c2/s1','把两个数字压栈再弹出','先只观察后进先出：10 先进入，20 后进入，因此先取出 20。',[
    ['Deque<Integer>','用双端队列实现栈','new ArrayDeque<Integer>()','本节统一把同一端当作栈顶。'],
    ['push(x)','压入栈顶','stack.push(20);','每次都放到当前栈顶。'],
    ['peek()','查看栈顶，不删除','stack.peek()','空 ArrayDeque 返回 null。'],
    ['pop()','取出并删除栈顶','stack.pop()','空栈调用会抛出异常，先检查 isEmpty。'],
    ['isEmpty() / size()','判断是否为空、读取元素数','stack.size()','size 是方法，需要括号。']
  ],`        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(10);
        stack.push(20); // 后进入的 20 位于栈顶。
        System.out.println(stack.peek());
        System.out.println(stack.pop());
        System.out.println(stack.peek());
        System.out.println(stack.size());`, '20\n20\n10\n1',
    ['peek 只查看，栈内仍有 10 和 20。','pop 删除 20 后，10 重新成为栈顶，元素数变为 1。'],
    '不要把 push/pop 与队列的 offerLast/pollFirst 混用而没有明确端点约定。');
  add('c2/s2','从队尾加入、从队首取出','先掌握队首和队尾，再看普通队列与双端队列的区别。',[
    ['offerLast(x)','把元素放入队尾','q.offerLast(10);','先加入的元素更靠近队首。'],
    ['peekFirst()','查看队首，不删除','q.peekFirst()','空队列返回 null。'],
    ['pollFirst()','取出并删除队首','q.pollFirst()','与 offerLast 配合形成先进先出。'],
    ['offerFirst(x)','从队首插入','q.offerFirst(5);','双端队列还允许在另一端添加。'],
    ['peekLast() / pollLast()','查看或移除队尾','q.peekLast()','单调队列会用队尾淘汰候选。']
  ],`        Deque<Integer> q = new ArrayDeque<>();
        q.offerLast(10); q.offerLast(20);
        System.out.println(q.peekFirst());
        System.out.println(q.pollFirst()); // 先进入的 10 先离开。
        System.out.println(q.peekFirst());
        q.offerFirst(5); // 双端队列还允许从队首添加。
        System.out.println(q);`, '10\n10\n20\n[5, 20]',
    ['从队尾加入 10、20，队首依次是 10、20。','最后从队首加入 5，遍历顺序为 5、20。'],
    'ArrayDeque 不允许存入 null；读取返回 null 时不要直接拆箱成 int。');
  add('c3/s3','用两个前缀相减求区间和','用四个数建立前缀数组，再查询下标 1 到 2 的和。',[
    ['prefix[i]（约定）','原数组前 i 项的和','prefix[0] = 0;','prefix[0] 表示空前缀。'],
    ['prefix[i+1]','把当前元素加入前缀','prefix[i+1] = prefix[i]+a[i];','原数组下标与前缀长度相差 1。'],
    ['prefix[r+1]-prefix[l]','查询闭区间 [l,r]','prefix[3]-prefix[1]','去掉 l 之前的元素，保留 l..r。'],
    ['long[]','保存累计值','long[] prefix = new long[a.length+1];','避免大量 int 相加后越界。']
  ],`        int[] a = {2,4,6,8};
        long[] prefix = new long[a.length+1];
        for (int i=0; i<a.length; i++) prefix[i+1]=prefix[i]+a[i];
        int left=1, right=2; // 查询 4+6，区间两端都包含。
        System.out.println(Arrays.toString(prefix));
        System.out.println(prefix[right+1]-prefix[left]);`, '[0, 2, 6, 12, 20]\n10',
    ['prefix[3] 包含 2、4、6，prefix[1] 只包含 2。','两者相减得到 4+6=10；这个公式也自然支持 left=0。'],
    '先确定 prefix 表示“前 i 项”，不要和“截至下标 i 的和”两种定义混用。');
  add('c3/s1','用左右指针反转四个数字','先看清每次交换和移动，再进入需要判断移动方向的题目。',[
    ['left / right（变量）','表示左右两个位置','int left=0,right=a.length-1;','初始分别位于首项和末项。'],
    ['left < right','两指针尚未相遇','while (left<right)','相遇后无需再交换中间项。'],
    ['临时变量 tmp','保存交换前的值','int tmp=a[left];','防止第一次赋值覆盖旧值。'],
    ['left++ / right--','向中间各走一步','left++; right--;','完成当前操作后缩小未处理区间。']
  ],`        int[] a = {1,2,3,4};
        int left=0, right=a.length-1;
        while (left<right) {
            int tmp=a[left]; a[left]=a[right]; a[right]=tmp;
            left++; right--; // 两端已处理，不再访问。
        }
        System.out.println(Arrays.toString(a));`, '[4, 3, 2, 1]',
    ['先交换下标 0、3，再交换下标 1、2。','循环结束时，所有对称位置都已完成交换。'],
    '每轮必须保证至少一个指针移动；移动方向应来自题目性质，不能随意套模板。');
  add('c3/s2','维护长度为 2 的窗口和','只练习新元素进入、旧元素离开，不额外加入复杂判断。',[
    ['sum += a[right]','加入新进入的元素','sum += a[i];','窗口向右扩张。'],
    ['sum -= a[right-k]','移除离开固定窗口的元素','if (i>=k) sum-=a[i-k];','索引 i-k 是这轮刚过期的位置。'],
    ['right >= k-1','确认已形成完整窗口','if (i>=k-1)','不足 k 项时不输出结果。'],
    ['[right-k+1,right]','固定窗口的闭区间','[i-k+1,i]','左右端都包含，长度恰好是 k。']
  ],`        int[] a = {2,1,5,1};
        int k=2, sum=0; // 本例约定 1<=k<=a.length。
        for (int i=0; i<a.length; i++) {
            sum+=a[i];
            if (i>=k) sum-=a[i-k]; // 只保留最近 k 个元素。
            if (i>=k-1) System.out.println(sum);
        }`, '3\n6\n6',
    ['第一个完整窗口为 [2,1]，和为 3。','加入 5 并移除 2 后和为 6；再加入 1、移除旧的 1，和仍为 6。'],
    '固定长度窗口能直接按下标移除；可变窗口还需要根据题意推导收缩条件。');
  add('c10/s1','直接观察按位运算与移位的结果','先把 5 看成 0101、3 看成 0011，对齐二进制逐位运算，再观察负数右移。',[
    ['&','按位与：两位都是 1 才为 1','5 & 3','0101 & 0011 = 0001，即 1；不是逻辑短路与 &&。'],
    ['|','按位或：任一位为 1 就为 1','5 | 3','得到 0111，即 7；不是逻辑短路或 ||。'],
    ['^','按位异或：两位不同才为 1','5 ^ 3','得到 0110，即 6；Java 的 ^ 不是乘方。'],
    ['~','翻转所有 bit','~5','int 的 32 位全部翻转，结果是 -6，不能只翻转写出来的低 4 位。'],
    ['<<','左移，高位移出、低位补 0','5 << 1','本例为 10；超出 int 范围时不能当作无溢出的乘法。'],
    ['>>','保留符号位的右移','-8 >> 1','结果为 -4；负数高位补 1。'],
    ['>>>','高位补 0 的无符号右移','-8 >>> 1','结果为 2147483644；与 >> 对负数的结果不同。'],
    ['n & (n-1)','删除最低的一个 1','5 & (5-1)','0101 & 0100 = 0100，即 4。'],
    ['n & -n','取得最低置位值 lowbit','12 & -12','结果为 4，后面树状数组会使用。'],
    ['Integer.toBinaryString(n)','查看二进制表示','Integer.toBinaryString(5)','得到字符串 101，不会自动补成 32 位。'],
    ['Integer.bitCount(n)','统计 32 位补码中的 1','Integer.bitCount(5)','结果为 2；后面会学习手写统计过程。']
  ],`        int a=5, b=3; // 低四位分别为 0101 和 0011。
        System.out.println("binary("+a+") = "+Integer.toBinaryString(a));
        System.out.println(a+" & "+b+" = "+(a&b));
        System.out.println(a+" | "+b+" = "+(a|b));
        System.out.println(a+" ^ "+b+" = "+(a^b));
        System.out.println("~"+a+" = "+(~a));
        System.out.println(a+" << 1 = "+(a<<1));
        System.out.println("-8 >> 1 = "+(-8>>1)); // 保留负号对应的高位。
        System.out.println("-8 >>> 1 = "+(-8>>>1));
        System.out.println("bitCount("+a+") = "+Integer.bitCount(a));`,
    'binary(5) = 101\n5 & 3 = 1\n5 | 3 = 7\n5 ^ 3 = 6\n~5 = -6\n5 << 1 = 10\n-8 >> 1 = -4\n-8 >>> 1 = 2147483644\nbitCount(5) = 2',
    ['先用 0101 与 0011 手算与、或、异或，再对照前三个整数结果。','~、>>、>>> 按完整 32 位 int 计算，因此要结合补码理解负数结果。'],
    '给拼接输出中的位表达式加括号。Java int 的位移距离只取低 5 位，例如 1<<32 实际等于 1<<0。');
  add('c10/s2','用两位二进制枚举四种选择','只放两件物品 A、B，直接观察 mask 的每一位是否选择对应下标。',[
    ['1 << i','构造只包含第 i 位的标记','1 << 1','得到二进制 10，即数值 2。'],
    ['mask & (1<<i)','检查某个下标是否被选择','(mask & (1<<i))!=0','结果非零表示第 i 位为 1。'],
    ['mask | flag','添加一个标记','mask |= 1<<i;','不会清除其他已经存在的标记。'],
    ['mask & ~flag','移除一个标记','mask &= ~(1<<i);','只清除指定位置。'],
    ['1 << n','n 位的状态数量','1 << 2','本例有 4 种，包括空集；n 大时要考虑容量与指数规模。']
  ],`        String[] items={"A","B"};
        for (int mask=0; mask<(1<<items.length); mask++) {
            List<String> selected=new ArrayList<>();
            for (int i=0; i<items.length; i++) {
                if ((mask&(1<<i))!=0) selected.add(items[i]);
            }
            System.out.println(mask+" -> "+selected); // 0 对应空集。
        }`, '0 -> []\n1 -> [A]\n2 -> [B]\n3 -> [A, B]',
    ['最低位表示 A，第二位表示 B；00、01、10、11 与四种选择一一对应。','下标 0 对应最低位，读取二进制字符串时不要把左右位置看反。'],
    '本例只使用两位；n 个元素有 2^n 个状态，不能对大 n 直接枚举。');
  add('c5/s1','递归计算 3 的阶乘','把输入缩小到 3，只观察终止、等待和返回。',[
    ['static 方法（自定义）','定义可以递归调用的函数','factorial(3)','方法体见下面完整代码，不是 JDK 的阶乘方法。'],
    ['终止条件','停止继续调用','if (n<=1) return 1;','本例约定 n>=0。'],
    ['factorial(n-1)','把规模缩小一步','n * factorial(n-1)','先等待更小问题返回，再计算当前层。'],
    ['return','把本层结果交还调用者','return 1;','返回后回到上一层暂停的位置。']
  ],`        System.out.println(factorial(3)); // 3*2*1 = 6。`, '6',
    ['调用顺序为 3→2→1，到 1 时停止递归。','返回顺序为 1→2→6，每一层乘上自己的 n。'],
    '递归必须逐渐接近终止条件；long 也有范围，本例不用于计算任意大的阶乘。',
`    static long factorial(int n) {
        if (n<=1) return 1; // 终止条件。
        return n*factorial(n-1);
    }`);
  add('c5/s2','把四个数拆成左右两半求和','用求和练习分治，先看拆分和合并，不加入排序过程。',[
    ['[left,right]（约定）','本例使用闭区间','sum(a,0,a.length-1)','两端都包含，输入数组非空。'],
    ['left == right','已缩到一个元素','return a[left];','最小子问题可以直接回答。'],
    ['left+(right-left)/2','计算中点','int mid=left+(right-left)/2;','避免直接 left+right 可能产生的溢出。'],
    ['左结果 + 右结果','合并两个子问题','sum(a,left,mid)+sum(a,mid+1,right)','分治不仅要拆，还必须定义合并规则。']
  ],`        int[] a={1,2,3,4};
        System.out.println(sum(a,0,a.length-1)); // 左半 3，右半 7，合并为 10。`, '10',
    ['先拆成 [1,2] 与 [3,4]，每一半继续拆到单个元素。','返回时依次合成 3、7，最后合成 10。'],
    '左右子区间应完整覆盖原区间且不重叠；本例右半从 mid+1 开始。',
`    static long sum(int[] a,int left,int right) {
        if (left==right) return a[left];
        int mid=left+(right-left)/2;
        return sum(a,left,mid)+sum(a,mid+1,right); // 合并左右答案。
    }`);
  add('c5/s3','枚举 a、b 的所有选择','只做两次选或不选，观察递归返回后为什么要撤销选择。',[
    ['path（可变路径）','记录当前已选择的内容','StringBuilder path=new StringBuilder();','同一个路径对象在不同分支之间复用。'],
    ['path.append(c)','做出当前选择','path.append((char)(\'a\'+i));','进入选择该字符的分支。'],
    ['path.deleteCharAt(...)','返回时撤销选择','path.deleteCharAt(path.length()-1);','恢复成进入本分支前的路径。'],
    ['path.toString()','保存当前结果的快照','answer.add(path.toString());','不要把仍会修改的路径对象直接当最终答案。']
  ],`        List<String> answer=new ArrayList<>();
        choose(0,new StringBuilder(),answer);
        for (String s:answer) System.out.println("["+s+"]"); // [] 表示空集。`, '[]\n[b]\n[a]\n[ab]',
    ['先探索“不选”，再探索“选择”，因此结果顺序是空、b、a、ab。','选择分支返回后删除刚加入的字符，其他分支才不会带入旧状态。'],
    '撤销的内容应与本层选择严格对应，不能把上层已经选择的部分一起清空。',
`    static void choose(int i,StringBuilder path,List<String> answer) {
        if (i==2) { answer.add(path.toString()); return; }
        choose(i+1,path,answer); // 不选。
        path.append((char)('a'+i));
        choose(i+1,path,answer); // 选择。
        path.deleteCharAt(path.length()-1); // 撤销本层选择。
    }`);
  add('c4/s2','先用标准库完成升序和降序排序','先认识有序结果与比较器，后面的完整案例再展开手写排序。',[
    ['Arrays.sort(int[])','整数数组原地升序','Arrays.sort(a);','会改变原数组，不会返回新的排序数组。'],
    ['Arrays.sort(T[],Comparator)','按比较器给对象数组排序','Arrays.sort(b,Comparator.reverseOrder());','比较器版本需要 Integer[] 等对象数组。'],
    ['Comparator.reverseOrder()','使用反向自然顺序','Comparator.reverseOrder()','Integer 数组可得到降序。'],
    ['Integer.compare(a,b)','安全比较两个 int','Integer.compare(a,b)','比直接返回 a-b 更能避免溢出问题。']
  ],`        int[] a={3,1,2};
        Arrays.sort(a); // 原数组变为升序。
        System.out.println(Arrays.toString(a));
        Integer[] b={3,1,2};
        Arrays.sort(b,Comparator.reverseOrder());
        System.out.println(Arrays.toString(b));`, '[1, 2, 3]\n[3, 2, 1]',
    ['先对基本类型数组升序排序。','降序示例换成 Integer[]，再传入反向比较器。'],
    '不能给 int[] 的 Arrays.sort 直接传入 Comparator；也不要把比较器写成可能溢出的 b-a。');
  add('c4/s1','在有序数组中找到 5，并查看未找到的返回值','先观察标准库二分查找的输入与返回约定，再阅读手写边界模板。',[
    ['Arrays.binarySearch(a,target)','在升序数组中查找','Arrays.binarySearch(a,5)','找到时返回某个匹配位置，存在重复值时不保证是第一个。'],
    ['返回值 >= 0','查找成功，值即下标','a[found]','本例 5 位于下标 2。'],
    ['返回值 < 0','编码了未找到时的插入位置','int insertion=-result-1;','并非所有未找到的结果都等于 -1。'],
    ['升序前提','二分查找需要有序输入','int[] a={1,3,5,7};','若数组无序，应先排序或采用其他查找方式。']
  ],`        int[] a={1,3,5,7};
        int found=Arrays.binarySearch(a,5);
        int missing=Arrays.binarySearch(a,4);
        System.out.println(found);
        System.out.println(missing); // 插入点为 2，返回 -2-1，即 -3。
        System.out.println(-missing-1);`, '2\n-3\n2',
    ['找到 5 返回下标 2。','4 不存在，应插在下标 2；标准库把这个位置编码成 -3。'],
    '只有返回值为负时才能用 -result-1 解码插入点；手写题目的返回约定可能不同。');
  add('c6/s1','创建一棵只有三个节点的树','先明确根、左孩子、右孩子和空引用。',[
    ['Node（自定义）','表示树节点','new Node(2)','本例定义 value、left、right 三个字段。'],
    ['root.left','连接左孩子','root.left=new Node(1);','孩子仍然是一个完整节点。'],
    ['root.right','连接右孩子','root.right=new Node(3);','不要把节点引用与节点里的数字混淆。'],
    ['null','表示孩子不存在','root.left.left==null','叶子的左右孩子都为 null。']
  ],`        Node root=new Node(2);
        root.left=new Node(1); root.right=new Node(3);
        System.out.println(root.value);
        System.out.println(root.left.value);
        System.out.println(root.right.value);
        System.out.println(root.left.left==null); // 节点 1 没有左孩子。`, '2\n1\n3\ntrue',
    ['根节点为 2，两个孩子分别是 1、3。','读取 root.left.value 前，要确认 root.left 不为空。'],
    '树是节点之间的引用结构；修改 root.value 与修改 root.left 是两种不同操作。',
`    static class Node {
        int value; Node left,right;
        Node(int value) { this.value=value; }
    }`);
  add('c6/s3','用递归做一次先序 DFS','只遍历三个节点，观察“访问自己、左子树、右子树”的顺序。',[
    ['node == null','空子树直接返回','if (node==null) return;','使叶子下方的递归自然终止。'],
    ['answer.add(node.value)','本例先访问自己','answer.add(node.value);','放在左右递归之前，就是先序遍历。'],
    ['dfs(node.left,answer)','先深入左子树','dfs(node.left,answer);','完成左侧后，调用栈返回当前层。'],
    ['dfs(node.right,answer)','再深入右子树','dfs(node.right,answer);','dfs 是下面定义的自定义方法。']
  ],`        Node root=new Node(2);
        root.left=new Node(1); root.right=new Node(3);
        List<Integer> answer=new ArrayList<>();
        dfs(root,answer); // 访问根，再访问左侧，最后右侧。
        System.out.println(answer);`, '[2, 1, 3]',
    ['先记录根 2，再进入左子树记录 1。','左子树返回后，进入右子树记录 3。'],
    '本例输入是没有环的树；把 DFS 推广到图时，还需要处理访问标记以避免无限重复。',
`    static class Node {
        int value; Node left,right;
        Node(int value) { this.value=value; }
    }
    static void dfs(Node node,List<Integer> answer) {
        if (node==null) return;
        answer.add(node.value);
        dfs(node.left,answer); dfs(node.right,answer);
    }`);
  add('c6/s2','把树节点依次加入队列做 BFS','同样三个节点，改用队列按层处理，不使用递归。',[
    ['Queue<Node>','保存等待处理的节点','Queue<Node> q=new ArrayDeque<>();','保存节点引用，而不只是数字。'],
    ['q.offer(root)','从根开始','q.offer(root);','根为空时应先返回，ArrayDeque 不接收 null。'],
    ['q.poll()','取出当前最早发现的节点','Node node=q.poll();','其孩子加入队尾，等待之后处理。'],
    ['node.left != null','只加入存在的孩子','if (node.left!=null) q.offer(node.left);','右孩子同理。'],
    ['int size=q.size()','按层统计时固定本层数量','int size=q.size();','需要分层输出时在本层循环开始前记录。']
  ],`        Node root=new Node(2);
        root.left=new Node(1); root.right=new Node(3);
        Queue<Node> q=new ArrayDeque<>(); q.offer(root);
        List<Integer> answer=new ArrayList<>();
        while (!q.isEmpty()) {
            Node node=q.poll(); answer.add(node.value);
            if (node.left!=null) q.offer(node.left);
            if (node.right!=null) q.offer(node.right); // 新节点加入队尾。
        }
        System.out.println(answer);`, '[2, 1, 3]',
    ['根 2 出队后，左孩子 1、右孩子 3 依次入队。','随后先处理 1，再处理 3；更深层的节点会排在它们后面。'],
    '要分别输出每一层时，不能在本层 for 的判断里反复使用会变化的 q.size()。',
`    static class Node {
        int value; Node left,right;
        Node(int value) { this.value=value; }
    }`);
  add('c11/s2','给下标 1 到 2 统一加 3','用四个位置演示差分的生效点、撤销点和一次还原。',[
    ['diff[l] += delta','从左端开始生效','diff[1]+=3;','修改的是变化量，不是每个位置的最终值。'],
    ['diff[r+1] -= delta','从闭区间右端后一位撤销','diff[3]-=3;','[1,2] 的增量从下标 3 开始失效。'],
    ['n+1 哨兵位置','允许撤销写在 diff[n]','new long[n+1]','原数组最后一项也可以作为区间右端。'],
    ['running += diff[i]','前缀累加还原当前值','running+=diff[i];','一次扫描得到所有位置的结果。'],
    ['TreeMap.merge（事件）','按有序坐标累计变化','events.merge(time,delta,Integer::sum);','稀疏时间轴可以只保存实际发生变化的位置。']
  ],`        int n=4;
        long[] diff=new long[n+1], result=new long[n];
        diff[1]+=3; diff[3]-=3; // 对闭区间 [1,2] 加 3。
        long running=0;
        for (int i=0; i<n; i++) { running+=diff[i]; result[i]=running; }
        System.out.println(Arrays.toString(diff));
        System.out.println(Arrays.toString(result));`, '[0, 3, 0, -3, 0]\n[0, 3, 3, 0]',
    ['下标 1 开始增加 3，下标 3 开始撤销，因此只有下标 1、2 生效。','diff[2]=0 不代表最终值为 0，而是这个位置没有发生新的变化。'],
    '闭区间在 r+1 撤销；半开区间 [start,end) 在 end 撤销。');
  add('c11/s1','用下标候选求两个窗口的最大值','数组只放 2、1、3，窗口长度为 2，看清过期和淘汰是两种操作。',[
    ['Deque<Integer>','保存候选下标','Deque<Integer> q=new ArrayDeque<>();','存下标才能判断过期，再由下标读取数值。'],
    ['q.peekFirst() <= i-k','检查队首是否已经过期','q.pollFirst();','当前窗口左端是 i-k+1。'],
    ['a[q.peekLast()] <= a[i]','新元素不小于队尾候选','q.pollLast();','新元素更晚过期，可以替代旧候选。'],
    ['q.offerLast(i)','加入当前下标','q.offerLast(i);','候选的下标递增、值递减。'],
    ['a[q.peekFirst()]','读取当前最大值','a[q.peekFirst()]','形成完整窗口后，队首就是答案。']
  ],`        int[] a={2,1,3}; int k=2;
        Deque<Integer> q=new ArrayDeque<>();
        for (int i=0; i<a.length; i++) {
            while (!q.isEmpty() && q.peekFirst()<=i-k) q.pollFirst();
            while (!q.isEmpty() && a[q.peekLast()]<=a[i]) q.pollLast();
            q.offerLast(i); // 保存下标，不直接保存 a[i]。
            if (i>=k-1) System.out.println(a[q.peekFirst()]);
        }`, '2\n3',
    ['窗口 [2,1] 的最大值是 2；1 仍可作为之后的候选。','读到 3 时，旧 2 已过期，1 又被更大且更晚的 3 淘汰。'],
    '队尾比较的是 a[下标]，不是下标本身的大小；读取队首前确保队列非空。');
  add('c7/s1','向小顶堆加入三个数再取最小值','先认识 PriorityQueue 的默认顺序，观察 peek 与 poll 的区别。',[
    ['PriorityQueue<Integer>','创建默认小顶堆','new PriorityQueue<Integer>()','自然顺序下，最小值在堆顶。'],
    ['offer(x)','加入一个候选','heap.offer(3);','堆会维护自身顺序，不需要手动 sort。'],
    ['peek()','读取堆顶，不删除','heap.peek()','空堆返回 null。'],
    ['poll()','取出并删除堆顶','heap.poll()','删除后，剩余元素中最小者成为新堆顶。'],
    ['Comparator.reverseOrder()','创建大顶堆','new PriorityQueue<Integer>(Comparator.reverseOrder())','不要用可能溢出的 b-a 代替安全比较器。']
  ],`        PriorityQueue<Integer> heap=new PriorityQueue<>();
        heap.offer(3); heap.offer(1); heap.offer(2);
        System.out.println(heap.peek());
        System.out.println(heap.poll()); // 取走最小值 1。
        System.out.println(heap.peek());
        System.out.println(heap.size());`, '1\n1\n2\n2',
    ['加入顺序是 3、1、2，但堆顶始终是当前最小值 1。','取走 1 后，2 成为新堆顶，元素数为 2。'],
    'PriorityQueue 只保证堆顶最优；直接遍历或打印整个堆不等于得到完全有序结果。');
  add('c7/s2','每次选择最早结束且不冲突的会议','用三个半开区间，观察排序标准与是否选择的条件。',[
    ['Comparator.comparingInt','按某个 int 字段排序','Comparator.comparingInt(a->a[1])','本例按结束时间排序。'],
    ['end（变量）','最后一次选择的结束时间','int end=Integer.MIN_VALUE;','为第一次选择保留足够小的初值。'],
    ['meeting[0] >= end','判断是否与已选会议相邻或分离','if (meeting[0]>=end)','本例会议为 [start,end)，首尾相接不冲突。'],
    ['end = meeting[1]','选择后更新边界','end=meeting[1];','跳过冲突项时不改变已选边界。']
  ],`        int[][] meetings={{1,3},{2,4},{3,5}};
        Arrays.sort(meetings,Comparator.comparingInt(a->a[1]));
        int end=Integer.MIN_VALUE;
        List<String> chosen=new ArrayList<>();
        for (int[] m:meetings) {
            if (m[0]>=end) { chosen.add(Arrays.toString(m)); end=m[1]; }
        }
        System.out.println(chosen.size());
        System.out.println(chosen); // 选择 [1,3)、[3,5)。`, '2\n[[1, 3], [3, 5]]',
    ['先选最早结束的 [1,3)，跳过与它冲突的 [2,4)。','[3,5) 从 3 开始，可以与上一场首尾相接，因此也能选择。'],
    '贪心标准依赖题目性质；本例不能自动推广成“会议价值总和最大”等不同目标。');
  add('c9/s1','用邻接表保存两条有向边','只建立 0→1 和 0→2，先看清图如何存储。',[
    ['List<List<Integer>>','每个点保存自己的邻居列表','List<List<Integer>> graph=new ArrayList<>();','外层位置是节点编号，内层元素是它能到达的邻居。'],
    ['graph.add(new ArrayList<>())','为一个节点创建空邻居表','graph.add(new ArrayList<>());','每个节点都要单独创建，不能让多点共享同一个列表。'],
    ['graph.get(u).add(v)','加入有向边 u→v','graph.get(0).add(1);','不会自动加入反向边。'],
    ['无向边（约定）','需要同时记录两个方向','graph.get(v).add(u);','在 u→v 之外再加入 v→u。'],
    ['boolean[] visited','记录哪些点已访问','new boolean[n]','图可能有环，遍历时通常需要访问标记。']
  ],`        int n=3;
        List<List<Integer>> graph=new ArrayList<>();
        for (int i=0; i<n; i++) graph.add(new ArrayList<>());
        graph.get(0).add(1); graph.get(0).add(2); // 两条有向边。
        System.out.println(graph.get(0));
        System.out.println(graph.get(1)); // 1 没有出边。`, '[1, 2]\n[]',
    ['节点 0 的邻居是 1、2，因此它的列表为 [1,2]。','本例没有 1→0，节点 1 的邻居列表为空。'],
    '看到一条无向连接时要加两条有向记录；不能把“能到达”和“互相能到达”混为一谈。');
  add('c9/s2','合并 0、1 后检查是否同一集合','只做一次合并，观察 parent 与代表元的含义。',[
    ['parent[i]（数组）','保存父节点，根指向自身','int[] parent={0,1,2};','初始每个元素独立成组。'],
    ['find(parent,x)（自定义）','找到 x 所在组的代表元','find(parent,1)','下面的完整程序中定义了该方法。'],
    ['parent[rootB]=rootA','把一个集合挂到另一个集合','parent[find(parent,1)]=find(parent,0);','连接的是代表元，不是随便两个内部节点。'],
    ['find(a)==find(b)','判断是否同一集合','find(parent,0)==find(parent,1)','不能只比较 parent[a] 与 parent[b]。'],
    ['parent[x]=parent[parent[x]]','路径压缩的一种写法','parent[x]=parent[parent[x]];','查询时让路径变短。']
  ],`        int[] parent={0,1,2};
        parent[find(parent,1)]=find(parent,0); // 把 1 所在组并入 0 所在组。
        System.out.println(find(parent,0)==find(parent,1));
        System.out.println(find(parent,0)==find(parent,2));
        System.out.println(Arrays.toString(parent));`, 'true\nfalse\n[0, 0, 2]',
    ['初始代表元分别是自己；合并后，0 和 1 的代表元相同。','2 未参与合并，仍属于另一个集合。'],
    'parent 的直接父节点不一定就是最终代表元；复杂度优化还可结合按大小或按秩合并。',
`    static int find(int[] parent,int x) {
        while (parent[x]!=x) { parent[x]=parent[parent[x]]; x=parent[x]; }
        return x;
    }`);
  add('c9/s3','先完成 0，再释放依赖它的 1、2','把入度理解为“还有多少先修任务没有完成”。',[
    ['indegree[v]','节点 v 的入度','int[] indegree={0,1,1};','本例 1、2 都各有一个先修任务 0。'],
    ['indegree[v] == 0','可以开始处理','q.offer(v);','初始化时也要收集所有零入度点。'],
    ['--indegree[v]','移除一条已完成的先修边','if (--indegree[v]==0)','先减，再判断是否归零。'],
    ['order.add(u)','记录一个已完成节点','order.add(u);','顺序可能不唯一，只需满足所有依赖。'],
    ['order.size() == n','判断是否处理了全部点','order.size()==n','不足 n 通常表示有向依赖存在环。']
  ],`        List<List<Integer>> graph=new ArrayList<>();
        for (int i=0; i<3; i++) graph.add(new ArrayList<>());
        graph.get(0).add(1); graph.get(0).add(2);
        int[] indegree={0,1,1}; // 1、2 各自还有一个先修任务 0。
        Queue<Integer> q=new ArrayDeque<>();
        for (int i=0; i<3; i++) if (indegree[i]==0) q.offer(i);
        List<Integer> order=new ArrayList<>();
        while (!q.isEmpty()) {
            int u=q.poll(); order.add(u);
            for (int v:graph.get(u)) if (--indegree[v]==0) q.offer(v);
        }
        System.out.println(order);
        System.out.println(order.size()==3);`, '[0, 1, 2]\ntrue',
    ['只有节点 0 入度为 0，先处理它。','处理 0 后，1、2 的入度都变为 0，可以按队列顺序继续。'],
    '本例入度直接写好以便观察；一般程序需要根据每条有向边逐次累加入度。');
  add('c8/s1','用状态数组计算走到第 4 阶的方法数','只练习状态、初值和从小到大的转移。',[
    ['dp[i]（状态约定）','到第 i 阶的走法数','long[] dp=new long[n+1];','先说明状态含义，再写递推。'],
    ['dp[0]=1','空台阶有一种不走的方式','dp[0]=1;','这个初值用于拼接后面的走法。'],
    ['dp[1]=1','第一阶的初值','dp[1]=1;','本例 n=4，数组有这个位置。'],
    ['dp[i-1]+dp[i-2]','合并最后一步的两种来源','dp[i]=dp[i-1]+dp[i-2];','计数型状态求和，不是取最大值。'],
    ['i 从小到大','先算依赖，再算当前项','for (int i=2;i<=n;i++)','读取的前两项已经计算完成。']
  ],`        int n=4;
        long[] dp=new long[n+1]; dp[0]=dp[1]=1;
        for (int i=2; i<=n; i++) dp[i]=dp[i-1]+dp[i-2];
        System.out.println(Arrays.toString(dp));
        System.out.println(dp[n]); // 第 4 阶有 5 种走法。`, '[1, 1, 2, 3, 5]\n5',
    ['最后一步来自前一阶或前两阶，两类走法互不重复，因此相加。','逐项得到 2、3、5，避免递归反复计算同一个子问题。'],
    '本例固定 n=4；改成通用方法时需单独处理 n=0，并检查走法数可能超过 long 的范围。');
  add('c8/s2','一件物品只能选择一次','容量为 4，只有一件重量 2、价值 3 的物品，用倒序转移避免重复选取。',[
    ['dp[c]（状态约定）','容量不超过 c 的最大价值','int[] dp=new int[capacity+1];','初始为 0，表示不选任何物品。'],
    ['Math.max(a,b)','从两个方案选较优值','Math.max(dp[c],dp[c-weight]+value)','比较不选当前物品与选择一次。'],
    ['c 从大到小','0-1 背包的一维更新方向','for (int c=capacity;c>=weight;c--)','本轮读取到的较小容量仍属于上一轮状态。'],
    ['dp[c-weight]+value','选择当前物品的候选值','dp[c-weight]+value','必须保证 c>=weight。']
  ],`        int capacity=4, weight=2, value=3;
        int[] dp=new int[capacity+1];
        for (int c=capacity; c>=weight; c--) {
            dp[c]=Math.max(dp[c],dp[c-weight]+value); // 容量倒序。
        }
        System.out.println(Arrays.toString(dp));
        System.out.println(dp[capacity]);`, '[0, 0, 3, 3, 3]\n3',
    ['先算容量 4，此时 dp[2] 还是 0，所以候选价值为 3。','之后才更新容量 2，容量 4 不会在本轮再次读取它。'],
    '若改成容量正序，容量 4 会读到本轮已经更新的 dp[2]，错误地把同一件物品用了两次。');
  add('c12/s1','插入 cat，再区分 ca 与 cat','用三个字符建立 Trie 路径，观察完整词终点与前缀的区别。',[
    ['Node[26]','为 a-z 预留孩子槽位','Node[] next=new Node[26];','本例字符范围限定为小写英文字母。'],
    ["c-'a'",'把字母映射为下标',"int i=c-'a';",'a→0，b→1，…，z→25。'],
    ['p = p.next[i]','沿当前字符向下走','p=p.next[i];','孩子不存在时，插入操作可先创建。'],
    ['p.end = true','标记完整单词终点','p.end=true;','路径存在不代表该路径已被收录为完整词。']
  ],`        Node root=new Node(), p=root;
        for (char c:"cat".toCharArray()) {
            int i=c-'a';
            if (p.next[i]==null) p.next[i]=new Node();
            p=p.next[i];
        }
        p.end=true; // 只有 cat 的终点标为完整单词。
        Node ca=root.next['c'-'a'].next['a'-'a'];
        System.out.println(ca!=null);
        System.out.println(ca.end);
        System.out.println(ca.next['t'-'a'].end);`, 'true\nfalse\ntrue',
    ['插入后存在 c→a→t 的路径，因此 ca 是合法前缀。','ca 的 end 为 false，cat 的 end 为 true，完整词查询与前缀查询由此区分。'],
    '不要直接用字符的编码作 26 格数组下标；非 a-z 输入需要验证或换用 Map。',
`    static class Node { Node[] next=new Node[26]; boolean end; }`);
  add('c12/s2','为 abab 构建前缀函数','先不搜索长文本，只观察 pi 数组中每个数表示什么。',[
    ['p.charAt(i)','读取模式字符','p.charAt(i)','先确认 i 在模式长度范围内。'],
    ['pi[i]（状态约定）','p[0..i] 的最长相等真前后缀长度','pi[3] = 2;','abab 的真前缀 ab 与后缀 ab 相等。'],
    ['j','当前已匹配的前缀长度','int j=0;','长度为 j，对应最后一个已匹配位置为 j-1。'],
    ['j = pi[j-1]','失配时寻找更短可复用前缀','while (j>0 && p.charAt(i)!=p.charAt(j)) j=pi[j-1];','只回退已匹配长度，复用已知相同的前后缀。'],
    ['p.substring(0,length)','读取找到的前缀','p.substring(0,pi[p.length()-1])','上界不包含；本例得到 ab。']
  ],`        String p="abab"; // 本例模式非空。
        int[] pi=new int[p.length()];
        for (int i=1,j=0; i<p.length(); i++) {
            while (j>0 && p.charAt(i)!=p.charAt(j)) j=pi[j-1];
            if (p.charAt(i)==p.charAt(j)) j++;
            pi[i]=j;
        }
        System.out.println(Arrays.toString(pi));
        System.out.println(p.substring(0,pi[p.length()-1]));`, '[0, 0, 1, 2]\nab',
    ['a、ab 没有非空相等真前后缀，前两项为 0。','aba 的最长长度为 1，abab 的最长长度为 2，因此 pi 为 [0,0,1,2]。'],
    'pi 存长度，不是字符下标；失配回退前要保证 j>0，避免读取 pi[-1]。');
  add('c13/s1','做一次单点增量，再查询一个前缀','内部下标从 1 开始；给原数组下标 1 加 3，再查前 3 项的和。',[
    ['i = index+1','外部下标转为内部下标','int i=1+1;','原下标 1 对应内部下标 2。'],
    ['i & -i','lowbit，最低置位值','2 & -2','得到 2；决定当前管理区间的长度。'],
    ['i += i&-i','更新时向上跳','i+=i&-i','把增量加入所有包含该位置的管理节点。'],
    ['i -= i&-i','查询时向前跳','i-=i&-i','逐段拼出前缀，最后到 0 结束。'],
    ['long[] bit','保存区间累计值','new long[n+1]','bit[0] 不参与更新。']
  ],`        int n=4;
        long[] bit=new long[n+1];
        for (int i=2; i<=n; i+=i&-i) bit[i]+=3; // 原下标 1 加 3。
        long sum=0;
        for (int i=3; i>0; i-=i&-i) sum+=bit[i]; // 查询原数组前 3 项。
        System.out.println(Arrays.toString(bit));
        System.out.println(sum);`, '[0, 0, 3, 0, 3]\n3',
    ['更新依次经过内部下标 2、4；这些节点都包含原下标 1。','查询前 3 项依次读取内部下标 3、2，累计得到 3。'],
    '不要从内部下标 0 开始更新，lowbit(0)=0 会使循环无法前进。');
  add('c13/s2','修改一个叶子，再重新计算根的最大值','只用 4 个叶子，先学会父子下标和向上合并，再看复杂区间查询与懒标记。',[
    ['tree[size+i]','原数组下标 i 的叶子位置','tree[size+i]=a[i];','本例 size=4，恰好容纳 4 个元素。'],
    ['2*p / 2*p+1','节点 p 的左右孩子','Math.max(tree[2*p],tree[2*p+1])','当前例子聚合的是最大值。'],
    ['p /= 2','向父节点移动','p/=2;','修改一个叶子后，逐层重新合并祖先。'],
    ['tree[1]','根节点的整体聚合值','tree[1]','tree[0] 不使用。'],
    ['Long.MIN_VALUE','最大值运算的单位元','Arrays.fill(tree,Long.MIN_VALUE);','有多余叶子时使用负无穷，不能用 0 干扰全负数组。']
  ],`        int[] a={2,1,5,3}; int size=4;
        long[] tree=new long[2*size];
        for (int i=0; i<a.length; i++) tree[size+i]=a[i];
        for (int p=size-1; p>0; p--) tree[p]=Math.max(tree[2*p],tree[2*p+1]);
        System.out.println(tree[1]);
        int p=size+2; tree[p]=0; // 把原下标 2 的 5 赋值为 0。
        for (p/=2; p>0; p/=2) tree[p]=Math.max(tree[2*p],tree[2*p+1]);
        System.out.println(tree[1]);`, '5\n3',
    ['初始叶子为 2、1、5、3，根节点保存最大值 5。','将第三项赋值为 0 后，更新它的父节点与根，整体最大值变成 3。'],
    '本例是赋值，不是增量。扩充到 2 的幂产生多余叶子时，要使用与聚合匹配的单位元。');
  add('c14/s1','在三个节点中找到一条更短路线','0→1 的直接成本是 4，经过 0→2→1 只需 1+2=3。',[
    ['long[] dist','记录当前找到的最短距离','Arrays.fill(dist,Long.MAX_VALUE);','无穷大表示尚未到达，起点单独设为 0。'],
    ['PriorityQueue<long[]>','按距离选择下一候选','Comparator.comparingLong(x->x[0])','本例条目为 {距离,节点}。'],
    ['d != dist[u]','跳过过期条目','if (d!=dist[u]) continue;','同一节点可能以不同距离多次入堆。'],
    ['next < dist[v]','更短路径才更新','long next=d+edge[1];','本例 edge 为 {终点,权重}，权重非负。'],
    ['pq.offer(...)','加入新的有效候选','pq.offer(new long[]{next,v});','使用 long 累加路径，不用相减比较器。']
  ],`        List<List<int[]>> g=new ArrayList<>();
        for (int i=0; i<3; i++) g.add(new ArrayList<>());
        g.get(0).add(new int[]{1,4}); g.get(0).add(new int[]{2,1});
        g.get(2).add(new int[]{1,2}); // 非负权有向边。
        long[] dist=new long[3]; Arrays.fill(dist,Long.MAX_VALUE); dist[0]=0;
        PriorityQueue<long[]> pq=new PriorityQueue<>(Comparator.comparingLong(x->x[0]));
        pq.offer(new long[]{0,0});
        while (!pq.isEmpty()) {
            long[] item=pq.poll(); long d=item[0]; int u=(int)item[1];
            if (d!=dist[u]) continue;
            for (int[] edge:g.get(u)) {
                int v=edge[0]; long next=d+edge[1];
                if (next<dist[v]) { dist[v]=next; pq.offer(new long[]{next,v}); }
            }
        }
        System.out.println(Arrays.toString(dist));`, '[0, 3, 1]',
    ['从 0 先发现到 1 的距离 4、到 2 的距离 1。','先处理距离更小的 2，再把到 1 的距离改善为 3；堆里的旧距离 4 会被跳过。'],
    '本例的 Dijkstra 只用于非负边；存在负边时应选择符合条件的其他最短路算法。');
  add('c14/s2','按成本选边，跳过会形成环的第三条边','只连接三个节点，观察排序、并查集和选边数如何配合。',[
    ['边 {u,v,cost}','表示无向边与成本','new int[]{1,2,1}','本例每条边只保存一份，Kruskal 按整张边表处理。'],
    ['Arrays.sort(edges,...)','从便宜到昂贵处理','Comparator.comparingInt(e->e[2])','按照成本，不是端点编号排序。'],
    ['find(parent,x)（自定义）','查询连通分量代表元','find(parent,e[0])','定义见下面完整程序。'],
    ['rootA != rootB','只连接不同分量','if (a!=b)','两端已连通时再加这条边会成环。'],
    ['selected == n-1','生成树的选边数检查','selected==parent.length-1','一般图必须检查是否真正连通，不能直接返回森林成本。']
  ],`        int[][] edges={{0,1,3},{1,2,1},{0,2,2}};
        Arrays.sort(edges,Comparator.comparingInt(e->e[2]));
        int[] parent={0,1,2}; int selected=0; long cost=0;
        for (int[] e:edges) {
            int a=find(parent,e[0]), b=find(parent,e[1]);
            if (a!=b) { parent[b]=a; cost+=e[2]; selected++; }
        }
        System.out.println(selected==parent.length-1 ? cost : -1);
        System.out.println(selected); // 三个点的生成树恰好两条边。`, '3\n2',
    ['先选成本 1 的 1—2，再选成本 2 的 0—2，三个点已连通。','处理成本 3 的 0—1 时，两端代表元已相同，跳过这条成环边。'],
    '最小生成树优化的是所有选边的总成本，不保证从某个起点到每个点的路径最短。',
`    static int find(int[] parent,int x) {
        while (parent[x]!=x) x=parent[x];
        return x;
    }`);
  if(typeof module!=='undefined'&&module.exports){module.exports=entries;return;}
  root.QUICK_STARTS=entries;
  (root.COURSE||[]).forEach(function(ch){ch.sections.forEach(function(section){
    var key=ch.id+'/'+section.id,entry=entries[key];
    if(!entry)throw Error('缺少小节入门示例：'+key);
    var at=section.blocks.findIndex(function(b){return b.t==='h'&&/^(运用|适用)场景/.test(b.text);});
    if(at<0)throw Error('找不到入门示例插入位置：'+key);
    section.blocks.splice(at,0,entry);
  });});
})(typeof window!=='undefined'?window:globalThis);
