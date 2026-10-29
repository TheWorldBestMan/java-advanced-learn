/* 第 8 章 · 动态规划 */
window.COURSE = window.COURSE || [];
window.COURSE.push({
  id: 'c8',
  title: '动态规划',
  minutes: 200,
  tags: ['动态规划', 'DP', '背包', 'LCS', 'LIS', '记忆化'],
  goals: [
    '理解动态规划的核心：状态定义、转移方程、最优子结构、重叠子问题',
    '掌握记忆化（自顶向下）与递推（自底向上）两种写法',
    '掌握 0-1 背包、完全背包的模板与遍历顺序区别',
    '会解爬楼梯、打家劫舍、最大子数组和、LCS、LIS、编辑距离等经典题'
  ],
  interview: [
    { q: '动态规划的核心是什么？', a: '核心是**状态定义 + 状态转移方程 + 初始化 + 遍历顺序**。把大问题拆成重叠子问题，自底向上递推（或自顶向下记忆化），避免重复计算。依赖最优子结构 + 重叠子问题两个性质。' },
    { q: '0-1 背包和完全背包的区别？一维数组遍历顺序？', a: '0-1 背包每件只能选一次，容量**倒序**遍历；完全背包可无限选，容量**正序**遍历。倒序保证每件只被选一次，正序允许重复选。这是最常考的细节。' },
    { q: '动态规划解题步骤？', a: '① 定义 dp 含义 ② 找转移方程 ③ 定初始化 ④ 定遍历顺序 ⑤ 空间优化（可选）。写代码前先写清这四步，能少走很多弯路。' },
    { q: '递归 + 记忆化和递推的关系？', a: '两者等价。记忆化是**自顶向下**（先递归到边界再缓存返回），递推是**自底向上**（先算小的再算大的）。递推通常更快（无递归栈开销），记忆化更接近原始递归思路。' }
  ],
  sections: [
    {
      id: 's1',
      title: '8.1 动态规划基础',
      short: 'DP 基础',
      minutes: 70,
      blocks: [
        { t: 'h', text: '概念：状态 + 转移方程' },
        { t: 'p', text: '动态规划（DP）把大问题拆成**重叠的子问题**，只算一次并保存结果，避免重复计算。核心是三个要素：**状态定义**（dp[i] 表示什么）、**转移方程**（dp[i] 怎么由更小的 dp 推出）、**初始化与遍历顺序**。' },
        { t: 'p', text: '两种写法：**自顶向下**（记忆化递归，先递归再缓存）和**自底向上**（循环递推，先算小的再算大的）。能 DP 的问题需要满足：最优子结构（大问题的最优解由子问题最优解组成）+ 重叠子问题（子问题被反复用到）。' },
        { t: 'code', title: '爬楼梯：dp[i] = dp[i-1] + dp[i-2]', code: `public class ClimbStairs {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;   // 初始化
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];   // 转移方程
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(5));  // 8
        System.out.println(climbStairs(10)); // 89
    }
}` },
        { t: 'p', text: '**案例问题**：给定每个房子的金额，不能偷相邻两家，求能偷到的最大总额。 ' },
        { t: 'code', title: '打家劫舍：不能偷相邻两家', code: `public class HouseRobber {
    public static int rob(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        if (n == 1) return nums[0];
        int[] dp = new int[n];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        for (int i = 2; i < n; i++) {
            // 不偷第 i 家 / 偷第 i 家（用 dp[i-2]）
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        return dp[n - 1];
    }

    public static void main(String[] args) {
        System.out.println(rob(new int[]{1, 2, 3, 1}));   // 4
        System.out.println(rob(new int[]{2, 7, 9, 3, 1})); // 12
    }
}` },
        { t: 'why', items: [
          'dp[i] 表示「偷到第 i 家为止（下标 0 起）」的最大金额。',
          '转移 dp[i] = max(dp[i-1], dp[i-2] + nums[i])：不偷第 i 家（继承 dp[i-1]）或偷第 i 家（用 dp[i-2] 加 nums[i]）。',
          'dp[0]、dp[1] 先单独初始化：dp[0] = nums[0]，dp[1] = max(nums[0], nums[1])，这是递推的起点。',
          '因为 dp[i] 只依赖前两项，可以用两个滚动变量优化空间到 O(1)。'
        ] },
        { t: 'info', text: '**思路与复杂度**：dp[i] 表示偷前 i 家（下标 0 起）的最大金额，转移 dp[i] = max(dp[i-1], dp[i-2] + nums[i])：不偷第 i 家 / 偷第 i 家。时间 O(n)、空间 O(n)，可用滚动变量优化到 O(1)。DP 关键在定义状态与找转移方程。' },
        { t: 'code', title: '最大子数组和（Kadane 算法）', code: `public class MaxSubArray {
    public static int maxSubArray(int[] nums) {
        int cur = nums[0], max = nums[0];
        for (int i = 1; i < nums.length; i++) {
            // 要么另起一段，要么接在上一段后面
            cur = Math.max(nums[i], cur + nums[i]);
            max = Math.max(max, cur);
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})); // 6
    }
}` },
        { t: 'tip', text: 'DP 解题四步：① 定义 dp 含义 → ② 找转移方程 → ③ 定初始化 → ④ 定遍历顺序（正向 / 反向、先谁后谁）。写代码前先把这四步在草稿上写清，能少走很多弯路。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '计数问题：爬楼梯、不同路径、走法数',
          '最值问题：打家劫舍、最大子数组和、买卖股票',
          '存在性问题：能否跳到终点、能否凑成某金额',
          '序列问题：最长递增子序列、最长公共子序列、编辑距离',
          '背包问题：0-1 背包、完全背包（见 8.2）'
        ]},
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '状态定义不清晰', d: 'dp[i] 到底表示「前 i 个」还是「以 i 结尾」，定义不同转移方程完全不同；先写清定义。' },
          { t: '初始化错误', d: '边界（dp[0]、dp[1]）要单独初始化；初始化错后面全错。' },
          { t: '遍历顺序', d: '递推方向要和转移方程一致（依赖小的先算）；多维 DP 还要注意先遍历谁。' },
          { t: '把贪心当 DP', d: '能贪心就别 DP；但贪心拿不准时用 DP 兜底，别硬套贪心。' },
          { t: '状态没压缩导致超空间', d: '只依赖前一两项时可以用滚动变量省掉数组（如斐波那契）。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '爬楼梯', diff: 'easy', note: '最简 DP 入门' },
          { name: '打家劫舍', diff: 'medium', note: '偷/不偷二选一' },
          { name: '最大子数组和', diff: 'medium', note: 'Kadane' },
          { name: '不同路径', diff: 'medium', note: '二维 DP' },
          { name: '买卖股票的最佳时机', diff: 'easy', note: '维护历史最低价' }
        ]}
      ]
    },
    {
      id: 's2',
      title: '8.2 经典 DP 模型（背包 / LCS / LIS）',
      short: '背包 · LCS · LIS',
      minutes: 80,
      blocks: [
        { t: 'h', text: '0-1 背包：每件物品只能选一次' },
        { t: 'p', text: '0-1 背包：有 n 件物品，第 i 件重量 w[i]、价值 v[i]，背包容量 C，每件**只能选一次**，求最大价值。状态 dp[c] = 容量 c 时的最大价值；转移 dp[c] = max(dp[c], dp[c-w[i]] + v[i])。**容量要倒序遍历**，避免一件物品被重复选。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '0-1 背包：有限资源的最优分配（装箱、投资、分割等和子集）',
          '完全背包：资源可重复使用（零钱兑换、完全平方数）',
          '最长公共子序列：文本相似度、diff 工具、版本对比',
          '最长递增子序列：序列分析、套娃信封等嵌套问题',
          '编辑距离：拼写纠错、DNA 比对、字符串相似度'
        ]},
        { t: 'p', text: '**案例问题**：n 件物品，每件重量 w[i]、价值 v[i]，容量 C，每件只能选一次，求能装下的最大总价值。 ' },
        { t: 'code', title: '0-1 背包（一维滚动，容量倒序）', code: `public class Knapsack01 {
    public static int knapsack(int[] weights, int[] values, int capacity) {
        int[] dp = new int[capacity + 1];
        for (int i = 0; i < weights.length; i++) {
            for (int c = capacity; c >= weights[i]; c--) {   // 倒序！
                dp[c] = Math.max(dp[c], dp[c - weights[i]] + values[i]);
            }
        }
        return dp[capacity];
    }

    public static void main(String[] args) {
        int[] w = {2, 3, 4, 5};
        int[] v = {3, 4, 5, 6};
        System.out.println(knapsack(w, v, 8)); // 10
    }
}` },
        { t: 'why', items: [
          '一维 dp[c] 表示容量 c 时的最大价值，转移 dp[c] = max(dp[c], dp[c - w[i]] + v[i])。',
          '容量必须倒序遍历：正序时 dp[c - w[i]] 可能已是「本轮更新过」的值，会导致一件物品被重复选，变成完全背包。',
          '倒序保证算 dp[c] 时用的 dp[c - w[i]] 还是上一轮（未选当前物品）的值，从而每件只选一次。',
          '内层从 capacity 减到 w[i]（含），小于 w[i] 的容量装不下当前物品，无需更新。'
        ] },
        { t: 'info', text: '**思路与复杂度**：0-1 背包每件只能选一次，一维数组容量要「倒序」遍历；完全背包可重复选，容量「正序」遍历——这是最常考的区别。时间 O(n × capacity)、空间 O(capacity)。LCS、LIS 则分别是二维、一维 DP 的经典模型。' },
        { t: 'code', title: '完全背包（零钱兑换）：每件物品可无限选', code: `import java.util.*;

public class CoinChange {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);   // 用大数表示「不可达」
        dp[0] = 0;
        for (int coin : coins) {
            for (int a = coin; a <= amount; a++) {   // 正序！可重复选
                dp[a] = Math.min(dp[a], dp[a - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        System.out.println(coinChange(new int[]{1, 2, 5}, 11)); // 3（5+5+1）
        System.out.println(coinChange(new int[]{2}, 3));        // -1
    }
}` },
        { t: 'warn', text: '0-1 背包「倒序」、完全背包「正序」是高频考点：倒序保证每件物品只选一次，正序允许重复选。搞混了结果就错。' },
        { t: 'h', text: '最长公共子序列（LCS）' },
        { t: 'code', title: 'LCS：二维 DP', code: `public class LCS {
    public static int longestCommonSubsequence(String a, String b) {
        int m = a.length(), n = b.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;   // 匹配，都前进
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }

    public static void main(String[] args) {
        System.out.println(longestCommonSubsequence("abcde", "ace"));   // 3
        System.out.println(longestCommonSubsequence("abc", "def"));     // 0
    }
}` },
        { t: 'code', title: '最长递增子序列（LIS）', code: `import java.util.*;

public class LIS {
    public static int lengthOfLIS(int[] nums) {
        int[] dp = new int[nums.length];
        Arrays.fill(dp, 1);              // 每个元素自己就是长度为 1 的子序列
        int max = 1;
        for (int i = 0; i < nums.length; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            max = Math.max(max, dp[i]);
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLIS(new int[]{10, 9, 2, 5, 3, 7, 101, 18})); // 4
    }
}` },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '0-1 背包与完全背包顺序', d: '0-1 背包容量倒序、完全背包正序；这是最常考的细节。' },
          { t: 'LCS 下标偏移', d: 'dp 是 (m+1) x (n+1)，比较字符用 charAt(i-1) / charAt(j-1)，别直接用 i、j。' },
          { t: 'LIS 的 dp[i] 含义', d: 'dp[i] 是「以 nums[i] 结尾」的最长递增子序列长度，不是全局；最后要取所有 dp 的最大值。' },
          { t: '零钱兑换初始化', d: 'dp 初始化为 amount+1（表示不可达），dp[0]=0，最后判断是否 > amount。' },
          { t: '背包重量数组下标', d: 'c 从 capacity 倒序到 weights[i]（含），少写 = 会漏掉恰好装满的情况。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '0-1 背包 / 分割等和子集', diff: 'medium', note: '背包模板' },
          { name: '零钱兑换', diff: 'medium', note: '完全背包' },
          { name: '最长公共子序列', diff: 'medium', note: '二维 DP' },
          { name: '最长递增子序列', diff: 'medium', note: 'DP 或贪心 + 二分' },
          { name: '编辑距离', diff: 'hard', note: '二维 DP 经典' }
        ]}
      ]
    }
  ],
  quiz: [
    { q: '动态规划依赖的两个核心性质是？', options: ['最优子结构和重叠子问题', '有序性和唯一性', '确定性和随机性', '线性和非线性'], answer: 0, explain: 'DP 依赖最优子结构（大问题由子问题最优解组成）和重叠子问题（子问题被重复利用）。' },
    { q: '爬楼梯 dp[i] = dp[i-1] + dp[i-2] 的初始化是？', options: ['dp[0]=0, dp[1]=1', 'dp[1]=1, dp[2]=2', 'dp[0]=1, dp[1]=2', '不用初始化'], answer: 1, explain: '1 级有 1 种、2 级有 2 种，所以 dp[1]=1、dp[2]=2。' },
    { q: '0-1 背包用一维数组时，容量应该怎么遍历？', options: ['正序从小到大', '倒序从大到小', '随机', '无所谓'], answer: 1, explain: '0-1 背包每件只选一次，容量倒序遍历避免同一件被重复选。' },
    { q: '完全背包（物品可无限选）容量应怎么遍历？', options: ['倒序', '正序', '随机', '用二分'], answer: 1, explain: '完全背包容量正序遍历，允许同一件物品被重复选择。' }
  ],
  exercises: [
    {
      id: 'ex-c8-1',
      title: '练习 1：爬楼梯',
      level: '入门',
      brief: '爬 n 级楼梯，每次可以爬 1 级或 2 级，求有多少种不同爬法。',
      requirements: [
        '类名 ClimbStairs，方法 climbStairs(int n)',
        '用 dp 数组：dp[i] = dp[i-1] + dp[i-2]',
        '初始化 dp[1]=1, dp[2]=2',
        'main 测试 climbStairs(5) 返回 8'
      ],
      starter: `public class ClimbStairs {
    public int climbStairs(int n) {
        // TODO: 动态规划
        return 0;
    }

    public static void main(String[] args) {
        ClimbStairs c = new ClimbStairs();
        System.out.println(c.climbStairs(5)); // 8
    }
}`,
      expectedOutput: '8',
      keyPoints: [
        { label: '定义 dp 数组', test: /int\[\]\s*dp/ },
        { label: '初始化 dp[1] = 1', test: /dp\[1\]\s*=\s*1/ },
        { label: '转移 dp[i] = dp[i-1] + dp[i-2]', test: /dp\[i\]\s*=\s*dp\[i\s*-\s*1\]\s*\+\s*dp\[i\s*-\s*2\]/ },
        { label: 'for 循环递推', test: /for\s*\(/ }
      ],
      hints: [
        'n <= 2 时直接返回 n',
        'int[] dp = new int[n + 1]，dp[1]=1，dp[2]=2',
        'for 从 3 到 n：dp[i] = dp[i-1] + dp[i-2]',
        '返回 dp[n]'
      ],
      analysis: '到第 i 级，最后一步要么从 i-1 迈 1 级、要么从 i-2 迈 2 级，所以 dp[i] = dp[i-1] + dp[i-2]。这就是斐波那契数列。时间 O(n)，空间 O(n)（可优化到 O(1)）。',
      solution: `public class ClimbStairs {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }

    public static void main(String[] args) {
        ClimbStairs c = new ClimbStairs();
        System.out.println(c.climbStairs(5)); // 8
    }
}`
    },
    {
      id: 'ex-c8-2',
      title: '练习 2：最大子数组和',
      level: '中等',
      brief: '给定整数数组 nums，找出具有最大和的连续子数组（至少一个元素），返回最大和。',
      requirements: [
        '类名 MaxSubArray，方法 maxSubArray(int[] nums)',
        '用 Kadane 算法：维护当前和 cur 与最大值 max',
        'cur = max(nums[i], cur + nums[i])',
        'main 测试 {-2,1,-3,4,-1,2,1,-5,4} 返回 6'
      ],
      starter: `public class MaxSubArray {
    public int maxSubArray(int[] nums) {
        // TODO: Kadane 算法
        return 0;
    }

    public static void main(String[] args) {
        MaxSubArray m = new MaxSubArray();
        System.out.println(m.maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})); // 6
    }
}`,
      expectedOutput: '6',
      keyPoints: [
        { label: '维护当前和 cur', test: /cur/ },
        { label: 'cur = max(nums[i], cur + nums[i])', test: /Math\.max\(nums\[i\]\s*,\s*cur\s*\+\s*nums\[i\]\)/ },
        { label: '更新最大值 max', test: /Math\.max\(max\s*,\s*cur\)/ },
        { label: '返回 max', test: /return\s+max/ }
      ],
      hints: [
        'int cur = nums[0], max = nums[0]',
        'for 从 1 开始：cur = Math.max(nums[i], cur + nums[i])',
        'max = Math.max(max, cur)',
        '返回 max'
      ],
      analysis: '对每个位置，要么把当前元素「另起一段」，要么「接在上一段后面」，取两者较大值作为以 i 结尾的最大子数组和。遍历一遍记录全局最大。时间 O(n)，空间 O(1)。',
      solution: `public class MaxSubArray {
    public int maxSubArray(int[] nums) {
        int cur = nums[0], max = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            max = Math.max(max, cur);
        }
        return max;
    }

    public static void main(String[] args) {
        MaxSubArray m = new MaxSubArray();
        System.out.println(m.maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})); // 6
    }
}`
    },
    {
      id: 'ex-c8-3',
      title: '练习 3：最长公共子序列',
      level: '中等',
      brief: '给定两个字符串 text1 和 text2，返回它们的最长公共子序列的长度（子序列不要求连续，但保持相对顺序）。',
      requirements: [
        '类名 LCS，方法 longestCommonSubsequence(String a, String b)',
        '用二维 dp，大小为 (m+1) x (n+1)',
        '字符相等 dp[i][j] = dp[i-1][j-1] + 1，否则取 max',
        'main 测试 abcde 与 ace 返回 3'
      ],
      starter: `public class LCS {
    public int longestCommonSubsequence(String a, String b) {
        // TODO: 二维动态规划
        return 0;
    }

    public static void main(String[] args) {
        LCS l = new LCS();
        System.out.println(l.longestCommonSubsequence("abcde", "ace")); // 3
    }
}`,
      expectedOutput: '3',
      keyPoints: [
        { label: '定义二维 dp 数组', test: /int\[\]\[\]\s*dp/ },
        { label: 'dp 大小 m+1 和 n+1', test: /new\s+int\[m\s*\+\s*1\]\[n\s*\+\s*1\]/ },
        { label: '相等时 dp[i-1][j-1] + 1', test: /dp\[i\s*-\s*1\]\[j\s*-\s*1\]\s*\+\s*1/ },
        { label: '不等时取 max', test: /Math\.max\(dp\[i\s*-\s*1\]\[j\]\s*,\s*dp\[i\]\[j\s*-\s*1\]\)/ }
      ],
      hints: [
        'm = a.length(), n = b.length()',
        'int[][] dp = new int[m + 1][n + 1]',
        '双层循环 i、j 从 1 开始',
        'charAt(i-1) == charAt(j-1) 时 dp[i][j] = dp[i-1][j-1] + 1，否则 Math.max(dp[i-1][j], dp[i][j-1])'
      ],
      analysis: 'dp[i][j] 表示 a 前 i 个字符和 b 前 j 个字符的 LCS 长度。末字符相等则一起前进并 +1，不等则丢弃其中一个（取较大）。时间 O(mn)，空间 O(mn)。',
      solution: `public class LCS {
    public int longestCommonSubsequence(String a, String b) {
        int m = a.length(), n = b.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }

    public static void main(String[] args) {
        LCS l = new LCS();
        System.out.println(l.longestCommonSubsequence("abcde", "ace")); // 3
    }
}`
    }
  ]
});
