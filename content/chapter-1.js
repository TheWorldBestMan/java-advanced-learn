/* 第 1 章 · 数组、字符串、链表 */
window.COURSE = window.COURSE || [];
window.COURSE.push({
  id: 'c1',
  title: '数组、字符串、链表',
  minutes: 180,
  tags: ['数组', '字符串', '链表', 'ArrayList', '双指针'],
  goals: [
    '掌握数组与 ArrayList 的特性、复杂度与常见遍历技巧',
    '理解 Java 字符串的不可变性，知道何时用 StringBuilder',
    '能手写链表节点，掌握反转、合并、快慢指针等技巧',
    '能判断数组 / 字符串 / 链表各自适用与易错的场景'
  ],
  interview: [
    { q: 'ArrayList 和 LinkedList 的区别？各自适用什么场景？', a: 'ArrayList 底层是**动态数组**，按下标随机访问 get(i) 是 **O(1)**，但在中间/头部插入删除是 **O(n)**（要搬移元素）；LinkedList 底层是**双向链表**，随机访问是 **O(n)**，但已知位置的插入删除是 **O(1)**。所以「读多写少」用 ArrayList，「频繁在头/中间增删」用 LinkedList。注意 LinkedList 的 get(i) 是 O(n)，不是 O(1)。' },
    { q: 'String 为什么设计成不可变？StringBuilder 和 StringBuffer 的区别？', a: 'String 不可变带来：**线程安全**、可安全作 HashMap 的 key、可进常量池复用节省内存。StringBuilder 可变、线程不安全（单线程频繁拼接用这个，快）；StringBuffer 方法加了 synchronized，线程安全但更慢。循环里频繁拼接要用 StringBuilder，别用 +（每次 + 都新建对象，O(n²)）。' },
    { q: '手写反转单链表（迭代）。', a: '用 prev、cur 两个指针：循环里先保存 cur.next，再 cur.next = prev，然后 prev、cur 整体前移，最后返回 prev（新的头）。时间 O(n)、空间 O(1)。', code: `public ListNode reverse(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}` },
    { q: '数组和链表的核心区别？', a: '数组**连续内存**、按下标 O(1) 随机访问、插入删除 O(n)、空间紧凑；链表**不连续**、随机访问 O(n)、已知位置插入删除 O(1)、每个节点多存一个指针有额外开销。这决定了各自适用场景：固定大小频繁随机访问用数组，频繁增删用链表。' }
  ],
  sections: [
    {
      id: 's1',
      title: '1.1 数组',
      short: '数组',
      minutes: 50,
      blocks: [
        { t: 'h', text: '概念：连续内存 + O(1) 随机访问' },
        { t: 'p', text: '数组是一段**连续内存**，存放相同类型的元素，通过下标可以在 **O(1)** 时间读写任意元素。这是它最核心的优势，也是双指针、滑动窗口、前缀和等大量技巧的载体。代价是：长度固定（原生数组）或扩容有成本（ArrayList），在中间插入删除需要搬移元素，是 O(n)。' },
        { t: 'table', head: ['操作', '复杂度', '说明'], rows: [
          ['arr[i] 读取 / 写入', 'O(1)', '按下标直接算出地址'],
          ['线性查找某个值', 'O(n)', '从头扫到尾'],
          ['ArrayList 尾插 add', '均摊 O(1)', '容量不足时才扩容'],
          ['中间 / 头部插入删除', 'O(n)', '需要搬移后面所有元素']
        ]},
        { t: 'p', text: 'Java 里常说的「数组」其实有两种：原生数组（如 int[]、String[]）定长、轻量、没有方法；ArrayList 是包装后的动态数组，自动扩容、提供丰富的 API，但里面装的是**包装类**（Integer 而非 int）。' },
        { t: 'code', title: '数组与 ArrayList 基础', code: `import java.util.*;

public class ArrayBase {
    public static void main(String[] args) {
        // 原生数组：定长，默认值 0
        int[] a = new int[5];
        a[0] = 10; a[4] = 50;
        System.out.println(a[0]);          // 10
        System.out.println(a.length);      // 5

        // 静态初始化
        int[] b = {3, 1, 4, 1, 5};

        // ArrayList：动态扩容
        ArrayList<Integer> list = new ArrayList<>();
        list.add(1); list.add(2); list.add(3);
        list.add(1, 99);                   // 中间插入，O(n)
        System.out.println(list);          // [1, 99, 2, 3]
        System.out.println(list.get(0));   // 1
        System.out.println(list.size());   // 4
    }
}` },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '元素个数固定、需要频繁按下标读写 → 原生数组 int[] / T[]',
          '需要动态增删、但主要在尾部操作 → ArrayList',
          '矩阵、棋盘、表格 → 二维数组 int[][]',
          '用「下标当哈希」计数或标记 → 计数数组 int[26]、boolean[] 标记',
          '作为双指针、滑动窗口、前缀和等技巧的数据载体'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'p', text: '**案例问题**：给定一个 int 数组，完成三件事：① 求所有元素之和；② 找出最大值；③ 把数组原地反转（不新建数组）。 ' },
        { t: 'code', title: '遍历、求和、找最大值、原地反转', code: `public class ArrayOps {
    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5, 9};

        // 普通 for：能拿到下标
        int sum = 0, max = Integer.MIN_VALUE;
        for (int i = 0; i < a.length; i++) {
            sum += a[i];
            if (a[i] > max) max = a[i];
        }
        System.out.println("和 = " + sum + "，最大值 = " + max);

        // for-each：只读值，拿不到下标
        for (int x : a) System.out.print(x + " ");
        System.out.println();

        // 原地反转（双指针）
        int i = 0, j = a.length - 1;
        while (i < j) {
            int t = a[i]; a[i] = a[j]; a[j] = t;
            i++; j--;
        }
        for (int x : a) System.out.print(x + " ");
    }
}` },
        { t: 'why', items: [
          '普通 for（i < a.length）能拿到下标，适合需要原地修改或下标参与计算的场景；for-each 更简洁但拿不到下标，只适合只读遍历。',
          'max 初始化为 Integer.MIN_VALUE 而不是 0：若初始为 0，全负数数组如 [-3, -5] 会错误地返回 0。',
          '原地反转用相向双指针 i、j：每次交换 a[i] 和 a[j] 后 i++、j--，只用一个临时变量 t，空间 O(1)，避免新建数组浪费内存。',
          '交换必须用临时变量：若直接 a[i] = a[j]; a[j] = a[i]，第一句已把 a[i] 覆盖，第二句拿到的还是 a[j] 原值，两个位置会变成同一个数。'
        ] },
        { t: 'code', title: '计数数组：用下标当哈希', code: `public class CountArray {
    public static void main(String[] args) {
        String s = "hello world";
        int[] cnt = new int[128];        // 用字符的 ASCII 码当下标
        for (char c : s.toCharArray()) {
            cnt[c]++;
        }
        for (int i = 0; i < 128; i++) {
            if (cnt[i] > 0) {
                System.out.println((char) i + " 出现 " + cnt[i] + " 次");
            }
        }
    }
}` },
        { t: 'info', text: '**思路与复杂度**：计数数组用「字符/数字本身当下标」做 O(1) 计数，比 HashMap 更快更省。适用于值域小且连续（ASCII、26 字母、0~100 分数）；值域过大或稀疏时改用 HashMap。时间 O(n)、空间 O(值域)。' },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '数组越界', d: '下标范围是 [0, length-1]，访问 arr[length] 会抛 ArrayIndexOutOfBoundsException。写循环时尤其注意 <= 和 < 的区别。' },
          { t: '引用数组默认值是 null', d: 'Integer[] 创建后每个元素默认是 null，而不是 0；拆箱成 int 时可能抛空指针。' },
          { t: 'Arrays.asList 的坑', d: '它返回的 List 是定长的（不能 add/remove）；对 int[] 调用会把它当成一个元素，得到 List<int[]> 而不是 List<Integer>。' },
          { t: '遍历中删除', d: '用 for-each 删除 ArrayList 会抛 ConcurrentModificationException；应倒序遍历，或使用迭代器的 remove()。' },
          { t: '二维数组是数组的数组', d: 'int[][] 的每一行长度可以不同（锯齿数组）；matrix.length 是行数，matrix[0].length 是列数。' },
          { t: 'ArrayList 扩容开销', d: '默认初始容量 10，满了扩容为原来的 1.5 倍，涉及复制；已知大小时可用 new ArrayList<>(n) 指定容量。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '两数之和', diff: 'easy', note: '哈希表 O(n)，见第 2 章哈希表' },
          { name: '移动零', diff: 'easy', note: '双指针原地移动，见第 3 章' },
          { name: '合并区间', diff: 'medium', note: '排序后贪心合并' },
          { name: '旋转图像', diff: 'medium', note: '矩阵原地旋转，先转置再翻转' },
          { name: '最大子数组和', diff: 'medium', note: '前缀和 / 动态规划' }
        ]}
      ]
    },
    {
      id: 's2',
      title: '1.2 字符串',
      short: '字符串',
      minutes: 45,
      blocks: [
        { t: 'h', text: '概念：不可变对象' },
        { t: 'p', text: 'String 在 Java 里是**不可变**的：一旦创建，内容就不能改。任何「看起来在修改」的操作（concat、substring、toUpperCase、replace）都会返回一个**新的字符串**，原字符串不变。' },
        { t: 'tip', text: '因为不可变，String 可以安全地共享、做 HashMap/HashSet 的 key、被放进字符串常量池。代价是：循环里频繁用 + 拼接会不断创建中间对象，性能很差。' },
        { t: 'table', head: ['类', '是否可变', '线程安全', '适用场景'], rows: [
          ['String', '不可变', '是（不可变天然安全）', '固定文本、作 key'],
          ['StringBuilder', '可变', '否', '单线程频繁拼接（首选）'],
          ['StringBuffer', '可变', '是（方法加锁）', '多线程拼接']
        ]},
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '文本处理、解析、序列化、日志拼接',
          '回文、子串、匹配、编辑距离等算法题',
          '作为 HashMap / HashSet 的 key 做去重、分组、计数',
          '数字与字符串互转：Integer.parseInt / String.valueOf',
          '字符串常用方法：length、charAt、substring、indexOf、split、toCharArray、trim'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'code', title: '反转与回文判断', code: `public class StringDemo {
    public static void main(String[] args) {
        String s = "hello";

        // 反转：用 StringBuilder
        String rev = new StringBuilder(s).reverse().toString();
        System.out.println(rev);                 // olleh

        // 判断回文
        String p = "上海自来水来自海上";
        String pr = new StringBuilder(p).reverse().toString();
        System.out.println(p.equals(pr));        // true

        // 常用方法
        System.out.println(s.length());          // 5
        System.out.println(s.charAt(0));         // h
        System.out.println(s.substring(1, 3));   // el（左闭右开）
        System.out.println(s.indexOf("ll"));     // 2
        System.out.println(s.toUpperCase());     // HELLO
        System.out.println(s);                   // hello（原串不变！）
    }
}` },
        { t: 'code', title: '高频拼接用 StringBuilder', code: `public class StringBuilderDemo {
    public static void main(String[] args) {
        int n = 100000;

        // 反例：循环里用 + 拼接，每次都新建字符串，O(n^2)
        // String bad = "";
        // for (int i = 0; i < n; i++) bad += "x";

        // 正解：StringBuilder 原地追加，O(n)
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append("x");
        String good = sb.toString();
        System.out.println("长度 = " + good.length());
    }
}` },
        { t: 'p', text: '**案例问题**：给定两个字符串 s 和 t，判断它们是否互为字母异位词（由相同字符重新排列而成）。 ' },
        { t: 'code', title: '判断两个字符串是否互为字母异位词', code: `public class Anagram {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] cnt = new int[26];
        for (int i = 0; i < s.length(); i++) {
            cnt[s.charAt(i) - 'a']++;
            cnt[t.charAt(i) - 'a']--;
        }
        for (int c : cnt) if (c != 0) return false;
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram")); // true
        System.out.println(isAnagram("rat", "car"));         // false
    }
}` },
        { t: 'why', items: [
          '先比 length 不相等直接返回 false，能快速排除明显不等的情况，省去无谓计算。',
          '用 int[26] 计数数组而不是 HashMap：字符减 a 得到 0~25 的下标，字符集固定且连续时数组比哈希表更快更省内存。',
          '一个加一个减的巧处：s 的字符 +1、t 的字符 -1，最后全为 0 说明两个串的字符恰好抵消，一趟循环就完成对比。',
          'charAt(i) 返回 char，char 相减得到 int 下标，这是 Java 里把字符映射到数组下标的常用技巧。'
        ] },
        { t: 'info', text: '**思路与复杂度**：异位词 = 字符种类和个数完全相同。用 26 位计数数组，一个加一个减，最后全 0 即互为异位词。时间 O(n)、空间 O(1)。变体：字符集大可用 HashMap；也可排序后比较（O(n log n)）。' },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '== 与 equals', d: '== 比较的是引用（内存地址），equals 比较的是内容。new String("ab") 与 "ab" 用 == 比较是 false。' },
          { t: '不可变性', d: 's.toUpperCase() 不会修改 s 本身，必须接收返回值：s = s.toUpperCase();。忘记赋值是高频 bug。' },
          { t: '循环里用 + 拼接', d: '每次 + 都新建一个字符串，总复杂度 O(n^2)，应改用 StringBuilder。' },
          { t: 'substring / charAt 越界', d: 'substring(0, 5) 取的是 [0, 5) 半开区间；下标超过 length() 会抛异常。' },
          { t: 'split 的正则坑', d: 'split 的参数是正则表达式：split(".") 里的点号是通配符会匹配任意字符，要按点号切分必须对点号转义；此外末尾的空字符串默认会被丢弃。' },
          { t: '字符与字符串比较', d: '单个字符是 char 基本类型，用 == 比较；字符串必须用 equals 或 compareTo，不能用 > <。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '反转字符串', diff: 'easy', note: '双指针原地交换' },
          { name: '有效的字母异位词', diff: 'easy', note: '计数数组 / 排序后比较' },
          { name: '无重复字符的最长子串', diff: 'medium', note: '滑动窗口 + 哈希' },
          { name: '最长回文子串', diff: 'medium', note: '中心扩展 / 动态规划' },
          { name: '字符串转换整数 (atoi)', diff: 'medium', note: '处理空格、符号、溢出' }
        ]}
      ]
    },
    {
      id: 's3',
      title: '1.3 链表',
      short: '链表',
      minutes: 50,
      blocks: [
        { t: 'h', text: '概念：节点 + 指针' },
        { t: 'p', text: '链表由一个个**节点**组成，每个节点存「数据」和「指向下一个节点的引用」。链表不要求连续内存，因此**已知位置**的插入删除只需改指针（O(1)），但随机访问必须从头走（O(n)）。' },
        { t: 'code', title: '定义链表节点', code: `public class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}` },
        { t: 'table', head: ['对比项', '链表', '数组'], rows: [
          ['随机访问', 'O(n)，要逐个走', 'O(1)，按下标'],
          ['头部插入', 'O(1)', 'O(n)，要搬移'],
          ['已知位置插入/删除', 'O(1)，改指针', 'O(n)'],
          ['额外内存', '每个节点多存一个指针', '无（连续存放）']
        ]},
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '需要频繁在头部 / 中间插入删除（LRU 缓存、队列）',
          'Java 的 LinkedList 实现了 Deque，可当队列 / 栈用',
          '元素个数无法预知、需要动态增长',
          '面试高频：反转、合并、找环、删除倒数第 N 个、快慢指针'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'code', title: '构建链表并遍历', code: `public class LinkedListDemo {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static void main(String[] args) {
        // 构建 1 -> 2 -> 3 -> null
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);

        // 遍历打印
        for (ListNode p = head; p != null; p = p.next) {
            System.out.print(p.val + " ");
        }
        System.out.println();
    }
}` },
        { t: 'p', text: '**案例问题**：给定单链表头节点 head，反转链表并返回新的头节点（要求迭代、原地、不新建节点）。 ' },
        { t: 'code', title: '反转链表（迭代，面试必会）', code: `public class ReverseList {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode reverse(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode next = cur.next;  // 先保存下一个，否则会断链
            cur.next = prev;           // 反转指针
            prev = cur;                // 三个指针整体前移
            cur = next;
        }
        return prev;                   // 新的头节点
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        ListNode r = reverse(head);
        for (ListNode p = r; p != null; p = p.next) System.out.print(p.val + " ");
        // 输出：3 2 1
    }
}` },
        { t: 'why', items: [
          '用 prev（前一个）、cur（当前）两个指针，核心动作 cur.next = prev 把当前节点的指针反向。',
          '一定要先 next = cur.next 把下一个节点存起来，否则 cur.next = prev 之后，原来的下一个节点就找不到了，链表会断。',
          '三个指针整体前移的顺序是 prev = cur; cur = next，顺序不能乱。',
          '最后返回 prev：循环结束时 cur 为 null，prev 指向原链表最后一个节点，即反转后的新头。',
          '全程只改指针不新建节点，空间 O(1)。'
        ] },
        { t: 'p', text: '**案例问题**：① 找单链表的中间节点；② 判断链表是否有环。 ' },
        { t: 'code', title: '快慢指针：找中间节点 / 判断环', code: `public class FastSlow {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    // 快指针走两步，慢指针走一步
    public static ListNode middle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    public static boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;  // 相遇说明有环
        }
        return false;
    }

    public static void main(String[] args) {
        ListNode a = new ListNode(1), b = new ListNode(2);
        ListNode c = new ListNode(3), d = new ListNode(4);
        a.next = b; b.next = c; c.next = d;
        System.out.println("中间节点 = " + middle(a).val); // 3
        System.out.println("有环吗 = " + hasCycle(a));     // false
    }
}` },
        { t: 'why', items: [
          '快指针每次走 2 步、慢指针走 1 步，快指针到末尾时慢指针正好在中间——快慢指针最经典的用法。',
          '找中间节点循环条件是 fast != null 且 fast.next != null：fast 一次走两步，两个条件都要判，否则 fast.next.next 会空指针。',
          '判环（Floyd）：有环时快指针迟早追上慢指针（slow == fast）；无环时快指针先到 null 退出。',
          '有环必相遇的原因：快慢速度差为 1，每走一步距离缩 1，环长有限，必然在环内相遇、不会错过。'
        ] },
        { t: 'info', text: '**思路与复杂度**：快指针每次走 2 步、慢指针走 1 步。找中点：快指针到末尾时慢指针在中间（偶数个节点时是偏右的中点）。判环（Floyd）：有环时两指针必然相遇；相遇后把慢指针放回头、两指针同速前进，再次相遇处即环的入口。时间 O(n)、空间 O(1)。' },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '空指针异常', d: '写 node.next.next 之前必须先确认 node 和 node.next 都不为 null。链表题 90% 的报错都是 NPE。' },
          { t: '头节点丢失', d: '在头部插入 / 删除时要同步更新 head 引用，否则新的头会丢失。' },
          { t: '不会用 dummy 哨兵节点', d: '遇到「可能改头节点」的操作，先建一个 dummy 节点接在 head 前，最后返回 dummy.next，能统一处理头节点的特殊情况。' },
          { t: '反转时指针顺序', d: '一定要先保存 cur.next，再改 cur.next = prev；顺序反了链表就断了。' },
          { t: '遍历条件写错', d: 'cur != null 会多走一步到 null；cur.next != null 会漏掉最后一个节点。想清楚循环到底要访问谁。' },
          { t: 'Java 的 LinkedList 不是数组', d: 'LinkedList 是双向链表，get(i) 是 O(n) 而不是 O(1)，随机访问比 ArrayList 慢。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '反转链表', diff: 'easy', note: '迭代 + 递归两种写法' },
          { name: '环形链表', diff: 'easy', note: '快慢指针，进阶：找环的入口' },
          { name: '合并两个有序链表', diff: 'easy', note: 'dummy 哨兵节点' },
          { name: '删除链表的倒数第 N 个节点', diff: 'medium', note: '双指针间隔 N 步' },
          { name: '相交链表', diff: 'easy', note: '双指针走对方的路' }
        ]}
      ]
    }
  ],
  quiz: [
    { q: '关于 Java 的 String，下列说法正确的是？', options: ['String 是可变的，能原地修改', 'String 是不可变的，拼接会返回新对象', 'StringBuilder 是不可变的', '比较字符串内容应该用 =='], answer: 1, explain: 'String 不可变；频繁拼接应使用 StringBuilder；比较内容用 equals，比较引用才用 ==。' },
    { q: '按下标访问数组元素 arr[i] 的时间复杂度是？', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 0, explain: '数组是连续内存，通过下标直接算出地址，O(1)。这是数组最大的优势。' },
    { q: '在已知位置的链表节点之后插入一个新节点，时间复杂度是？', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 0, explain: '链表只需改两个指针即可完成插入，O(1)。这正是链表相对数组的优势。' },
    { q: '遍历 ArrayList 时哪种删除方式最安全？', options: ['for-each 里直接 remove', '正序 for 里 remove', '倒序 for 里 remove', '随便删都行'], answer: 2, explain: '倒序遍历删除不影响未访问元素的下标；for-each 中删除会抛 ConcurrentModificationException。' }
  ],
  exercises: [
    {
      id: 'ex-c1-1',
      title: '练习 1：原地反转字符串',
      level: '入门',
      brief: '给定字符数组 char[] s，原地反转它。要求不能使用额外的数组，只允许 O(1) 额外空间。',
      requirements: [
        '类名 ReverseString，方法 reverseString(char[] s) 原地反转',
        '使用双指针，一头一尾交换',
        'main 中测试：把字符数组 h e l l o 反转后打印出 olleh'
      ],
      starter: `public class ReverseString {
    public void reverseString(char[] s) {
        // TODO: 原地反转字符数组，不要用额外数组
    }

    public static void main(String[] args) {
        char[] s = {'h','e','l','l','o'};
        new ReverseString().reverseString(s);
        System.out.println(new String(s)); // 期望输出 olleh
    }
}`,
      expectedOutput: 'olleh',
      keyPoints: [
        { label: '双指针 i 从 0 开始', test: /int\s+i\s*=\s*0/ },
        { label: 'j 从尾部 length - 1 开始', test: /length\s*-\s*1/ },
        { label: '循环条件 i < j', test: /i\s*<\s*j/ },
        { label: '用临时变量交换元素', test: /char\s+\w+\s*=/ },
        { label: '指针移动 i++ 和 j--', test: /i\+\+[\s\S]*j--|j--[\s\S]*i\+\+/ }
      ],
      hints: [
        '设 i = 0，j = s.length - 1',
        '只要 i < j 就交换 s[i] 和 s[j]，然后 i++、j--',
        '交换需要一个临时变量暂存其中一个字符'
      ],
      analysis: '双指针相向而行：每次交换头尾两个字符，然后两个指针向中间靠拢，直到相遇。每个字符只被交换一次，时间复杂度 O(n)，空间 O(1)。',
      solution: `public class ReverseString {
    public void reverseString(char[] s) {
        int i = 0, j = s.length - 1;
        while (i < j) {
            char t = s[i];
            s[i] = s[j];
            s[j] = t;
            i++;
            j--;
        }
    }

    public static void main(String[] args) {
        char[] s = {'h','e','l','l','o'};
        new ReverseString().reverseString(s);
        System.out.println(new String(s)); // olleh
    }
}`
    },
    {
      id: 'ex-c1-2',
      title: '练习 2：反转单链表',
      level: '中等',
      brief: '给定单链表的头节点 head，反转链表并返回新的头节点。要求用迭代（循环）实现。',
      requirements: [
        '定义 ListNode 节点类（int val + ListNode next）',
        '方法 reverse(ListNode head) 返回反转后的头',
        '用 prev、cur 两个指针迭代反转，不新建节点',
        'main 中构建 1->2->3，反转后打印 3 2 1'
      ],
      starter: `public class ReverseList {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode reverse(ListNode head) {
        // TODO: 迭代反转链表
        return null;
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        ListNode r = reverse(head);
        for (ListNode p = r; p != null; p = p.next) System.out.print(p.val + " ");
    }
}`,
      expectedOutput: '3 2 1',
      keyPoints: [
        { label: '定义 prev 和 cur 两个指针', test: /ListNode\s+prev/ },
        { label: '用 while 循环遍历', test: /while\s*\(/ },
        { label: '先保存 next 节点', test: /next\s*=\s*cur\.next/ },
        { label: '反转指针 cur.next = prev', test: /cur\.next\s*=\s*prev/ },
        { label: '返回新的头 prev', test: /return\s+prev/ }
      ],
      hints: [
        '初始化 prev = null，cur = head',
        '循环里先保存 cur.next 到 next，否则断链',
        '然后 cur.next = prev，再 prev = cur、cur = next',
        '循环结束后 prev 就是新的头'
      ],
      analysis: '用三个指针 prev（前一个）、cur（当前）、next（下一个）逐步反转每个节点的指向。核心是「先保存 next，再改指针，再整体前移」。时间复杂度 O(n)，空间 O(1)。',
      solution: `public class ReverseList {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode reverse(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        ListNode r = reverse(head);
        for (ListNode p = r; p != null; p = p.next) System.out.print(p.val + " ");
        // 3 2 1
    }
}`
    },
    {
      id: 'ex-c1-3',
      title: '练习 3：有效的字母异位词',
      level: '入门',
      brief: '给定两个字符串 s 和 t，判断它们是否互为字母异位词（由相同字符重新排列而成）。',
      requirements: [
        '类名 ValidAnagram，方法 isAnagram(String s, String t)',
        '长度不同直接返回 false',
        '用长度为 26 的计数数组统计，一个加一个减',
        'main 中测试 anagram 与 nagaram 返回 true，rat 与 car 返回 false'
      ],
      starter: `public class ValidAnagram {
    public boolean isAnagram(String s, String t) {
        // TODO: 判断两个字符串是否互为字母异位词
        return false;
    }

    public static void main(String[] args) {
        ValidAnagram v = new ValidAnagram();
        System.out.println(v.isAnagram("anagram", "nagaram")); // true
        System.out.println(v.isAnagram("rat", "car"));         // false
    }
}`,
      expectedOutput: 'true\nfalse',
      keyPoints: [
        { label: '先判断长度是否相等', test: /length\(\)/ },
        { label: '用长度为 26 的计数数组', test: /new\s+int\[26\]/ },
        { label: '用 charAt 相减得到下标', test: /charAt\s*\([^)]*\)\s*-\s*'a'/ },
        { label: '一个加一个减', test: /\+\+[\s\S]*--|--[\s\S]*\+\+/ }
      ],
      hints: [
        '若 s.length() != t.length()，直接返回 false',
        'int[] cnt = new int[26]',
        '一次循环：cnt[s.charAt(i)-a] 加一，cnt[t.charAt(i)-a] 减一',
        '最后检查 cnt 里是否全为 0'
      ],
      analysis: '异位词的本质是「每个字符出现次数相同」。用计数数组：遍历时一个字符 +1、另一个 -1，若最终全部为 0 说明抵消干净，两者互为异位词。时间 O(n)，空间 O(1)。',
      solution: `public class ValidAnagram {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] cnt = new int[26];
        for (int i = 0; i < s.length(); i++) {
            cnt[s.charAt(i) - 'a']++;
            cnt[t.charAt(i) - 'a']--;
        }
        for (int c : cnt) if (c != 0) return false;
        return true;
    }

    public static void main(String[] args) {
        ValidAnagram v = new ValidAnagram();
        System.out.println(v.isAnagram("anagram", "nagaram")); // true
        System.out.println(v.isAnagram("rat", "car"));         // false
    }
}`
    }
  ]
});
