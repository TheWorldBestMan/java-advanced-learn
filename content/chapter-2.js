/* 第 2 章 · 栈、队列、哈希表 */
window.COURSE = window.COURSE || [];
window.COURSE.push({
  id: 'c2',
  title: '栈、队列、哈希表',
  minutes: 160,
  tags: ['栈', '队列', '哈希表', '单调栈', 'Deque'],
  goals: [
    '掌握栈（LIFO）与队列（FIFO）的语义、Java 实现与经典应用',
    '会用栈解决括号匹配、表达式求值、单调栈问题',
    '理解哈希表的原理、复杂度与 HashMap 常用操作',
    '牢记 equals / hashCode 契约与 HashMap 遍历删除的坑'
  ],
  interview: [
    { q: 'HashMap 的底层原理？', a: '**数组 + 链表/红黑树**。通过 key 的 hashCode 定位到数组下标（桶），同一下标的元素用链表串起来；JDK 8 起某桶链表长度超过 8 且数组长度 >= 64 时转成红黑树，查找从 O(n) 降到 O(log n)。默认初始容量 16、负载因子 0.75，元素超过阈值就扩容为 2 倍并重新哈希。' },
    { q: 'equals 和 hashCode 有什么关系？', a: '契约：两个对象 **equals 相等，hashCode 必须相等**；hashCode 相等，equals 不一定相等（哈希冲突）。所以**重写 equals 必须同时重写 hashCode**，否则对象放进 HashMap/HashSet 会出 bug（存得进、取不出）。' },
    { q: '用两个栈实现队列的思路？', a: 'in 栈负责入队（push），out 栈负责出队（pop/peek）。出队时若 out 为空，就把 in 全部倒进 out（顺序反转），out 栈顶就是队头。每个元素最多被搬运一次，**均摊 O(1)**。' },
    { q: '什么是哈希冲突？怎么解决？', a: '不同 key 算出相同的哈希值/下标叫哈希冲突。Java 用**链地址法**：冲突的元素挂成链表/红黑树。此外还有开放定址法、再哈希法等。好的哈希函数 + 合适负载因子能减少冲突，冲突过多时查找退化。' }
  ],
  sections: [
    {
      id: 's1',
      title: '2.1 栈',
      short: '栈',
      minutes: 50,
      blocks: [
        { t: 'h', text: '概念：后进先出（LIFO）' },
        { t: 'p', text: '栈是**后进先出**（LIFO）的结构：最后放进去的元素最先被取出。只在一端操作，这一端叫栈顶。核心操作：push（入栈）、pop（出栈）、peek（看栈顶）、isEmpty（判空）。' },
        { t: 'p', text: 'Java 里推荐用 **ArrayDeque** 当栈（push / pop / peek），而不是老的 Stack 类——Stack 继承 Vector，方法加了锁、性能差，官方文档都建议用 Deque 替代。' },
        { t: 'code', title: '用 ArrayDeque 当栈', code: `import java.util.*;

public class StackDemo {
    public static void main(String[] args) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(1);   // 入栈
        stack.push(2);
        stack.push(3);
        System.out.println(stack.peek());  // 3，栈顶
        System.out.println(stack.pop());   // 3，出栈
        System.out.println(stack.pop());   // 2
        System.out.println(stack.isEmpty()); // false
    }
}` },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '括号匹配、表达式求值、函数调用栈',
          'DFS 深度优先搜索（用栈记录路径）',
          '浏览器的前进 / 后退、撤销操作（Undo）',
          '单调栈：找下一个更大 / 更小元素',
          '括号、回文等「对称 / 嵌套」结构天然适合栈'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'p', text: '**案例问题**：给定只含 ()[]{} 的字符串，判断括号是否有效：左括号必须用同类型右括号闭合，且闭合顺序正确。 ' },
        { t: 'code', title: '有效的括号（栈的经典应用）', code: `import java.util.*;

public class ValidBrackets {
    public static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);               // 左括号入栈
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == ']' && top != '[') return false;
                if (c == '}' && top != '{') return false;
            }
        }
        return stack.isEmpty();              // 最后栈必须为空
    }

    public static void main(String[] args) {
        System.out.println(isValid("()[]{}")); // true
        System.out.println(isValid("([)]"));   // false
        System.out.println(isValid("{[]}"));   // true
    }
}` },
        { t: 'why', items: [
          '用栈是因为括号是「后进先出」的嵌套结构：最后出现的左括号必须最先被匹配，正好对应栈顶。',
          '左括号一律入栈、右括号才去匹配栈顶，天然保证「后进先出」的匹配顺序。',
          '匹配前先判 isEmpty：如字符串以 ) 开头，栈为空说明没有可匹配的左括号，直接返回 false。',
          '最后返回 stack.isEmpty()：所有左括号都被正确匹配完，栈必须为空，否则说明有多余的左括号。'
        ] },
        { t: 'code', title: '单调栈：求每个元素右边第一个更大的数', code: `import java.util.*;

public class NextGreater {
    public static int[] nextGreater(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        Arrays.fill(res, -1);
        Deque<Integer> stack = new ArrayDeque<>();  // 存下标，栈底到栈顶递减
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
                int top = stack.pop();
                res[top] = nums[i];          // 栈顶元素的右边第一个更大值
            }
            stack.push(i);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreater(new int[]{2, 1, 2, 4, 3})));
        // 输出 [4, 2, 4, -1, -1]
    }
}` },
        { t: 'info', text: '**思路与复杂度**：单调栈维护「栈底到栈顶递减」的下标：遇到更大的数就不断弹出栈顶并记录答案，再把当前下标入栈。每个元素最多入栈、出栈一次，时间 O(n)、空间 O(n)。模板：找「下一个更大」用递减栈，找「下一个更小」用递增栈。' },
        { t: 'h', text: '更多场景：每种栈操作怎样落地' },
        { t: 'code', title: '后缀表达式求值：2 3 + 4 * = 20', code: `import java.util.*;

public class RpnExample {
    static int eval(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String token : tokens) {
            if (!"+".equals(token) && !"-".equals(token) && !"*".equals(token)) {
                stack.push(Integer.parseInt(token));
                continue;
            }
            int right = stack.pop(); // 后弹出的才是左操作数
            int left = stack.pop();
            if ("+".equals(token)) stack.push(left + right);
            else if ("-".equals(token)) stack.push(left - right);
            else stack.push(left * right);
        }
        return stack.pop();
    }

    public static void main(String[] args) {
        System.out.println(eval(new String[]{"2", "3", "+", "4", "*"})); // 20
        System.out.println(eval(new String[]{"8", "3", "-"})); // 5，顺序不能反
    }
}` },
        { t: 'why', items: [
          '数字入栈；运算符取出最近的两个结果并把计算结果压回。对于减法和除法，先弹出的是右操作数，顺序不能颠倒。',
          '这里输入是已经按后缀形式排列的表达式；处理普通中缀表达式还需要运算符栈来处理优先级和括号。'
        ] },
        { t: 'code', title: '显式栈 DFS：记录 A 到 D 的路径', code: `import java.util.*;

public class DfsPathExample {
    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B", "C"));
        graph.put("B", Arrays.asList("D"));
        graph.put("C", Collections.emptyList());
        graph.put("D", Collections.emptyList());

        Deque<List<String>> paths = new ArrayDeque<>();
        paths.push(Arrays.asList("A"));
        while (!paths.isEmpty()) {
            List<String> path = paths.pop();
            String current = path.get(path.size() - 1);
            if ("D".equals(current)) {
                System.out.println(path); // [A, B, D]
                return;
            }
            for (String next : graph.getOrDefault(current, Collections.emptyList())) {
                if (path.contains(next)) continue; // 避免本条路径内成环
                List<String> extended = new ArrayList<>(path);
                extended.add(next);
                paths.push(extended);
            }
        }
    }
}` },
        { t: 'info', text: '**DFS 路径备注**：栈中每项是一条从起点到当前位置的路径；弹出一条后向下一层扩展。示例图很小，为了直观直接复制路径；大图可改用「节点 + 父节点表」以减少复制。若只需判断可达性，可用 visited 集合避免重复访问。' },
        { t: 'code', title: '前进 / 后退与撤销：两个栈', code: `import java.util.*;

public class HistoryExample {
    public static void main(String[] args) {
        Deque<String> back = new ArrayDeque<>();
        Deque<String> forward = new ArrayDeque<>();
        String current = "A";
        back.push(current); current = "B"; forward.clear();
        back.push(current); current = "C"; forward.clear();
        forward.push(current); current = back.pop(); // 后退：到 B
        System.out.println(current); // B
        back.push(current); current = forward.pop(); // 前进：到 C
        System.out.println(current); // C

        Deque<String> undo = new ArrayDeque<>();
        String text = "猫";
        undo.push(text); text = "猫狗"; // 修改前保存旧状态
        text = undo.pop();               // 撤销，恢复最近旧状态
        System.out.println(text); // 猫
    }
}` },
        { t: 'why', items: [
          '浏览器后退时把当前页放进 forward，再从 back 弹出上一页；前进则反过来。访问全新页面要清空 forward，因为原来的前进分支已失效。',
          '撤销栈保存修改前的状态；每次 Undo 弹出最近一次状态。若需要 Redo，再加一个重做栈并在产生新修改时清空它。'
        ] },
        { t: 'code', title: '对称结构：用栈检查回文', code: `import java.util.*;

public class PalindromeStackExample {
    static boolean isPalindrome(String s) {
        Deque<Character> left = new ArrayDeque<>();
        for (int i = 0; i < s.length() / 2; i++) left.push(s.charAt(i));
        for (int i = (s.length() + 1) / 2; i < s.length(); i++) {
            if (left.pop() != s.charAt(i)) return false;
        }
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome("level")); // true
        System.out.println(isPalindrome("lever")); // false
    }
}` },
        { t: 'info', text: '**对称结构备注**：括号和标签是嵌套配对，栈通常是自然选择；回文只需两端比较时，双指针更省空间 O(1)。这里用栈演示左半逆序与右半配对，时间 O(n)、额外空间 O(n)。函数调用也使用系统调用栈，深递归时应留意栈溢出。' },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: 'pop 前没判空', d: '空栈 pop / peek 会抛 NoSuchElementException；取栈顶前一定要先 isEmpty() 判断。' },
          { t: '用 Stack 类', d: '老 Stack 类继承 Vector、方法加锁、性能差；应使用 ArrayDeque 的 push/pop/peek。' },
          { t: '栈的遍历顺序', d: '对 ArrayDeque 使用 push 时，新元素加入队头；增强 for 按从队头到队尾遍历，因此通常是从栈顶到栈底。遍历不会移除元素，要真正出栈仍需 pop。' },
          { t: '单调栈存下标还是值', d: '大多数单调栈题存下标更灵活（能同时拿值、算距离），只存值可能丢失位置信息。' },
          { t: '左右括号配对写反', d: '匹配时注意方向：右括号要和「栈顶的左括号」对应类型一致，别把 ( 和 ] 误配。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '有效的括号', diff: 'easy', note: '栈 + 配对判断' },
          { name: '最小栈', diff: 'medium', note: '辅助栈记录最小值' },
          { name: '每日温度', diff: 'medium', note: '单调栈求间隔天数' },
          { name: '逆波兰表达式求值', diff: 'medium', note: '遇数字入栈，遇运算符弹两个' },
          { name: '柱状图中最大的矩形', diff: 'hard', note: '单调栈进阶' }
        ]}
      ]
    },
    {
      id: 's2',
      title: '2.2 队列',
      short: '队列',
      minutes: 45,
      blocks: [
        { t: 'h', text: '概念：先进先出（FIFO）' },
        { t: 'p', text: '队列是**先进先出**（FIFO）的结构：先进去的元素先出来。一端入队（队尾）、一端出队（队头）。核心操作：offer（入队）、poll（出队）、peek（看队头）。' },
        { t: 'p', text: 'Java 的 Queue 接口用 LinkedList 或 ArrayDeque 实现；ArrayDeque 还实现了 Deque（双端队列），两头都能进出，非常常用。' },
        { t: 'table', head: ['方法', '队列满/空时行为', '说明'], rows: [
          ['add / remove', '抛异常', '不推荐，异常处理麻烦'],
          ['offer / poll', '返回 null / false', '推荐，判空更优雅'],
          ['peek', '空时返回 null', '只看不出队']
        ]},
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          'BFS 广度优先搜索（逐层遍历、最短路径）',
          '生产者 - 消费者模型、消息队列、任务调度',
          '树的层序遍历、图的 BFS',
          '滑动窗口（双端队列维护窗口最值）',
          '缓冲、打印队列等先进先出的场景'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'code', title: '队列基本操作 + 层序遍历', code: `import java.util.*;

public class QueueDemo {
    public static void main(String[] args) {
        Queue<Integer> q = new ArrayDeque<>();
        q.offer(1); q.offer(2); q.offer(3);   // 入队
        System.out.println(q.peek());         // 1，队头
        System.out.println(q.poll());         // 1，出队
        System.out.println(q.poll());         // 2
        System.out.println(q.size());         // 1
        System.out.println(q.isEmpty());      // false
    }
}` },
        { t: 'code', title: '双端队列 Deque：两头都能操作', code: `import java.util.*;

public class DequeDemo {
    public static void main(String[] args) {
        Deque<Integer> dq = new ArrayDeque<>();
        dq.offerFirst(1);   // 头插 -> 1
        dq.offerLast(2);    // 尾插 -> 1 2
        dq.offerFirst(0);   // 头插 -> 0 1 2
        System.out.println(dq.peekFirst()); // 0
        System.out.println(dq.peekLast());  // 2
        System.out.println(dq.pollFirst()); // 0
        System.out.println(dq.pollLast());  // 2
        System.out.println(dq);             // [1]
    }
}` },
        { t: 'info', text: '**思路与复杂度**：Deque 是双端队列，头尾都能插入删除，既能当队列又能当栈。ArrayDeque 用循环数组实现，头尾操作都 O(1)，且比 LinkedList 更省内存、更快。滑动窗口最大值等题就用「单调双端队列」维护窗口最值。' },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: 'poll 与 remove 的区别', d: '空队列时 poll 返回 null，remove 抛 NoSuchElementException；建议统一用 poll 并判空。' },
          { t: 'offer 与 add 的区别', d: '容量受限队列满时 offer 返回 false，add 抛异常。' },
          { t: 'ArrayDeque 不能存 null', d: 'ArrayDeque 禁止放入 null 元素，会抛 NPE；需要存 null 用 LinkedList。' },
          { t: 'poll 返回 null 有歧义', d: '若队列里允许存 null，poll 返回 null 无法区分「空」和「值就是 null」，此时先 isEmpty 判断。' },
          { t: 'LinkedList 当队列性能', d: 'LinkedList 实现 Queue/Deque 功能齐全，但内存开销比 ArrayDeque 大；一般优先 ArrayDeque。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '用栈实现队列', diff: 'easy', note: '两个栈 in/out 倒腾' },
          { name: '用队列实现栈', diff: 'easy', note: '入队后把前面的都搬到后面' },
          { name: '滑动窗口最大值', diff: 'hard', note: '单调双端队列' },
          { name: '二叉树的层序遍历', diff: 'medium', note: 'BFS + 队列，见第 6 章' },
          { name: '完全平方数', diff: 'medium', note: 'BFS 最短路径' }
        ]}
      ]
    },
    {
      id: 's3',
      title: '2.3 哈希表',
      short: '哈希表',
      minutes: 50,
      blocks: [
        { t: 'h', text: '概念：键值映射 + 接近 O(1) 的查找' },
        { t: 'p', text: '哈希表通过**哈希函数**把 key 映射到一个数组下标，实现「按 key 直接定位」。理想情况下插入、删除、查找都接近 **O(1)**。Java 里的 HashMap（无序）、LinkedHashMap（保序）、TreeMap（有序，红黑树）。' },
        { t: 'p', text: '哈希冲突：不同 key 可能算出相同下标。Java 用「链地址法」（同一位置的元素挂成链表/红黑树）解决，HashMap 在 JDK 8 里当某个桶长度超过 8 会转为红黑树。' },
        { t: 'table', head: ['Map 实现', '顺序', '底层', '复杂度'], rows: [
          ['HashMap', '无序', '数组 + 链表/红黑树', '平均 O(1)'],
          ['LinkedHashMap', '插入顺序', 'HashMap + 双向链表', '平均 O(1)'],
          ['TreeMap', '按 key 排序', '红黑树', 'O(log n)']
        ]},
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '快速查找、去重（HashSet）、计数、分组',
          '两数之和、字母异位词分组等「用空间换时间」的题',
          '缓存（LRU 用 LinkedHashMap）、索引、配置项',
          '把「查找某值是否存在」从 O(n) 降到 O(1)'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'code', title: 'HashMap 常用操作', code: `import java.util.*;

public class HashMapDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 3);
        map.put("banana", 5);
        map.put("apple", 8);                    // 覆盖旧值
        System.out.println(map.get("apple"));   // 8
        System.out.println(map.getOrDefault("x", 0)); // 0，不存在给默认值
        System.out.println(map.containsKey("banana")); // true

        // 计数：统计每个字符出现次数
        String s = "hello";
        Map<Character, Integer> cnt = new HashMap<>();
        for (char c : s.toCharArray()) {
            cnt.put(c, cnt.getOrDefault(c, 0) + 1);
        }
        System.out.println(cnt);                // {e=1, h=1, l=2, o=1}

        // 遍历
        for (Map.Entry<Character, Integer> e : cnt.entrySet()) {
            System.out.println(e.getKey() + " -> " + e.getValue());
        }
    }
}` },
        { t: 'p', text: '**案例问题**：给定数组 nums 和目标值 target，找出和为 target 的两个数的下标（假设只有一组答案）。 ' },
        { t: 'code', title: '两数之和：用哈希表把 O(n^2) 降到 O(n)', code: `import java.util.*;

public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>(); // 值 -> 下标
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (map.containsKey(need)) {
                return new int[]{map.get(need), i};
            }
            map.put(nums[i], i);   // 边遍历边存，避免自己配自己
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        int[] r = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(r[0] + " " + r[1]);  // 0 1
    }
}` },
        { t: 'h', text: '案例：字母异位词分组' },
        { t: 'p', text: '**案例问题**：给定一组字符串，把互为字母异位词的串分到同一组。' },
        { t: 'code', title: '字母异位词分组', code: `import java.util.*;

public class GroupAnagrams {
    public static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] arr = s.toCharArray();
            Arrays.sort(arr);                 // 排序后的串作为 key
            String key = new String(arr);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        String[] strs = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println(groupAnagrams(strs));
    }
}` },
        { t: 'why', items: [
          '互为异位词的串，排序后得到的字符串相同，所以用「排序后的串」当 key 分组。',
          'computeIfAbsent(key, k -> new ArrayList<>())：key 不存在就新建列表再往里加，比先 get 判空再 new 更简洁。',
          '返回 new ArrayList<>(map.values())：map 的 values 就是各分组，直接包成 List 返回。',
          '时间 O(n × k log k)（k 是字符串长度），空间 O(n × k)。'
        ] },
        { t: 'why', items: [
          '暴力是两层循环 O(n²)；用 HashMap 存「值 → 下标」，对每个元素只需查一次 target - nums[i]，把查找从 O(n) 降到 O(1)。',
          '边遍历边存而不是先全部存：遇到 [3,3]、target=6 这类同值情况，也能正确返回两个不同下标，且不会用同一个元素两次。',
          '先查后存：如果先 put 再查，当 target = 2 × nums[i] 时会把自己和自己配对。',
          'containsKey 查的是「补数」是否存在，本质是把线性查找变成哈希查找。'
        ] },
        { t: 'info', text: '**思路与复杂度**：核心是「用空间换时间」：遍历时把「值 → 下标」存进 HashMap，对每个元素只需查一次 target - nums[i] 是否存在。时间 O(n)、空间 O(n)。这是哈希表最经典的用途——把查找从 O(n) 降到 O(1)。' },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: 'equals 与 hashCode 契约', d: '两个对象 equals 相等，hashCode 必须相等；重写 equals 必须同时重写 hashCode，否则 HashMap 会出 bug。' },
          { t: '用可变对象当 key', d: 'key 的内容被修改后 hashCode 变了，会找不到原来存的值；尽量用 String、Integer 等不可变对象当 key。' },
          { t: '遍历时删除', d: 'for-each 里 remove 会抛 ConcurrentModificationException；用迭代器 iterator.remove()，或用 removeIf。' },
          { t: 'get 返回 null 的歧义', d: 'get 返回 null 可能是「没有这个 key」，也可能是「value 就是 null」；区分用 containsKey。' },
          { t: 'HashMap 无序', d: '遍历 HashMap 的顺序是不确定的，别依赖它；需要保序用 LinkedHashMap，需要排序用 TreeMap。' },
          { t: 'HashSet 靠 equals/hashCode', d: '自定义类放进 HashSet 去重时，必须正确重写 equals 和 hashCode，否则去重失效。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '两数之和', diff: 'easy', note: '哈希表 O(n)' },
          { name: '字母异位词分组', diff: 'medium', note: '排序后的串当 key' },
          { name: '存在重复元素', diff: 'easy', note: 'HashSet 去重' },
          { name: 'LRU 缓存', diff: 'medium', note: 'LinkedHashMap / HashMap + 双向链表' },
          { name: '最长连续序列', diff: 'medium', note: '哈希表 + 找起点' }
        ]}
      ]
    }
  ],
  quiz: [
    { q: '栈这种数据结构的存取顺序是？', options: ['先进先出 FIFO', '后进先出 LIFO', '随机存取', '按大小排序'], answer: 1, explain: '栈是后进先出（LIFO），最后入栈的最先出栈。' },
    { q: 'Java 中推荐用哪个类来当栈？', options: ['Stack', 'Vector', 'ArrayDeque', 'ArrayList'], answer: 2, explain: 'Stack 继承 Vector、方法加锁性能差；官方推荐用 ArrayDeque 的 push/pop/peek。' },
    { q: 'HashMap 查找一个 key 的平均时间复杂度是？', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 0, explain: '哈希表通过哈希函数直接定位，平均 O(1)，最坏（大量冲突）才退化到 O(n)。' },
    { q: '关于 hashCode 与 equals，正确的是？', options: ['equals 相等 hashCode 必须相等', 'hashCode 相等 equals 必相等', '两者无关', '只要重写 equals 就行'], answer: 0, explain: '契约要求 equals 相等的对象 hashCode 必相等；反过来 hashCode 相等不保证 equals 相等（哈希冲突）。' }
  ],
  exercises: [
    {
      id: 'ex-c2-1',
      title: '练习 1：有效的括号',
      level: '入门',
      brief: '给定只包含 ()[]{} 的字符串 s，判断括号是否有效：左括号必须用同类型的右括号闭合，且闭合顺序正确。',
      requirements: [
        '类名 ValidParentheses，方法 isValid(String s)',
        '用栈（Deque 或 ArrayDeque）处理',
        '左括号入栈，右括号与栈顶匹配，不匹配返回 false',
        'main 测试：()[]{} 返回 true，([)] 返回 false'
      ],
      starter: `import java.util.*;

public class ValidParentheses {
    public boolean isValid(String s) {
        // TODO: 用栈判断括号是否有效
        return false;
    }

    public static void main(String[] args) {
        ValidParentheses v = new ValidParentheses();
        System.out.println(v.isValid("()[]{}")); // true
        System.out.println(v.isValid("([)]"));   // false
    }
}`,
      expectedOutput: 'true\nfalse',
      keyPoints: [
        { label: '使用 Deque / ArrayDeque 栈', test: /Deque|ArrayDeque/ },
        { label: '左括号入栈 push', test: /\.push\(/ },
        { label: '右括号时出栈 pop', test: /\.pop\(/ },
        { label: '判断栈是否为空', test: /isEmpty\(\)/ },
        { label: '匹配左右括号类型', test: /c\s*==\s*'\)'[\s\S]*top\s*!=\s*'\('|top\s*!=\s*'\('[\s\S]*c\s*==\s*'\)'/ }
      ],
      hints: [
        '遍历字符串的每个字符 c',
        '遇到左括号就 push 入栈',
        '遇到右括号：先判空（空则 false），再 pop 栈顶，检查是否与 c 匹配',
        '循环结束后栈必须为空才有效'
      ],
      analysis: '利用栈的后进先出特性：左括号入栈，右括号来时栈顶必须是配对的左括号。遍历结束后栈为空说明全部闭合。时间 O(n)，空间 O(n)。',
      solution: `import java.util.*;

public class ValidParentheses {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == ']' && top != '[') return false;
                if (c == '}' && top != '{') return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        ValidParentheses v = new ValidParentheses();
        System.out.println(v.isValid("()[]{}")); // true
        System.out.println(v.isValid("([)]"));   // false
    }
}`
    },
    {
      id: 'ex-c2-2',
      title: '练习 2：用两个栈实现队列',
      level: '中等',
      brief: '用两个栈实现一个先进先出的队列，支持 push（入队）、pop（出队）、peek（看队头）、empty（判空）。',
      requirements: [
        '类名 MyQueue，用两个 Deque<Integer>（in 和 out）',
        'push 直接压入 in 栈',
        'pop / peek 时若 out 空，把 in 全部倒进 out，再操作 out',
        'main 测试：push 1 2 3，pop 出 1，peek 出 2'
      ],
      starter: `import java.util.*;

public class MyQueue {
    private Deque<Integer> in = new ArrayDeque<>();
    private Deque<Integer> out = new ArrayDeque<>();

    public void push(int x) {
        // TODO: 入队
    }

    public int pop() {
        // TODO: 出队
        return -1;
    }

    public int peek() {
        // TODO: 看队头
        return -1;
    }

    public boolean empty() {
        return false;
    }

    public static void main(String[] args) {
        MyQueue q = new MyQueue();
        q.push(1); q.push(2); q.push(3);
        System.out.println(q.pop());  // 1
        System.out.println(q.peek()); // 2
    }
}`,
      expectedOutput: '1\n2',
      keyPoints: [
        { label: '定义 in 和 out 两个栈', test: /Deque[^\n]*\bin\b[\s\S]*Deque[^\n]*\bout\b|Deque[^\n]*\bout\b[\s\S]*Deque[^\n]*\bin\b/ },
        { label: 'push 方法入栈', test: /void\s+push/ },
        { label: 'pop 时把 in 倒进 out', test: /while\s*\([^)]*!in\.isEmpty\(\)/ },
        { label: '从 out 出队', test: /out\.pop\(\)/ },
        { label: 'empty 判断两个栈', test: /in\.isEmpty\(\)\s*&&\s*out\.isEmpty\(\)/ }
      ],
      hints: [
        'push 直接把 x 压入 in 栈',
        'pop / peek 前，若 out 为空，把 in 的元素全部 pop 出来 push 进 out',
        '这样 out 的栈顶就是队头',
        'empty 需要两个栈都为空'
      ],
      analysis: '两个栈倒腾实现 FIFO：in 栈负责「入队」，out 栈负责「出队」。当 out 空时，把 in 全部倒入 out，顺序就反过来了，栈顶变成最早入队的元素。每个元素最多被搬运一次，均摊 O(1)。',
      solution: `import java.util.*;

public class MyQueue {
    private Deque<Integer> in = new ArrayDeque<>();
    private Deque<Integer> out = new ArrayDeque<>();

    public void push(int x) {
        in.push(x);
    }

    public int pop() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
        return out.pop();
    }

    public int peek() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
        return out.peek();
    }

    public boolean empty() {
        return in.isEmpty() && out.isEmpty();
    }

    public static void main(String[] args) {
        MyQueue q = new MyQueue();
        q.push(1); q.push(2); q.push(3);
        System.out.println(q.pop());  // 1
        System.out.println(q.peek()); // 2
    }
}`
    },
    {
      id: 'ex-c2-3',
      title: '练习 3：两数之和',
      level: '入门',
      brief: '给定整数数组 nums 和目标值 target，找出和为 target 的两个数的下标，假设只有一组答案。',
      requirements: [
        '类名 TwoSum，方法 twoSum(int[] nums, int target)',
        '用 HashMap 把查找降到 O(n)',
        '边遍历边存，避免同一个元素用两次',
        'main 测试：nums={2,7,11,15}, target=9 应输出 0 1'
      ],
      starter: `import java.util.*;

public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        // TODO: 用哈希表 O(n) 找出两数之和
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        TwoSum t = new TwoSum();
        int[] r = t.twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(r[0] + " " + r[1]); // 0 1
    }
}`,
      expectedOutput: '0 1',
      keyPoints: [
        { label: '使用 Map / HashMap', test: /Map\s*<|HashMap/ },
        { label: '计算差值 target - nums[i]', test: /target\s*-\s*nums\[/ },
        { label: '用 containsKey 判断', test: /containsKey\(/ },
        { label: '用 put 存储值到下标', test: /\.put\(/ },
        { label: '返回下标数组', test: /return\s+new\s+int\[\]/ }
      ],
      hints: [
        'Map<Integer, Integer> 存「值 -> 下标」',
        '对每个 nums[i]，算 need = target - nums[i]',
        '若 need 在 map 里，返回 map.get(need) 和 i',
        '否则把 nums[i] 和 i 存入 map'
      ],
      analysis: '暴力是两层循环 O(n^2)。用哈希表记录「已遍历过的值及其下标」，对每个元素只需查一次 target - nums[i] 是否存在，整体 O(n)。边遍历边存还能避免自己和自己配对。',
      solution: `import java.util.*;

public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (map.containsKey(need)) {
                return new int[]{map.get(need), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        TwoSum t = new TwoSum();
        int[] r = t.twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(r[0] + " " + r[1]); // 0 1
    }
}`
    }
  ]
});
