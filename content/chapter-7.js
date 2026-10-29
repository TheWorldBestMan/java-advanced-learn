/* 第 7 章 · 堆、贪心 */
window.COURSE = window.COURSE || [];
window.COURSE.push({
  id: 'c7',
  title: '堆、贪心',
  minutes: 140,
  tags: ['堆', '优先队列', 'Top K', '贪心', '区间调度'],
  goals: [
    '理解堆（完全二叉树）与大顶堆 / 小顶堆的语义',
    '会用 PriorityQueue 解决 Top K、合并有序链表等问题',
    '理解贪心「局部最优推全局最优」的思想',
    '掌握区间调度、跳跃游戏、分发饼干等经典贪心题'
  ],
  interview: [
    { q: '什么是堆？大顶堆和小顶堆的区别？', a: '堆是**完全二叉树**，满足堆序：小顶堆每个节点 <= 子节点（堆顶最小），大顶堆每个节点 >= 子节点（堆顶最大）。堆顶是最值，取堆顶 O(1)，插入/删除堆顶 O(log n)。' },
    { q: 'PriorityQueue 默认是什么堆？Top K 问题怎么做？', a: '默认**小顶堆**。求第 K 大：维护大小为 K 的小顶堆，堆里始终是最大的 K 个数，堆顶即第 K 大；求第 K 小用大顶堆。时间 O(n log K)。' },
    { q: '堆排序的思路和复杂度？', a: '建堆 + 反复取堆顶（与末尾交换再下沉）。原地、**O(n log n)**、不稳定。相比快排常数更大，但最坏也 O(n log n)，且空间 O(1)。' },
    { q: '贪心算法一定能得到全局最优吗？', a: '不一定。贪心每步取局部最优，只有问题满足**贪心选择性质 + 最优子结构**时才正确。拿不准要举反例验证，否则用动态规划兜底。' }
  ],
  sections: [
    {
      id: 's1',
      title: '7.1 堆',
      short: '堆',
      minutes: 55,
      blocks: [
        { t: 'h', text: '概念：完全二叉树 + 堆序' },
        { t: 'p', text: '堆是一棵**完全二叉树**，且满足堆序：小顶堆的每个节点都 <= 其子节点（堆顶最小），大顶堆每个节点都 >= 子节点（堆顶最大）。堆顶（最值）可以在 O(1) 取到，插入、删除堆顶是 O(log n)。' },
        { t: 'p', text: 'Java 的 **PriorityQueue** 默认是**小顶堆**；想要大顶堆，传入自定义比较器（如 (a, b) -> b - a）。' },
        { t: 'code', title: 'PriorityQueue 基本操作', code: `import java.util.*;

public class HeapDemo {
    public static void main(String[] args) {
        // 默认小顶堆
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(5); minHeap.offer(2); minHeap.offer(8); minHeap.offer(1);
        System.out.println(minHeap.peek()); // 1，堆顶最小
        System.out.println(minHeap.poll()); // 1
        System.out.println(minHeap.poll()); // 2

        // 大顶堆：自定义比较器
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
        maxHeap.offer(5); maxHeap.offer(2); maxHeap.offer(8);
        System.out.println(maxHeap.poll()); // 8，堆顶最大
    }
}` },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          'Top K：第 K 大 / 第 K 小、前 K 个高频元素',
          '优先队列：任务调度、事件驱动',
          '堆排序（原地，O(n log n)）',
          '合并 K 个有序链表、数据流中位数',
          'Dijkstra 最短路径的优化（优先队列取最近节点）'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'p', text: '**案例问题**：给定数组和整数 k，返回第 k 个最大的元素（不排序整个数组，用大小为 k 的堆）。 ' },
        { t: 'code', title: 'Top K：数组中的第 K 个最大元素', code: `import java.util.*;

public class TopK {
    public static int findKthLargest(int[] nums, int k) {
        // 维护一个大小为 k 的小顶堆，堆顶即第 k 大
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int x : nums) {
            minHeap.offer(x);
            if (minHeap.size() > k) minHeap.poll(); // 弹出最小的
        }
        return minHeap.peek();
    }

    public static void main(String[] args) {
        System.out.println(findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2)); // 5
        System.out.println(findKthLargest(new int[]{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4)); // 4
    }
}` },
        { t: 'h', text: '案例：前 K 个高频元素' },
        { t: 'p', text: '**案例问题**：给定数组和 k，返回出现频率最高的 k 个元素。' },
        { t: 'code', title: '前 K 个高频元素', code: `import java.util.*;

public class TopKFrequent {
    public static int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : nums) cnt.put(x, cnt.getOrDefault(x, 0) + 1);
        // 小顶堆按「频率」排序，堆里保留频率最高的 k 个
        PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> cnt.get(a) - cnt.get(b));
        for (int x : cnt.keySet()) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();
        }
        int[] res = new int[k];
        for (int i = 0; i < k; i++) res[i] = heap.poll();
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(topKFrequent(new int[]{1,1,1,2,2,3}, 2)));
    }
}` },
        { t: 'why', items: [
          '先用 HashMap 统计每个元素的频率，这是「计数」的标准做法。',
          '小顶堆按频率排序：比较器 (a, b) -> cnt.get(a) - cnt.get(b)，让频率最小的在堆顶，方便弹出。',
          '堆里始终保留频率最高的 k 个，超过 k 就弹掉频率最小的。',
          '最后把堆里的 k 个元素逐个 poll 出来（顺序从小到大，题目通常不要求顺序）。'
        ] },
        { t: 'why', items: [
          '维护大小为 k 的小顶堆，堆里始终是「当前看到的最大的 k 个数」，堆顶是这 k 个里最小的，即全局第 k 大。',
          '为什么用小顶堆而不是大顶堆：小顶堆堆顶最小、最容易弹掉，每次把更小的数弹出去，保留大的 k 个。',
          'if (heap.size() > k) heap.poll()：堆超过 k 就弹出最小，保证堆大小始终为 k。',
          '最后 return heap.peek()：堆顶就是第 k 大。时间 O(n log k)，比全排序 O(n log n) 更优（k 小时）。'
        ] },
        { t: 'info', text: '**思路与复杂度**：维护大小为 K 的小顶堆，堆里始终是「当前最大的 K 个数」，堆顶即第 K 大。每个元素进出堆 O(log K)，总 O(n log K)，K 很小时优于全排序 O(n log n)。求第 K 小则改用大顶堆。' },
        { t: 'tip', text: '求「第 K 大」用大小为 K 的**小顶堆**（堆顶是第 K 大）；求「第 K 小」用大小为 K 的**大顶堆**。堆大小超过 K 就弹堆顶，最后堆顶就是答案。时间 O(n log k)，比全排序 O(n log n) 更优（k 小时）。' },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '默认是小顶堆', d: 'PriorityQueue 默认最小在堆顶；要最大堆必须传比较器 (a, b) -> b - a。' },
          { t: '第 K 大用大顶堆还是小顶堆', d: '第 K 大用「小顶堆」（堆里保留最大的 K 个，堆顶是这 K 个里最小的，即第 K 大），别弄反。' },
          { t: '比较器溢出', d: 'b - a 可能溢出，稳妥写法用 Integer.compare(b, a) 或 Comparator.reverseOrder()。' },
          { t: 'peek 前判空', d: '空堆 peek / poll 返回 null（或抛异常），先判 isEmpty。' },
          { t: '堆不等于有序', d: 'PriorityQueue 只有堆顶是最值，整体不是有序的；想有序遍历要么不断 poll，要么用排序。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '数组中的第 K 个最大元素', diff: 'medium', note: '大小为 K 的小顶堆' },
          { name: '前 K 个高频元素', diff: 'medium', note: '哈希计数 + 小顶堆' },
          { name: '合并 K 个有序链表', diff: 'hard', note: '小顶堆每次取最小头' },
          { name: '数据流的中位数', diff: 'hard', note: '大顶堆 + 小顶堆' },
          { name: '最后一块石头的重量', diff: 'easy', note: '大顶堆' }
        ]}
      ]
    },
    {
      id: 's2',
      title: '7.2 贪心',
      short: '贪心',
      minutes: 50,
      blocks: [
        { t: 'h', text: '概念：每一步都取局部最优' },
        { t: 'p', text: '贪心算法在每一步都做出**当前看起来最好**的选择，期望这些局部最优最终拼成全局最优。贪心不是万能的，只在问题满足「贪心选择性质」和「最优子结构」时正确；但它一旦适用，往往非常简洁高效。' },
        { t: 'code', title: '分发饼干（贪心）', code: `import java.util.*;

public class FindContentChildren {
    public static int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);   // 孩子胃口
        Arrays.sort(s);   // 饼干大小
        int i = 0, j = 0;
        while (i < g.length && j < s.length) {
            if (s[j] >= g[i]) i++;   // 这块饼干能满足当前孩子
            j++;                     // 饼干无论能否满足都要换下一块
        }
        return i;                    // 满足的孩子数
    }

    public static void main(String[] args) {
        System.out.println(findContentChildren(new int[]{1, 2, 3}, new int[]{1, 1})); // 1
        System.out.println(findContentChildren(new int[]{1, 2}, new int[]{1, 2, 3})); // 2
    }
}` },
        { t: 'code', title: '无重叠区间（区间调度）', code: `import java.util.*;

public class EraseOverlap {
    public static int eraseOverlapIntervals(int[][] intervals) {
        // 按结束时间排序，贪心保留结束最早的区间
        Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
        int end = intervals[0][1], count = 0;
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < end) count++;  // 重叠，删掉当前区间
            else end = intervals[i][1];          // 不重叠，更新结束时间
        }
        return count;
    }

    public static void main(String[] args) {
        int[][] a = {{1, 2}, {2, 3}, {3, 4}, {1, 3}};
        System.out.println(eraseOverlapIntervals(a)); // 1
    }
}` },
        { t: 'p', text: '**案例问题**：给定非负数组，nums[i] 表示在位置 i 最多能跳多远，判断能否从下标 0 跳到最后一个下标。 ' },
        { t: 'code', title: '跳跃游戏（维护最远可达）', code: `public class CanJump {
    public static boolean canJump(int[] nums) {
        int maxReach = 0;                    // 最远能到哪
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;  // 当前位置都到不了
            maxReach = Math.max(maxReach, i + nums[i]);
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(canJump(new int[]{2, 3, 1, 1, 4})); // true
        System.out.println(canJump(new int[]{3, 2, 1, 0, 4})); // false
    }
}` },
        { t: 'why', items: [
          '维护 maxReach = 当前能到达的最远下标，逐格扫描并更新。',
          'if (i > maxReach) return false：当前格子都到不了，更不可能到终点。',
          'maxReach = max(maxReach, i + nums[i])：从位置 i 最远能跳到 i + nums[i]，取历史最大值。',
          '能走完整个循环说明每个格子都可达，返回 true。贪心 O(n)、O(1)。'
        ] },
        { t: 'info', text: '**思路与复杂度**：贪心维护「当前能到达的最远下标」maxReach：遍历时若 i > maxReach 说明到不了返回 false，否则用 i + nums[i] 更新最远距离。时间 O(n)、空间 O(1)。贪心的关键是想清楚「局部最优能否推出全局最优」。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '区间调度：最多不重叠区间、用最少数量的箭、会议室',
          '资源分配：分发饼干、分糖果、找零钱',
          '跳跃游戏、买卖股票（一次/多次交易）',
          '哈夫曼编码、Prim / Kruskal 最小生成树（也是贪心）'
        ]},
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '贪心不是万能', d: '贪心只在满足贪心选择性质时正确；拿不准就举反例验证，或用动态规划（见第 8 章）兜底。' },
          { t: '排序字段选错', d: '区间调度按「结束时间」排序（不是开始时间），选错贪心策略会得错答案。' },
          { t: '忘了先排序', d: '很多贪心依赖有序（分发饼干、区间），不排序直接贪心是错的。' },
          { t: '边界条件', d: '区间是否重叠要看 < 还是 <=（端点相接算不算重叠），题目约定要看清。' },
          { t: '跳跃游戏维护的是最远', d: '每一步更新 maxReach = max(maxReach, i + nums[i])，不是只看当前跳跃长度。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '分发饼干', diff: 'easy', note: '排序 + 双指针' },
          { name: '无重叠区间', diff: 'medium', note: '按结束时间排序' },
          { name: '跳跃游戏', diff: 'medium', note: '维护最远可达' },
          { name: '买卖股票的最佳时机 II', diff: 'medium', note: '累加所有上涨段' },
          { name: '用最少数量的箭引爆气球', diff: 'medium', note: '区间调度变体' }
        ]}
      ]
    }
  ],
  quiz: [
    { q: 'Java 的 PriorityQueue 默认是？', options: ['大顶堆', '小顶堆', '斐波那契堆', '二叉搜索树'], answer: 1, explain: 'PriorityQueue 默认小顶堆（堆顶最小），要大顶堆需传比较器。' },
    { q: '求数组中第 K 个最大元素，用大小为 K 的什么堆？', options: ['大顶堆', '小顶堆', '斐波那契堆', '不用堆'], answer: 1, explain: '维护大小为 K 的小顶堆，堆里始终是最大的 K 个，堆顶就是第 K 大。' },
    { q: '贪心算法每一步的选择是？', options: ['全局最优', '当前局部最优', '随机选择', '回溯试探'], answer: 1, explain: '贪心每步取当前看起来最好的（局部最优），期望拼出全局最优。' },
    { q: '「无重叠区间」这类区间调度问题，通常按什么排序？', options: ['区间开始时间', '区间结束时间', '区间长度', '不排序'], answer: 1, explain: '按结束时间排序，优先保留结束早的区间，才能给后面留最多空间。' }
  ],
  exercises: [
    {
      id: 'ex-c7-1',
      title: '练习 1：第 K 个最大元素（堆）',
      level: '中等',
      brief: '给定整数数组 nums 和整数 k，用大小为 k 的小顶堆返回第 k 个最大的元素。',
      requirements: [
        '类名 KthLargest，方法 findKthLargest(int[] nums, int k)',
        '用 PriorityQueue 小顶堆，大小保持 k',
        '堆大小超过 k 就 poll',
        'main 测试 {3,2,1,5,6,4}, k=2 返回 5'
      ],
      starter: `import java.util.*;

public class KthLargest {
    public int findKthLargest(int[] nums, int k) {
        // TODO: 用大小为 k 的小顶堆
        return 0;
    }

    public static void main(String[] args) {
        KthLargest k = new KthLargest();
        System.out.println(k.findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2)); // 5
    }
}`,
      expectedOutput: '5',
      keyPoints: [
        { label: '使用 PriorityQueue', test: /PriorityQueue/ },
        { label: 'offer 入堆', test: /\.offer\(/ },
        { label: '堆大小超过 k 就 poll', test: /size\(\)\s*>\s*k/ },
        { label: '返回堆顶 peek', test: /\.peek\(\)/ },
        { label: 'poll 弹出堆顶', test: /\.poll\(\)/ }
      ],
      hints: [
        'PriorityQueue<Integer> heap = new PriorityQueue<>()（默认小顶堆）',
        '遍历 nums：heap.offer(x)',
        '若 heap.size() > k，heap.poll() 弹出最小的',
        '最后 return heap.peek()'
      ],
      analysis: '维护大小为 k 的小顶堆：堆里始终保存「当前看到的最大的 k 个数」，堆顶是这 k 个数里最小的，即全局第 k 大。每个元素进出堆一次，时间 O(n log k)，空间 O(k)。',
      solution: `import java.util.*;

public class KthLargest {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int x : nums) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();
        }
        return heap.peek();
    }

    public static void main(String[] args) {
        KthLargest k = new KthLargest();
        System.out.println(k.findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2)); // 5
    }
}`
    },
    {
      id: 'ex-c7-2',
      title: '练习 2：分发饼干',
      level: '入门',
      brief: '每个孩子有一个胃口值 g[i]，每块饼干有大小 s[j]。一块饼干只能分给一个孩子，且 s[j] >= g[i] 才能满足。求最多能满足多少个孩子。',
      requirements: [
        '类名 FindContentChildren，方法 findContentChildren(int[] g, int[] s)',
        '先排序 g 和 s，再用双指针',
        '饼干能满足孩子就 i++，饼干指针 j 始终后移',
        'main 测试返回最多满足数'
      ],
      starter: `import java.util.*;

public class FindContentChildren {
    public int findContentChildren(int[] g, int[] s) {
        // TODO: 贪心 + 双指针
        return 0;
    }

    public static void main(String[] args) {
        FindContentChildren f = new FindContentChildren();
        System.out.println(f.findContentChildren(new int[]{1, 2, 3}, new int[]{1, 1})); // 1
        System.out.println(f.findContentChildren(new int[]{1, 2}, new int[]{1, 2, 3})); // 2
    }
}`,
      expectedOutput: '1\n2',
      keyPoints: [
        { label: '排序 g 和 s', test: /Arrays\.sort/ },
        { label: '用 while 循环双指针', test: /while\s*\(/ },
        { label: '比较 s[j] >= g[i]', test: /s\[j\]\s*>=\s*g\[i\]/ },
        { label: '满足则 i++', test: /i\+\+/ },
        { label: '饼干指针 j++', test: /j\+\+/ }
      ],
      hints: [
        'Arrays.sort(g) 和 Arrays.sort(s)',
        '双指针 i（孩子）、j（饼干）',
        'while 循环：若 s[j] >= g[i] 则 i++；无论是否满足 j++',
        '返回 i（已满足的孩子数）'
      ],
      analysis: '贪心思想：用小饼干先满足胃口小的孩子。排序后双指针扫描，饼干能满足当前最小胃口的孩子就分配，不能就换更大的饼干。时间 O(n log n)（排序主导），空间 O(1)。',
      solution: `import java.util.*;

public class FindContentChildren {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int i = 0, j = 0;
        while (i < g.length && j < s.length) {
            if (s[j] >= g[i]) i++;
            j++;
        }
        return i;
    }

    public static void main(String[] args) {
        FindContentChildren f = new FindContentChildren();
        System.out.println(f.findContentChildren(new int[]{1, 2, 3}, new int[]{1, 1})); // 1
        System.out.println(f.findContentChildren(new int[]{1, 2}, new int[]{1, 2, 3})); // 2
    }
}`
    },
    {
      id: 'ex-c7-3',
      title: '练习 3：跳跃游戏',
      level: '中等',
      brief: '给定非负整数数组 nums，nums[i] 表示在位置 i 最多能跳多远。判断能否从下标 0 跳到最后一个下标。',
      requirements: [
        '类名 CanJump，方法 canJump(int[] nums)',
        '维护最远可达距离 maxReach',
        '若 i > maxReach 说明到不了，返回 false',
        'main 测试 {2,3,1,1,4} 返回 true，{3,2,1,0,4} 返回 false'
      ],
      starter: `public class CanJump {
    public boolean canJump(int[] nums) {
        // TODO: 维护最远可达距离
        return false;
    }

    public static void main(String[] args) {
        CanJump c = new CanJump();
        System.out.println(c.canJump(new int[]{2, 3, 1, 1, 4})); // true
        System.out.println(c.canJump(new int[]{3, 2, 1, 0, 4})); // false
    }
}`,
      expectedOutput: 'true\nfalse',
      keyPoints: [
        { label: '维护最远距离 maxReach', test: /maxReach/ },
        { label: 'for 循环遍历', test: /for\s*\(/ },
        { label: '判断 i > maxReach', test: /i\s*>\s*maxReach/ },
        { label: '更新 maxReach = max(maxReach, i + nums[i])', test: /Math\.max\s*\(maxReach\s*,\s*i\s*\+\s*nums\[i\]\)/ }
      ],
      hints: [
        'int maxReach = 0',
        'for 遍历：若 i > maxReach 返回 false',
        'maxReach = Math.max(maxReach, i + nums[i])',
        '能走完循环就返回 true'
      ],
      analysis: '贪心维护「当前能到达的最远下标」maxReach。每到一个位置，如果能到（i <= maxReach），就用 i + nums[i] 更新最远距离；若某位置超过了最远距离，说明永远到不了。时间 O(n)，空间 O(1)。',
      solution: `public class CanJump {
    public boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
        }
        return true;
    }

    public static void main(String[] args) {
        CanJump c = new CanJump();
        System.out.println(c.canJump(new int[]{2, 3, 1, 1, 4})); // true
        System.out.println(c.canJump(new int[]{3, 2, 1, 0, 4})); // false
    }
}`
    }
  ]
});
