/* 第 3 章 · 双指针、滑动窗口、前缀和 */
window.COURSE = window.COURSE || [];
window.COURSE.push({
  id: 'c3',
  title: '双指针、滑动窗口、前缀和',
  minutes: 170,
  tags: ['双指针', '滑动窗口', '前缀和', '区间和'],
  goals: [
    '掌握相向双指针与快慢指针的写法与适用条件',
    '理解滑动窗口「右扩左缩」的模板，会解决子串/子数组问题',
    '掌握前缀和求区间和，会用前缀和 + 哈希解决子数组和为 K',
    '能区分三种技巧各自适用的问题类型'
  ],
  interview: [
    { q: '双指针一般解决什么问题？时间复杂度？', a: '用两个指针协同遍历，把暴力 O(n²) 降到 **O(n)**。典型：有序数组两数之和（相向指针）、移除元素/移动零（快慢指针）、链表找环/中点（快慢指针）。关键是「指针怎么移动」要能排除无效解。' },
    { q: '滑动窗口的核心思想？和双指针什么关系？', a: '滑动窗口维护连续区间 [left, right]，right 右扩纳入元素、left 右缩移出元素，本质是**同向双指针**。常用于求满足条件的最长/最短子串、子数组，复杂度 O(n)。区别在于滑动窗口强调「维护窗口内的状态」。' },
    { q: '前缀和解决什么问题？原理？', a: '预处理 pre[i] = 前 i 个元素之和，之后任意区间 [l, r] 的和 = pre[r+1] - pre[l]，**O(1) 查询**。配合哈希还能统计「和为 K 的子数组个数」（pre 相减 = K）。' },
    { q: '为什么「和为 K 的子数组」不能用滑动窗口？', a: '滑动窗口要求「窗口扩大，和单调递增」，只适用**元素非负**。元素有负数时窗口扩大和可能变小，无法用单调性收缩，必须用**前缀和 + 哈希**。' }
  ],
  sections: [
    {
      id: 's1',
      title: '3.1 双指针',
      short: '双指针',
      minutes: 55,
      blocks: [
        { t: 'h', text: '概念：两个指针协同遍历' },
        { t: 'p', text: '双指针用**两个下标（或引用）**在数组 / 链表上协同移动，把一个 O(n^2) 的暴力遍历降到 O(n)。常见两种：**相向双指针**（一头一尾向中间靠）和**快慢指针**（一快一慢，多用于链表或原地修改）。' },
        { t: 'table', head: ['类型', '写法', '典型应用'], rows: [
          ['相向双指针', 'i 从头、j 从尾，向中间靠', '有序数组两数之和、盛水、三数之和'],
          ['快慢指针', 'slow 慢、fast 快', '链表找环 / 中点、原地移除元素'],
          ['同向双指针', '两个都向右，维护区间', '滑动窗口（见 3.2）']
        ]},
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '有序数组里找满足条件的两个数（两数之和 II）',
          '原地修改数组：移动零、移除元素、去重',
          '链表找环、找中点、倒数第 N 个',
          '盛最多水的容器、三数之和等需要枚举两端的问题'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'p', text: '**案例问题**：给定升序数组 nums 和目标值 target，找和为 target 的两个数，返回下标（从 1 开始）。 ' },
        { t: 'code', title: '相向双指针：有序数组两数之和', code: `public class TwoSumII {
    public static int[] twoSum(int[] nums, int target) {
        int i = 0, j = nums.length - 1;
        while (i < j) {
            int sum = nums[i] + nums[j];
            if (sum == target) return new int[]{i + 1, j + 1};
            else if (sum < target) i++;   // 和太小，左指针右移
            else j--;                      // 和太大，右指针左移
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        int[] r = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(r[0] + " " + r[1]); // 1 2
    }
}` },
        { t: 'why', items: [
          '利用有序性：i 指向最小、j 指向最大，两数和偏小只能 i++（让和大一点），偏大只能 j--（让小一点），移动方向是确定的。',
          '每次比较都能排除一个元素：sum < target 时 nums[i] 与 j 左侧任意元素的和都更小，所以是 O(n) 而非 O(n²)。',
          '循环条件 i < j：两个数下标不能相同，i、j 相遇即结束。',
          '返回 i+1、j+1：数组下标从 0 开始，题目要求从 1 开始，所以要加一。'
        ] },
        { t: 'info', text: '**思路与复杂度**：利用有序性：两数和偏小则左指针右移增大和，偏大则右指针左移减小和，每次排除一个元素。时间 O(n)、空间 O(1)。无序数组不能这么做（要先排序或改用哈希表）。' },
        { t: 'code', title: '快慢指针：原地移除元素', code: `public class RemoveElement {
    public static int removeElement(int[] nums, int val) {
        int slow = 0;
        for (int fast = 0; fast < nums.length; fast++) {
            if (nums[fast] != val) {
                nums[slow] = nums[fast];   // 把保留的元素搬到前面
                slow++;
            }
        }
        return slow;                        // 新数组的长度
    }

    public static void main(String[] args) {
        int[] nums = {3, 2, 2, 3};
        int len = removeElement(nums, 3);
        for (int i = 0; i < len; i++) System.out.print(nums[i] + " ");
        // 2 2
    }
}` },
        { t: 'h', text: '案例：盛最多水的容器' },
        { t: 'p', text: '**案例问题**：给定数组表示每根柱子的高度，选两根柱子围成容器，求能装水的最大面积。' },
        { t: 'code', title: '盛最多水的容器', code: `public class MaxArea {
    public static int maxArea(int[] height) {
        int i = 0, j = height.length - 1, max = 0;
        while (i < j) {
            int area = Math.min(height[i], height[j]) * (j - i);
            max = Math.max(max, area);
            if (height[i] < height[j]) i++;  // 矮的一边内移
            else j--;
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7})); // 49
    }
}` },
        { t: 'why', items: [
          '面积由「较矮的柱子」决定（min(height[i], height[j]) × 宽度），想变大必须移动矮的那边。',
          '每次内移矮的一边：移动高的那边，min 不会变大、宽度还变小，面积一定不增，没有意义。',
          '宽度 j - i 随移动变小，所以面积能变大的唯一希望是让 min 变大，即移动矮的那边。',
          '相向双指针 O(n)、O(1)，是双指针 + 贪心结合的经典题。'
        ] },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '双指针的前提是有序', d: '相向双指针能「根据和的大小决定移动哪边」，依赖数组有序；无序数组应先用哈希表（两数之和）或先排序。' },
          { t: '循环条件写错', d: '相向双指针条件是 i < j（相遇即停）；写成 i <= j 可能越界或多算一次。' },
          { t: '指针移动方向搞反', d: '和太小要 i++（让和大一点），和太大要 j--（让小一点）；方向反了会死循环或漏解。' },
          { t: '重复元素处理', d: '三数之和等题里要跳过重复元素（去重），否则结果集里会有重复答案。' },
          { t: '快慢指针的边界', d: '链表快慢指针里 fast 走两步，循环要同时判 fast != null 和 fast.next != null。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '两数之和 II - 输入有序数组', diff: 'medium', note: '相向双指针' },
          { name: '移动零', diff: 'easy', note: '快慢指针 / 交换' },
          { name: '盛最多水的容器', diff: 'medium', note: '相向双指针贪心' },
          { name: '三数之和', diff: 'medium', note: '排序 + 双指针 + 去重' },
          { name: '环形链表 II', diff: 'medium', note: '快慢指针找环入口' }
        ]}
      ]
    },
    {
      id: 's2',
      title: '3.2 滑动窗口',
      short: '滑动窗口',
      minutes: 55,
      blocks: [
        { t: 'h', text: '概念：右扩左缩的可变窗口' },
        { t: 'p', text: '滑动窗口维护数组 / 字符串上的一个**连续区间** [left, right]。right 不断右扩把元素纳入窗口，当窗口不满足条件时 left 右缩把元素移出。它把「枚举所有子串 / 子数组」从 O(n^2) 优化到 O(n)。' },
        { t: 'code', title: '滑动窗口通用模板', code: `int left = 0;
for (int right = 0; right < s.length(); right++) {
    // 1. 把 s[right] 加入窗口（更新计数 / 哈希）
    add(s.charAt(right));

    // 2. 当窗口不满足条件时，收缩左边界
    while (窗口不满足条件) {
        remove(s.charAt(left));
        left++;
    }

    // 3. 更新答案（此时窗口是合法的）
    ans = Math.max(ans, right - left + 1);
}` },
        { t: 'tip', text: '「求最长」用 while 收缩到合法后更新答案；「求最短」则收缩到不合法前更新。关键是想清楚窗口合法的条件，以及何时更新答案。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '求最长 / 最短的满足条件的子串或子数组',
          '无重复字符的最长子串、长度最小的子数组',
          '找到字符串中所有字母异位词、最小覆盖子串',
          '固定窗口大小的题目（窗口长度固定，更简单）'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'p', text: '**案例问题**：给定字符串 s，求不含重复字符的最长子串的长度。 ' },
        { t: 'code', title: '无重复字符的最长子串', code: `import java.util.*;

public class LongestSubstring {
    public static int lengthOfLongestSubstring(String s) {
        Set<Character> set = new HashSet<>();
        int left = 0, max = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            while (set.contains(c)) {        // 出现重复，收缩窗口
                set.remove(s.charAt(left));
                left++;
            }
            set.add(c);
            max = Math.max(max, right - left + 1);
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // 3
        System.out.println(lengthOfLongestSubstring("bbbbb"));    // 1
    }
}` },
        { t: 'why', items: [
          '用滑动窗口 [left, right] 维护「当前不含重复字符」的区间：right 右扩纳入字符，出现重复就右移 left 收缩。',
          '用 HashSet 记录窗口内字符，contains 判重复，收缩时 remove 移出字符，保证集合与窗口同步。',
          '收缩用 while 循环：可能连续移除多个字符才能去掉重复的那个，只移一次不够。',
          'max 在窗口合法后才更新，长度 right - left + 1，别漏掉 +1。'
        ] },
        { t: 'info', text: '**思路与复杂度**：窗口 [left, right] 维护「不含重复字符」的区间：right 每走一步加入字符，出现重复就不断右移 left 直到窗口再次合法。left、right 都只向右移动、各走一遍，总 O(n)、空间 O(字符集大小)。' },
        { t: 'code', title: '长度最小的子数组（和 >= target）', code: `public class MinSubarray {
    public static int minSubArrayLen(int target, int[] nums) {
        int left = 0, sum = 0, min = Integer.MAX_VALUE;
        for (int right = 0; right < nums.length; right++) {
            sum += nums[right];
            while (sum >= target) {          // 满足条件，尽量收缩求最短
                min = Math.min(min, right - left + 1);
                sum -= nums[left];
                left++;
            }
        }
        return min == Integer.MAX_VALUE ? 0 : min;
    }

    public static void main(String[] args) {
        System.out.println(minSubArrayLen(7, new int[]{2,3,1,2,4,3})); // 2
    }
}` },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '收缩时机不对', d: '求最长：while 收缩到合法；求最短：while 满足时更新答案并收缩。两者方向相反，别写混。' },
          { t: '忘记在收缩时更新状态', d: '移出窗口的元素要同步从哈希 / 计数里删掉，否则状态残留，窗口判断出错。' },
          { t: '答案更新位置', d: '答案要在「窗口合法」时更新，放错位置会漏掉边界情况（比如整个串都合法）。' },
          { t: '窗口长度计算', d: '长度是 right - left + 1，别漏掉 +1。' },
          { t: '用 HashSet 只能判存在', d: 'HashSet 不能计数，遇到「每个字符出现次数」的题要用 HashMap 或计数数组。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '无重复字符的最长子串', diff: 'medium', note: '滑动窗口 + 哈希' },
          { name: '长度最小的子数组', diff: 'medium', note: '窗口和 >= target' },
          { name: '找到字符串中所有字母异位词', diff: 'medium', note: '定长窗口 + 计数' },
          { name: '最小覆盖子串', diff: 'hard', note: '滑动窗口进阶' },
          { name: '替换后的最长重复字符', diff: 'medium', note: '窗口内允许替换 K 次' }
        ]}
      ]
    },
    {
      id: 's3',
      title: '3.3 前缀和',
      short: '前缀和',
      minutes: 45,
      blocks: [
        { t: 'h', text: '概念：预处理出区间和' },
        { t: 'p', text: '前缀和数组 pre[i] 表示原数组**前 i 个元素之和**（pre[0] = 0）。有了它，任意区间 [l, r] 的和可以 O(1) 求出：sum = pre[r+1] - pre[l]。适合「多次查询区间和」的场景。' },
        { t: 'code', title: '前缀和：区间和 O(1) 查询', code: `public class PrefixSum {
    public static void main(String[] args) {
        int[] nums = {1, 3, 5, 2, 4};
        int n = nums.length;

        // pre[i] = nums[0..i-1] 之和，长度 n+1
        int[] pre = new int[n + 1];
        for (int i = 0; i < n; i++) {
            pre[i + 1] = pre[i] + nums[i];
        }
        System.out.println(Arrays.toString(pre)); // [0,1,4,9,11,15]

        // 区间 [2,4] 的和 = pre[5] - pre[2] = 15 - 4 = 11
        int l = 2, r = 4;
        System.out.println(pre[r + 1] - pre[l]);   // 11
    }
}` },
        { t: 'p', text: '二维前缀和同理：pre[i][j] 表示左上角 (0,0) 到 (i-1,j-1) 的矩形和，可 O(1) 求任意子矩阵和，常用于矩阵区域和、二维差分。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '多次查询数组区间和（区域和检索）',
          '子数组和为 K、和可被 K 整除（前缀和 + 哈希）',
          '二维矩阵的区域和查询',
          '差分数组的配套（区间增减后求最终值）'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'p', text: '**案例问题**：给定整数数组（可能含负数）和 k，统计和为 k 的连续子数组个数。 ' },
        { t: 'code', title: '和为 K 的子数组（前缀和 + 哈希）', code: `import java.util.*;

public class SubarraySumK {
    public static int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, 1);                    // 前缀和为 0 出现 1 次（空区间）
        int pre = 0, count = 0;
        for (int x : nums) {
            pre += x;                     // 当前前缀和
            // 若之前出现过 pre-k，说明中间那段和为 k
            count += map.getOrDefault(pre - k, 0);
            map.put(pre, map.getOrDefault(pre, 0) + 1);
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(subarraySum(new int[]{1, 1, 1}, 2));  // 2
        System.out.println(subarraySum(new int[]{1, 2, 3}, 3));  // 2
    }
}` },
        { t: 'why', items: [
          '区间和 = pre[r] - pre[l-1] = k，移项得 pre[l-1] = pre[r] - k，所以只需统计「之前出现过的前缀和 pre-k」的个数。',
          'map.put(0, 1) 表示空前缀和为 0 出现一次，用于处理「从开头到当前位置正好为 k」的情况，不初始化会漏解。',
          '先查后存：先 count += get(pre-k) 再 put(pre)，避免把空区间或自己算进去。',
          '数组含负数时不能用滑动窗口（窗口扩大和不一定变大），前缀和 + 哈希是唯一 O(n) 做法。'
        ] },
        { t: 'info', text: '**思路与复杂度**：区间和 = pre[r] - pre[l-1] = K，等价于统计「之前出现过的 pre - K」的个数。关键：先查后存（避免把空区间/自己算进去），并初始化 map.put(0, 1) 表示空前缀。时间 O(n)、空间 O(n)。数组含负数时必须用此法，不能用滑动窗口。' },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '前缀和数组长度', d: 'pre 长度是 n+1（多一个 pre[0]=0），别写成 n 导致越界。' },
          { t: '下标偏移', d: 'pre[i+1] 对应前 i+1 个元素；区间 [l,r] 的和是 pre[r+1]-pre[l]，注意 +1 偏移。' },
          { t: '忘记初始化 map 的 0', d: '和为 K 的题里 map 要预置 map.put(0, 1)，否则漏掉「从开头到当前位置正好为 K」的情况。' },
          { t: '正数才能用滑动窗口', d: '数组含负数时不能用滑动窗口（窗口扩大和不一定增大），要用前缀和 + 哈希。' },
          { t: '先查后存', d: '统计子数组个数时先查 pre-k 再 put 当前 pre，顺序反了会把空区间 / 自己也算进去。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '区域和检索 - 数组不可变', diff: 'easy', note: '前缀和裸题' },
          { name: '和为 K 的子数组', diff: 'medium', note: '前缀和 + 哈希' },
          { name: '连续数组', diff: 'medium', note: '0/1 等量，前缀和技巧' },
          { name: '二维区域和检索', diff: 'medium', note: '二维前缀和' },
          { name: '和可被 K 整除的子数组', diff: 'medium', note: '同余 + 哈希' }
        ]}
      ]
    }
  ],
  quiz: [
    { q: '相向双指针（一头一尾）能直接用于哪类问题？', options: ['无序数组两数之和', '有序数组两数之和', '任意数组找最大值', '链表找环'], answer: 1, explain: '相向双指针靠「和的大小」决定移动方向，依赖数组有序；无序数组应先用哈希表或先排序。' },
    { q: '滑动窗口的典型时间复杂度是？', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 2, explain: 'left 和 right 都只向右移动，各走一遍，总 O(n)。' },
    { q: '前缀和数组 pre 的长度应该是？', options: ['n', 'n-1', 'n+1', '2n'], answer: 2, explain: 'pre 长度 n+1，pre[0]=0，pre[i] 表示前 i 个元素之和。' },
    { q: '求区间 [l, r] 的和，用前缀和表示为？', options: ['pre[r] - pre[l]', 'pre[r+1] - pre[l]', 'pre[r] - pre[l+1]', 'pre[l] - pre[r]'], answer: 1, explain: 'pre[i] 是前 i 个元素之和，区间 [l,r] 的和 = pre[r+1] - pre[l]。' }
  ],
  exercises: [
    {
      id: 'ex-c3-1',
      title: '练习 1：有序数组两数之和',
      level: '入门',
      brief: '给定一个升序排列的整数数组 nums 和目标值 target，用双指针找出和为 target 的两个数，返回它们的下标（从 1 开始）。',
      requirements: [
        '类名 TwoSumII，方法 twoSum(int[] nums, int target)',
        '使用相向双指针 i、j，不用哈希表',
        '和小于 target 时 i++，大于时 j--',
        'main 测试 nums={2,7,11,15}, target=9 输出 1 2'
      ],
      starter: `public class TwoSumII {
    public int[] twoSum(int[] nums, int target) {
        // TODO: 相向双指针
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        TwoSumII t = new TwoSumII();
        int[] r = t.twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(r[0] + " " + r[1]); // 1 2
    }
}`,
      expectedOutput: '1 2',
      keyPoints: [
        { label: 'i 从头、j 从尾开始', test: /int\s+i\s*=\s*0[\s\S]*length\s*-\s*1/ },
        { label: '循环条件 i < j', test: /i\s*<\s*j/ },
        { label: '计算两个数之和', test: /nums\[[^\]]*\]\s*\+\s*nums\[/ },
        { label: '根据和的大小移动指针', test: /i\+\+[\s\S]*j--|j--[\s\S]*i\+\+/ },
        { label: '比较 sum 与 target', test: /sum\s*==\s*target|sum\s*<\s*target|sum\s*>\s*target/ }
      ],
      hints: [
        'i = 0，j = nums.length - 1',
        'sum = nums[i] + nums[j]',
        'sum == target 就返回，sum < target 就 i++，否则 j--',
        '注意返回值下标从 1 开始（i+1、j+1）'
      ],
      analysis: '利用数组升序的特性：若两数和偏小，只能让左指针右移增大和；若偏大，只能让右指针左移减小和。每次排除一个不可能的元素，O(n) 时间、O(1) 空间。',
      solution: `public class TwoSumII {
    public int[] twoSum(int[] nums, int target) {
        int i = 0, j = nums.length - 1;
        while (i < j) {
            int sum = nums[i] + nums[j];
            if (sum == target) return new int[]{i + 1, j + 1};
            else if (sum < target) i++;
            else j--;
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        TwoSumII t = new TwoSumII();
        int[] r = t.twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(r[0] + " " + r[1]); // 1 2
    }
}`
    },
    {
      id: 'ex-c3-2',
      title: '练习 2：无重复字符的最长子串',
      level: '中等',
      brief: '给定字符串 s，找出其中不含重复字符的最长子串的长度。',
      requirements: [
        '类名 LongestSubstring，方法 lengthOfLongestSubstring(String s)',
        '用滑动窗口 + HashSet',
        '右指针扩展，出现重复就收缩左指针',
        'main 测试 abcabcbb 返回 3，bbbbb 返回 1'
      ],
      starter: `import java.util.*;

public class LongestSubstring {
    public int lengthOfLongestSubstring(String s) {
        // TODO: 滑动窗口
        return 0;
    }

    public static void main(String[] args) {
        LongestSubstring l = new LongestSubstring();
        System.out.println(l.lengthOfLongestSubstring("abcabcbb")); // 3
        System.out.println(l.lengthOfLongestSubstring("bbbbb"));    // 1
    }
}`,
      expectedOutput: '3\n1',
      keyPoints: [
        { label: '使用 HashSet 记录窗口字符', test: /Set\s*<|HashSet/ },
        { label: '定义 left 和 right 指针', test: /left[\s\S]*right|right[\s\S]*left/ },
        { label: '重复时 while 收缩窗口', test: /while\s*\([^)]*contains/ },
        { label: '用 Math.max 更新最大长度', test: /Math\.max/ },
        { label: '窗口长度 right - left + 1', test: /right\s*-\s*left\s*\+\s*1/ }
      ],
      hints: [
        'Set<Character> set 记录当前窗口内的字符',
        'for 循环 right 从 0 到 s.length()-1',
        '当 set.contains(s.charAt(right)) 时，while 循环 remove(s.charAt(left)) 并 left++',
        '把当前字符 add 进 set，更新 max = Math.max(max, right-left+1)'
      ],
      analysis: '维护一个不含重复字符的窗口。right 每走一步加入字符，若重复就不断移除 left 指向的字符并右移 left，直到窗口再次合法。每个字符最多进出窗口一次，O(n)。',
      solution: `import java.util.*;

public class LongestSubstring {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> set = new HashSet<>();
        int left = 0, max = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            while (set.contains(c)) {
                set.remove(s.charAt(left));
                left++;
            }
            set.add(c);
            max = Math.max(max, right - left + 1);
        }
        return max;
    }

    public static void main(String[] args) {
        LongestSubstring l = new LongestSubstring();
        System.out.println(l.lengthOfLongestSubstring("abcabcbb")); // 3
        System.out.println(l.lengthOfLongestSubstring("bbbbb"));    // 1
    }
}`
    },
    {
      id: 'ex-c3-3',
      title: '练习 3：区域和检索',
      level: '入门',
      brief: '给定整数数组 nums，实现一个类 NumArray，多次查询区间 [left, right] 的元素之和（left 和 right 都包含）。',
      requirements: [
        '类名 NumArray，构造器传入 int[] nums 并预处理前缀和',
        '前缀和数组长度 n+1',
        '方法 sumRange(int left, int right) 用 pre[right+1] - pre[left] 返回区间和',
        'main 测试 nums={-2,0,3,-5,2,-1}，sumRange(0,2)=1，sumRange(2,5)=-1'
      ],
      starter: `public class NumArray {
    private int[] pre;

    public NumArray(int[] nums) {
        // TODO: 构建前缀和数组
    }

    public int sumRange(int left, int right) {
        // TODO: 返回区间和
        return 0;
    }

    public static void main(String[] args) {
        NumArray a = new NumArray(new int[]{-2, 0, 3, -5, 2, -1});
        System.out.println(a.sumRange(0, 2)); // 1
        System.out.println(a.sumRange(2, 5)); // -1
    }
}`,
      expectedOutput: '1\n-1',
      keyPoints: [
        { label: '前缀和数组长度为 n+1', test: /new\s+int\[[^\]]*length\s*\+\s*1\]/ },
        { label: '累加构建前缀和', test: /pre\[\s*\w+\s*\+\s*1\]\s*=\s*pre\[/ },
        { label: '区间和 = pre[right+1] - pre[left]', test: /pre\[\s*\w+\s*\+\s*1\]\s*-\s*pre\[/ },
        { label: '定义 sumRange 方法', test: /sumRange/ },
        { label: '有 main 方法', test: /public\s+static\s+void\s+main/ }
      ],
      hints: [
        'pre = new int[nums.length + 1]',
        '循环里 pre[i+1] = pre[i] + nums[i]',
        'sumRange 返回 pre[right+1] - pre[left]'
      ],
      analysis: '预处理出前缀和 pre[i] = 前 i 个元素之和。之后任意区间 [left, right] 的和都能用 pre[right+1] - pre[left] 在 O(1) 时间得到。构造 O(n)，每次查询 O(1)。',
      solution: `public class NumArray {
    private int[] pre;

    public NumArray(int[] nums) {
        pre = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            pre[i + 1] = pre[i] + nums[i];
        }
    }

    public int sumRange(int left, int right) {
        return pre[right + 1] - pre[left];
    }

    public static void main(String[] args) {
        NumArray a = new NumArray(new int[]{-2, 0, 3, -5, 2, -1});
        System.out.println(a.sumRange(0, 2)); // 1
        System.out.println(a.sumRange(2, 5)); // -1
    }
}`
    }
  ]
});
