/* 第 5 章 · 递归、分治、回溯 */
window.COURSE = window.COURSE || [];
window.COURSE.push({
  id: 'c5',
  title: '递归、分治、回溯',
  minutes: 170,
  tags: ['递归', '分治', '回溯', '剪枝', '排列组合'],
  goals: [
    '理解递归的三要素：终止条件、递推关系、缩小规模',
    '掌握分治的「分解 - 解决 - 合并」框架（归并、快排、快速幂）',
    '掌握回溯的「选择 - 递归 - 撤销」模板与剪枝',
    '能解决排列、组合、子集、N 皇后等经典回溯题'
  ],
  interview: [
    { q: '递归的优缺点？什么时候会栈溢出？', a: '优点：代码简洁，天然表达树、分治、回溯等自相似结构。缺点：每层调用占用栈空间，深度过大（如递归 10 万次）会 **StackOverflowError**，且可能重复计算。可改成迭代或用记忆化优化。' },
    { q: '回溯的模板是什么？为什么要撤销？', a: '模板 = **选择 → 递归 → 撤销**。递归返回后必须撤销（path.remove、used[i] = false）恢复现场，否则上一层看到的路径是脏的，结果错乱。回溯本质是「穷举 + 剪枝」的 DFS。' },
    { q: '分治和动态规划的区别？', a: '分治把问题拆成**互不重叠**的子问题分别求解再合并（归并、快排）；动态规划处理**子问题重叠**的情况，用缓存/递推避免重复计算（斐波那契）。「子问题是否重叠」是两者的分水岭。' },
    { q: '递归怎么优化？', a: '① **记忆化**：用数组缓存已算结果，避免重复计算（斐波那契从 O(2^n) 到 O(n)）；② 改成**迭代**（循环 + 显式栈）；③ 尾递归（依赖编译器优化，Java 不保证）。' }
  ],
  sections: [
    {
      id: 's1',
      title: '5.1 递归',
      short: '递归',
      minutes: 45,
      blocks: [
        { t: 'h', text: '概念：函数调用自己' },
        { t: 'p', text: '递归是把大问题分解成「规模更小的同类子问题」：函数在内部调用自己，直到遇到**终止条件**（基准情形）返回，再逐层回溯。递归三要素：**终止条件、递推关系、缩小规模**。' },
        { t: 'code', title: '阶乘与斐波那契', code: `public class RecursionDemo {
    // 阶乘：n! = n * (n-1)!
    public static int factorial(int n) {
        if (n <= 1) return 1;            // 终止条件
        return n * factorial(n - 1);     // 递推 + 缩小规模
    }

    // 斐波那契：f(n) = f(n-1) + f(n-2)
    public static int fib(int n) {
        if (n <= 1) return n;            // 终止条件
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));  // 120
        System.out.println(fib(10));       // 55
    }
}` },
        { t: 'warn', text: '朴素递归的斐波那契会**重复计算**（fib(5) 会反复算 fib(3)、fib(2)），复杂度是 O(2^n)。优化用记忆化（存已算结果）或改成迭代，这正是动态规划的起点（见第 8 章）。' },
        { t: 'p', text: '**案例问题**：用递归方式反转单链表。 ' },
        { t: 'code', title: '递归反转链表', code: `public class ReverseRec {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode reverse(ListNode head) {
        if (head == null || head.next == null) return head; // 终止条件
        ListNode newHead = reverse(head.next);  // 反转后面的部分
        head.next.next = head;                  // 让下一个节点指向自己
        head.next = null;                       // 断开原来的指向
        return newHead;
    }

    public static void main(String[] args) {
        ListNode h = new ListNode(1);
        h.next = new ListNode(2);
        h.next.next = new ListNode(3);
        ListNode r = reverse(h);
        for (ListNode p = r; p != null; p = p.next) System.out.print(p.val + " ");
        // 3 2 1
    }
}` },
        { t: 'why', items: [
          '先递归到链表末尾（head.next == null 返回 head），得到反转后子链表的头 newHead。',
          '回溯时让下一个节点指向自己 head.next.next = head，再断开 head.next = null。',
          'head.next = null 必须做：否则原头节点还指向下一个节点，会形成环。',
          '递归深度等于链表长度，空间 O(n)；迭代版只用 O(1)，所以面试更常要求迭代。'
        ] },
        { t: 'info', text: '**思路与复杂度**：递归反转：先反转后面的部分得到 newHead，再让 head.next.next = head、head.next = null。递归深度等于链表长度，空间 O(n)；迭代版空间 O(1)。递归版更简洁，迭代版不爆栈、面试更常考。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '树、链表的遍历（先序 / 后序天然递归）',
          '分治、回溯、DFS 的基础',
          '数学问题：阶乘、斐波那契、汉诺塔、快速幂',
          '把「大问题」自然拆成「同构小问题」的场景'
        ]},
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '缺少终止条件', d: '没有基准情形会导致无限递归，最终 StackOverflowError。' },
          { t: '栈溢出', d: '递归层数太深（如递归 10 万次）会栈溢出；可改成迭代或用尾递归。' },
          { t: '重复计算', d: '斐波那契这类「分叉递归」会指数级重复计算，要用记忆化数组缓存。' },
          { t: '递归返回值没接收', d: '递归调用返回的结果要正确传递/累加，漏掉会导致结果丢失。' },
          { t: '参数 / 状态没缩小', d: '每次递归必须让规模向终止条件靠拢（如 n-1），否则死循环。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '爬楼梯', diff: 'easy', note: '递归/记忆化/DP' },
          { name: '反转链表（递归）', diff: 'easy', note: '递归改写' },
          { name: '斐波那契数', diff: 'easy', note: '记忆化优化' },
          { name: '合并两个有序链表（递归）', diff: 'easy', note: '递归比较头节点' },
          { name: '汉诺塔问题', diff: 'medium', note: '经典递归' }
        ]}
      ]
    },
    {
      id: 's2',
      title: '5.2 分治',
      short: '分治',
      minutes: 45,
      blocks: [
        { t: 'h', text: '概念：分解 - 解决 - 合并' },
        { t: 'p', text: '分治把问题**分解**成若干个规模更小的子问题，分别**解决**，再把结果**合并**成原问题的解。典型如归并排序（分两半、各自排序、合并）、快速排序、快速幂。复杂度常用主定理分析，多为 O(n log n)。' },
        { t: 'code', title: '分治求最大值', code: `public class DivideMax {
    public static int max(int[] a, int lo, int hi) {
        if (lo == hi) return a[lo];               // 只有一个元素
        int mid = lo + (hi - lo) / 2;
        int leftMax = max(a, lo, mid);            // 分解 + 解决左半
        int rightMax = max(a, mid + 1, hi);       // 分解 + 解决右半
        return Math.max(leftMax, rightMax);       // 合并
    }

    public static void main(String[] args) {
        int[] a = {3, 9, 1, 7, 5};
        System.out.println(max(a, 0, a.length - 1)); // 9
    }
}` },
        { t: 'p', text: '**案例问题**：实现 pow(x, n)，计算 x 的 n 次方（n 可为负数）。 ' },
        { t: 'code', title: '快速幂（分治 + 递归）', code: `public class FastPow {
    public static double myPow(double x, int n) {
        long N = n;
        if (N < 0) { x = 1 / x; N = -N; }   // 处理负数次幂
        return fastPow(x, N);
    }

    public static double fastPow(double x, long n) {
        if (n == 0) return 1;                 // 终止条件
        double half = fastPow(x, n / 2);      // 分治：先算一半
        return n % 2 == 0 ? half * half : half * half * x;
    }

    public static void main(String[] args) {
        System.out.println(myPow(2.0, 10));   // 1024.0
        System.out.println(myPow(2.0, -2));   // 0.25
    }
}` },
        { t: 'why', items: [
          '分治：x^n = (x^(n/2))²，先算一半再平方，递归深度从 n 降到 log n。',
          'n 为偶数返回 half × half，奇数返回 half × half × x（如 x^7 = (x^3)² × x）。',
          '负数次幂先 x = 1/x、N = -N 转成正数。',
          'N 用 long 承接：n 是 Integer.MIN_VALUE 时 -n 会溢出，必须用 long。'
        ] },
        { t: 'info', text: '**思路与复杂度**：快速幂把「求 x^n」拆成「先求 x^(n/2) 再平方」，递归深度 O(log n)。负数次幂先取倒数，n 用 long 承接避免 Integer.MIN_VALUE 取反溢出。时间 O(log n)、空间 O(log n)（递归栈）。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '归并排序、快速排序',
          '快速幂、矩阵快速幂',
          '多数元素、最大子数组和（分治解法）',
          '最近点对、大整数乘法等经典分治问题'
        ]},
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '忘记合并步骤', d: '分解、解决之后必须正确合并子结果，漏掉合并结果就错了。' },
          { t: '边界写错', d: '分两半时 mid = lo + (hi - lo) / 2，左 [lo, mid]、右 [mid+1, hi]，别重叠或遗漏。' },
          { t: '递归终止条件', d: 'lo >= hi 或 lo == hi 要返回，否则无限递归。' },
          { t: '负数 / 边界处理', d: '快速幂里 n 是 Integer.MIN_VALUE 时 -n 会溢出，要用 long 承接。' },
          { t: '分治不一定更快', d: '子问题有大量重叠时，朴素分治会重复计算（如斐波那契），要配合记忆化。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '排序数组（归并/快排）', diff: 'medium', note: '分治经典' },
          { name: 'Pow(x, n)', diff: 'medium', note: '快速幂' },
          { name: '多数元素', diff: 'easy', note: '分治 / 投票法' },
          { name: '最大子数组和', diff: 'medium', note: '分治 / 前缀和 / DP' },
          { name: '为运算表达式设计优先级', diff: 'medium', note: '分治 + 递归' }
        ]}
      ]
    },
    {
      id: 's3',
      title: '5.3 回溯',
      short: '回溯',
      minutes: 60,
      blocks: [
        { t: 'h', text: '概念：试错 + 撤销' },
        { t: 'p', text: '回溯是**穷举 + 剪枝**：从当前状态出发，尝试每一种选择，递归深入；若发现走不通或已得到答案，就**撤销上一步**（恢复现场）再试别的选择。核心模板：**选择 → 递归 → 撤销**。它系统地搜索解空间，常用于排列、组合、子集、棋盘类问题。' },
        { t: 'code', title: '回溯通用模板', code: `void backtrack(参数) {
    if (满足结束条件) {
        记录结果;
        return;
    }
    for (每个可选的选择) {
        做选择;                     // 加入路径 / 标记已用
        backtrack(更新后的参数);     // 递归深入
        撤销选择;                   // 移除路径 / 恢复标记（关键！）
    }
}` },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '全排列、组合、子集',
          '组合总和、电话号码的字母组合',
          'N 皇后、解数独、单词搜索',
          '括号生成、分割回文串'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'p', text: '**案例问题**：给定不含重复数字的数组，返回它的所有全排列。 ' },
        { t: 'code', title: '全排列（回溯经典）', code: `import java.util.*;

public class Permute {
    public static List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), res);
        return res;
    }

    private static void backtrack(int[] nums, boolean[] used,
                                  List<Integer> path, List<List<Integer>> res) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));   // 复制一份，别直接加 path
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;            // 剪枝：已经用过
            used[i] = true;                   // 选择
            path.add(nums[i]);
            backtrack(nums, used, path, res); // 递归
            path.remove(path.size() - 1);     // 撤销
            used[i] = false;                  // 撤销
        }
    }

    public static void main(String[] args) {
        System.out.println(permute(new int[]{1, 2, 3}));
    }
}` },
        { t: 'why', items: [
          '回溯三要素：选择（used[i]=true + path.add）、递归、撤销（path.remove + used[i]=false）。',
          'used 数组标记哪些数已选，避免同一个数被重复放进排列。',
          '撤销是关键：递归返回后必须恢复现场，否则上一层看到的 path 和 used 是脏的，结果错乱。',
          'res.add(new ArrayList<>(path)) 要复制一份：直接 add(path) 存的是同一个引用，最后所有结果都会变成空。',
          '终止条件 path.size() == nums.length：凑满一个排列就收集。'
        ] },
        { t: 'info', text: '**思路与复杂度**：回溯三要素：选择（used[i]=true + path.add）、递归、撤销（path.remove + used[i]=false）。撤销是关键，否则状态污染。全排列共 n! 种，时间 O(n × n!)、空间 O(n)。子集/组合用 start 参数去重，排列用 used 标记。' },
        { t: 'code', title: '子集', code: `import java.util.*;

public class Subsets {
    public static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }

    private static void backtrack(int[] nums, int start,
                                  List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));       // 每个节点都是合法子集
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1, path, res);// start 递增避免重复
            path.remove(path.size() - 1);     // 撤销
        }
    }

    public static void main(String[] args) {
        System.out.println(subsets(new int[]{1, 2, 3}));
    }
}` },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '忘记撤销', d: '递归返回后要 path.remove 和 used[i] = false，否则状态污染，结果错乱。' },
          { t: '直接加 path 引用', d: 'res.add(new ArrayList<>(path)) 要复制，直接 add(path) 存的都是同一个列表，最终全是空的。' },
          { t: '产生重复结果', d: '组合/子集用 start 参数保证只向后选，避免 {1,2} 和 {2,1} 重复；全排列用 used 标记。' },
          { t: '剪枝条件漏了', d: '不加剪枝会枚举大量无效分支，指数级超时；想清楚什么时候可以 continue。' },
          { t: '终止条件写错', d: '结束条件要与题意匹配（如 path 长度 == 数组长度 / 目标值），写错会漏解或多解。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '全排列', diff: 'medium', note: 'used 标记 + 撤销' },
          { name: '子集', diff: 'medium', note: 'start 参数避免重复' },
          { name: '组合总和', diff: 'medium', note: '可重复选 + 剪枝' },
          { name: '括号生成', diff: 'medium', note: '左括号数 <= 右括号数剪枝' },
          { name: 'N 皇后', diff: 'hard', note: '逐行放 + 对角线剪枝' }
        ]}
      ]
    }
  ],
  quiz: [
    { q: '递归函数必须包含什么才能避免死循环？', options: ['for 循环', '终止条件（基准情形）', '返回 void', '全局变量'], answer: 1, explain: '递归必须有终止条件，到基准情形就返回，否则无限递归栈溢出。' },
    { q: '朴素递归求斐波那契的主要问题是？', options: ['结果错误', '大量重复计算，指数级时间', '栈一定溢出', '无法写出'], answer: 1, explain: 'fib(n-1) 和 fib(n-2) 会重复计算大量子问题，O(2^n)，需记忆化或迭代。' },
    { q: '分治算法的三个步骤是？', options: ['排序、查找、插入', '分解、解决、合并', '入栈、出栈、判空', '选择、递归、撤销'], answer: 1, explain: '分治 = 分解成子问题 + 分别解决 + 合并结果，典型如归并排序。' },
    { q: '回溯算法的核心模板是？', options: ['选择 → 递归 → 撤销', '入队 → 出队', '分解 → 合并', '排序 → 二分'], answer: 0, explain: '回溯是做选择、递归深入、再撤销选择恢复现场，穷举解空间。' }
  ],
  exercises: [
    {
      id: 'ex-c5-1',
      title: '练习 1：斐波那契数（记忆化）',
      level: '入门',
      brief: '计算第 n 个斐波那契数（F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)）。要求用递归 + 记忆化数组，避免重复计算。',
      requirements: [
        '类名 Fibonacci，方法 fib(int n)',
        '用数组 memo 缓存已算过的结果',
        '递归有终止条件 n <= 1',
        'main 测试 fib(10) 返回 55'
      ],
      starter: `public class Fibonacci {
    private int[] memo;

    public int fib(int n) {
        memo = new int[n + 1];
        return helper(n);
    }

    private int helper(int n) {
        // TODO: 递归 + 记忆化
        return 0;
    }

    public static void main(String[] args) {
        Fibonacci f = new Fibonacci();
        System.out.println(f.fib(10)); // 55
    }
}`,
      expectedOutput: '55',
      keyPoints: [
        { label: '终止条件 n <= 1', test: /if\s*\(\s*n\s*<=\s*1\)|n\s*<\s*2/ },
        { label: '递归调用 helper', test: /helper\s*\(n\s*-\s*1\)/ },
        { label: '两个子问题相加', test: /helper\(n\s*-\s*1\)\s*\+\s*helper\(n\s*-\s*2\)/ },
        { label: '用 memo 缓存', test: /memo\[/ }
      ],
      hints: [
        'n <= 1 时直接返回 n',
        '先检查 memo[n] 是否已算过（非 0 则直接返回）',
        '否则 memo[n] = helper(n-1) + helper(n-2)，返回 memo[n]'
      ],
      analysis: '记忆化递归：用数组缓存每个已计算的子问题，命中缓存直接返回，把重复计算消除，复杂度从 O(2^n) 降到 O(n)。这也是动态规划「自顶向下」的雏形。',
      solution: `public class Fibonacci {
    private int[] memo;

    public int fib(int n) {
        memo = new int[n + 1];
        return helper(n);
    }

    private int helper(int n) {
        if (n <= 1) return n;
        if (memo[n] != 0) return memo[n];   // 命中缓存
        memo[n] = helper(n - 1) + helper(n - 2);
        return memo[n];
    }

    public static void main(String[] args) {
        Fibonacci f = new Fibonacci();
        System.out.println(f.fib(10)); // 55
    }
}`
    },
    {
      id: 'ex-c5-2',
      title: '练习 2：全排列',
      level: '中等',
      brief: '给定一个不含重复数字的数组 nums，返回它的所有全排列。',
      requirements: [
        '类名 Permutations，方法 permute(int[] nums) 返回 List<List<Integer>>',
        '用回溯 + used 布尔数组标记',
        '递归后撤销选择（path.remove 和 used 恢复）',
        'main 测试 {1,2,3} 输出所有 6 个排列'
      ],
      starter: `import java.util.*;

public class Permutations {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        // TODO: 调用回溯
        return res;
    }

    public static void main(String[] args) {
        Permutations p = new Permutations();
        System.out.println(p.permute(new int[]{1, 2, 3}));
    }
}`,
      expectedOutput: '[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]',
      keyPoints: [
        { label: '定义回溯方法', test: /backtrack/ },
        { label: '用 used 布尔数组', test: /boolean\[\]\s*used/ },
        { label: '加入路径 path.add', test: /path\.add\(/ },
        { label: '递归后撤销 path.remove', test: /path\.remove\(/ },
        { label: '收集结果 res.add', test: /res\.add\(new\s+ArrayList/ }
      ],
      hints: [
        'backtrack(nums, used, path, res) 递归',
        'path.size() == nums.length 时 res.add(new ArrayList<>(path))',
        '遍历 nums，used[i] 则跳过',
        '选择：used[i]=true、path.add；递归；撤销：path.remove、used[i]=false'
      ],
      analysis: '回溯枚举每个位置放哪个数：用 used 数组标记哪些数已选，走到 path 长度等于数组长度时得到一个排列。撤销操作保证回到上一层时状态正确。时间 O(n * n!)。',
      solution: `import java.util.*;

public class Permutations {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] nums, boolean[] used,
                           List<Integer> path, List<List<Integer>> res) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums, used, path, res);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }

    public static void main(String[] args) {
        Permutations p = new Permutations();
        System.out.println(p.permute(new int[]{1, 2, 3}));
    }
}`
    },
    {
      id: 'ex-c5-3',
      title: '练习 3：子集',
      level: '中等',
      brief: '给定一个不含重复数字的数组 nums，返回它的所有子集（幂集），解集不能包含重复子集。',
      requirements: [
        '类名 Subsets，方法 subsets(int[] nums) 返回 List<List<Integer>>',
        '用回溯 + start 参数避免重复',
        '每个递归节点都加入结果',
        'main 测试 {1,2,3} 输出 8 个子集（含空集）'
      ],
      starter: `import java.util.*;

public class Subsets {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        // TODO: 调用回溯
        return res;
    }

    public static void main(String[] args) {
        Subsets s = new Subsets();
        System.out.println(s.subsets(new int[]{1, 2, 3}));
    }
}`,
      expectedOutput: '[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]',
      keyPoints: [
        { label: '定义回溯方法', test: /backtrack/ },
        { label: '收集每个子集', test: /res\.add\(new\s+ArrayList/ },
        { label: '用 start 参数', test: /start/ },
        { label: '递归时 i + 1 避免重复', test: /backtrack[^;]*i\s*\+\s*1|start\s*\+\s*1/ },
        { label: '撤销 path.remove', test: /path\.remove\(/ }
      ],
      hints: [
        'backtrack(nums, start, path, res)',
        '每个节点先 res.add(new ArrayList<>(path))',
        'for 从 start 到末尾：path.add(nums[i])，递归 backtrack(i+1)，再 path.remove',
        '空集在第一次调用时就加入了'
      ],
      analysis: '子集问题里「顺序无关」，用 start 保证只向后选，天然去重（{1,2} 和 {2,1} 只出现一次）。每个节点都是一个合法子集，所以每进入递归都记录一次。时间 O(n * 2^n)。',
      solution: `import java.util.*;

public class Subsets {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] nums, int start,
                           List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }

    public static void main(String[] args) {
        Subsets s = new Subsets();
        System.out.println(s.subsets(new int[]{1, 2, 3}));
    }
}`
    }
  ]
});
