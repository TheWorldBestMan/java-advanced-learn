/* 第 6 章 · 树、BFS、DFS */
window.COURSE = window.COURSE || [];
window.COURSE.push({
  id: 'c6',
  title: '树、BFS、DFS',
  minutes: 170,
  tags: ['二叉树', 'BFS', 'DFS', '层序遍历', '岛屿'],
  goals: [
    '掌握二叉树节点结构与前中后序遍历（递归 + 迭代）',
    '理解 BFS 用队列逐层扩展，会写层序遍历与最短路径',
    '理解 DFS 深入到底再回溯，会解连通块、路径类问题',
    '能区分何时用 BFS、何时用 DFS'
  ],
  interview: [
    { q: '二叉树的三种遍历及区别？', a: '前序（根-左-右）、中序（左-根-右）、后序（左-右-根），区别只在「访问根」的位置。**中序对二叉搜索树得到升序序列**；前序适合序列化/复制树；后序适合先处理子树。' },
    { q: 'BFS 和 DFS 的区别？各用什么数据结构？', a: 'BFS 用**队列**逐层扩展、按距离访问，适合求无权图最短路径、层序遍历；DFS 用**递归/栈**一路深入到底，适合连通块、路径枚举、回溯。BFS 保证最短路径，DFS 不保证。' },
    { q: '二叉搜索树的特点？', a: '左子树**所有**节点 < 根 < 右子树所有节点（注意是「所有」不是只看直接孩子）。查找/插入/删除平均 O(log n)，中序遍历得到升序序列。退化成链时变 O(n)，需平衡树（AVL/红黑树）保证。' },
    { q: '层序遍历怎么实现？', a: 'BFS + 队列。每轮先记录 q.size() 为当前层节点数，用 for 循环恰好弹出这一层并压入下一层，实现按层分组。' }
  ],
  sections: [
    {
      id: 's1',
      title: '6.1 树',
      short: '树',
      minutes: 55,
      blocks: [
        { t: 'h', text: '概念：二叉树与遍历' },
        { t: 'p', text: '二叉树每个节点最多两个子节点（left / right）。**前序**（根-左-右）、**中序**（左-根-右）、**后序**（左-右-根）是三种深度优先遍历。二叉搜索树（BST）额外满足：左子树所有值 < 根 < 右子树所有值。' },
        { t: 'code', title: '定义节点与前中后序遍历', code: `public class Traversal {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    public static void preorder(TreeNode root) {
        if (root == null) return;
        System.out.print(root.val + " ");  // 先访问根
        preorder(root.left);
        preorder(root.right);
    }

    public static void inorder(TreeNode root) {
        if (root == null) return;
        inorder(root.left);
        System.out.print(root.val + " ");  // 中间访问根
        inorder(root.right);
    }

    public static void postorder(TreeNode root) {
        if (root == null) return;
        postorder(root.left);
        postorder(root.right);
        System.out.print(root.val + " ");  // 最后访问根
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);

        preorder(root); System.out.println();  // 1 2 4 5 3
        inorder(root);  System.out.println();  // 4 2 5 1 3
        postorder(root);System.out.println();  // 4 5 2 3 1
    }
}` },
        { t: 'table', head: ['遍历', '顺序', '特点'], rows: [
          ['前序', '根 → 左 → 右', '复制树、序列化'],
          ['中序', '左 → 根 → 右', 'BST 得到有序序列'],
          ['后序', '左 → 右 → 根', '先处理子树再处理根，释放资源']
        ]},
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '二叉搜索树（BST）：查找、插入、删除都 O(log n)',
          '表达式树、文件系统、组织机构等层级结构',
          '堆（完全二叉树）、线段树、字典树',
          '递归题目：最大深度、镜像、对称、路径和'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'p', text: '**案例问题**：给定二叉树根节点，求最大深度（根到最远叶子的节点数）。 ' },
        { t: 'code', title: '二叉树最大深度', code: `public class MaxDepth {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    public static int maxDepth(TreeNode root) {
        if (root == null) return 0;                       // 空树深度 0
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        System.out.println(maxDepth(root)); // 3
    }
}` },
        { t: 'h', text: '案例：验证二叉搜索树' },
        { t: 'p', text: '**案例问题**：给定二叉树，判断它是否是合法的二叉搜索树（左子树所有节点 < 根 < 右子树所有节点）。' },
        { t: 'code', title: '验证二叉搜索树', code: `public class ValidBST {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    public static boolean isValidBST(TreeNode root) {
        return check(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private static boolean check(TreeNode node, long low, long high) {
        if (node == null) return true;
        if (node.val <= low || node.val >= high) return false;
        return check(node.left, low, node.val) && check(node.right, node.val, high);
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(5);
        root.left = new TreeNode(1);
        root.right = new TreeNode(7);
        root.right.left = new TreeNode(6);
        root.right.right = new TreeNode(8);
        System.out.println(isValidBST(root)); // true
    }
}` },
        { t: 'why', items: [
          '不能只比较 node 和左右孩子，因为 BST 要求「整个左子树」都小于根；用上下界 low、high 递归传递约束。',
          '初始上下界用 Long.MIN_VALUE / MAX_VALUE：节点值可能是 int 边界，用 long 避免边界比较出错。',
          '左子树的上界收紧为 node.val，右子树的下界收紧为 node.val，递归传递。',
          'node.val <= low || node.val >= high 就非法：注意是严格小于/大于，相等也不行（BST 不允许相等）。'
        ] },
        { t: 'why', items: [
          '递归定义：树的高度 = 1（当前节点）+ 左右子树高度的较大值。',
          '空节点返回 0 是递归终止条件，也是「自底向上汇总」的基准。',
          'Math.max 取左右较大值，对应「最长路径」的定义。',
          '这种「return 1 + max(递归左, 递归右)」是树 DP 的模板，对称树、路径和都类似。'
        ] },
        { t: 'info', text: '**思路与复杂度**：深度 = 1 + 左右子树深度的较大值，空节点返回 0。时间 O(n)、空间 O(高度)。同类「自底向上汇总」的递归模板可用于对称二叉树、路径和等题。' },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '空节点判断', d: '树的递归几乎都要先判 root == null，否则访问 root.left 就空指针。' },
          { t: 'BST 中序遍历是有序的', d: '二叉搜索树中序遍历得到升序序列，验证 BST、找第 K 小都靠这个性质。' },
          { t: 'BST 定义是「所有」', d: 'BST 要求左子树「所有」节点都小于根，不是只看左孩子；验证时要用上下界传递。' },
          { t: '递归终止条件', d: '树的递归以「节点为空」为终止条件，忘了会栈溢出。' },
          { t: '混淆三种遍历', d: '前中后的区别只在「访问根」的位置，打印语句放错位置结果就错了。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '二叉树的最大深度', diff: 'easy', note: '递归' },
          { name: '对称二叉树', diff: 'easy', note: '递归比较左右' },
          { name: '验证二叉搜索树', diff: 'medium', note: '中序 / 上下界' },
          { name: '二叉树的最近公共祖先', diff: 'medium', note: '递归找祖先' },
          { name: '路径总和', diff: 'easy', note: 'DFS 求和' }
        ]}
      ]
    },
    {
      id: 's2',
      title: '6.2 BFS（广度优先搜索）',
      short: 'BFS',
      minutes: 50,
      blocks: [
        { t: 'h', text: '概念：逐层向外扩展' },
        { t: 'p', text: 'BFS 从起点开始，用**队列**逐层访问：先访问离起点近的节点，再访问远的。它天然适合求**无权图的最短路径**和**层序遍历**。' },
        { t: 'p', text: '**案例问题**：按层返回二叉树节点值（从左到右、逐层分组）。 ' },
        { t: 'code', title: '层序遍历（BFS 模板）', code: `import java.util.*;

public class LevelOrder {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();            // 当前层的节点数
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        System.out.println(levelOrder(root)); // [[3], [9, 20], [15, 7]]
    }
}` },
        { t: 'why', items: [
          'BFS 用队列逐层扩展，先入先出保证按层访问。',
          '关键技巧：每轮先 int size = q.size() 记录当前层节点数，再用 for 恰好处理这一层，实现按层分组。',
          '入队前判 node.left / node.right != null：null 不能入队，否则 poll 出来访问会空指针。',
          '不记录 size 就无法区分层边界，所有节点会混在一起。'
        ] },
        { t: 'info', text: '**思路与复杂度**：BFS 用队列逐层扩展。关键是每轮先记录 q.size()（当前层节点数），用 for 恰好处理一层，实现「按层分组」。时间 O(n)、空间 O(n)。BFS 还能求无权图最短路径、二叉树最小深度。' },
        { t: 'tip', text: '层序遍历的关键技巧：每次进 while 先记录 q.size()（当前层节点数），用 for 循环恰好处理这一层，下一层的节点等这层处理完才进入下一轮。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '树的层序遍历、之字形遍历',
          '无权图的最短路径（迷宫、单词接龙）',
          '图的连通分量、多源 BFS（腐烂的橘子）',
          '按「距离 / 步数」分层处理的问题'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'code', title: '二叉树的最小深度（BFS 找到第一个叶子）', code: `import java.util.*;

public class MinDepth {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    public static int minDepth(TreeNode root) {
        if (root == null) return 0;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        int depth = 1;
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                if (node.left == null && node.right == null) return depth; // 叶子
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            depth++;
        }
        return depth;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        System.out.println(minDepth(root)); // 2
    }
}` },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '忘记记录层大小', d: '不记 q.size() 就分不清哪层结束，层序遍历会串层。' },
          { t: '入队前不判空', d: 'node.left / node.right 为 null 时不能入队，否则后面 poll 出来访问会 NPE。' },
          { t: '图 BFS 要标记访问', d: '图上不标记 visited 会重复入队、死循环；树没有环可以省略。' },
          { t: 'poll 与 peek 混用', d: 'poll 才出队，peek 只看不出队；出队逻辑写错队列会卡住。' },
          { t: 'BFS 求的是无权最短', d: 'BFS 只能求无权图（每步代价相同）的最短路径；带权图要用 Dijkstra。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '二叉树的层序遍历', diff: 'medium', note: 'BFS 模板' },
          { name: '二叉树的最小深度', diff: 'easy', note: 'BFS 找到第一个叶子' },
          { name: '岛屿数量（BFS 版）', diff: 'medium', note: '多源 BFS' },
          { name: '腐烂的橘子', diff: 'medium', note: '多源 BFS + 最短时间' },
          { name: '单词接龙', diff: 'hard', note: 'BFS 最短变换' }
        ]}
      ]
    },
    {
      id: 's3',
      title: '6.3 DFS（深度优先搜索）',
      short: 'DFS',
      minutes: 55,
      blocks: [
        { t: 'h', text: '概念：一条路走到底再回溯' },
        { t: 'p', text: 'DFS 沿一条路径**尽可能深入**，走不动了再回溯换路。可以用递归（函数调用栈）或显式栈实现。它和回溯关系密切：回溯本质就是 DFS + 撤销。常用于连通块、路径枚举、图遍历。' },
        { t: 'p', text: '**案例问题**：给定二维字符网格，1 是陆地、0 是水，上下左右相连的 1 组成一个岛，求岛的数量。 ' },
        { t: 'code', title: '岛屿数量（DFS 淹没法）', code: `public class NumIslands {
    public static int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    dfs(grid, i, j);   // 把这个岛全部淹没成 0
                    count++;
                }
            }
        }
        return count;
    }

    private static void dfs(char[][] grid, int i, int j) {
        if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length
                || grid[i][j] != '1') return;
        grid[i][j] = '0';              // 标记已访问（淹没）
        dfs(grid, i + 1, j);           // 下
        dfs(grid, i - 1, j);           // 上
        dfs(grid, i, j + 1);           // 右
        dfs(grid, i, j - 1);           // 左
    }

    public static void main(String[] args) {
        char[][] grid = {
            {'1','1','0','0','0'},
            {'1','1','0','0','0'},
            {'0','0','1','0','0'},
            {'0','0','0','1','1'}
        };
        System.out.println(numIslands(grid)); // 3
    }
}` },
        { t: 'why', items: [
          '遇到陆地（1）就 DFS 把整个连通块「淹没」成 0，同一座岛只数一次，count++。',
          'DFS 先判越界（i<0、j<0、i>=行数、j>=列数）再判 grid[i][j] != 1，顺序不能反，否则数组越界。',
          '把 grid[i][j] = 0 当作访问标记，省掉单独 visited 数组，也符合「淹没」的直觉。',
          '四个方向分别递归（上下左右），覆盖所有相邻陆地。',
          '双重循环遍历每个格子，每个格子最多访问一次，时间 O(行 × 列)。'
        ] },
        { t: 'info', text: '**思路与复杂度**：遇到陆地（1）就 DFS 把整个连通块淹没成 0，计数 +1。网格 DFS 先判越界、再判是否为 1。「淹没」本身就是访问标记。每个格子访问一次，时间 O(行 × 列)、空间 O(行 × 列)（递归栈）。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '图的遍历、连通块（岛屿数量、岛屿最大面积）',
          '二叉树 / 多叉树的路径枚举（路径总和、所有路径）',
          '回溯类问题（排列、组合、N 皇后）',
          '拓扑排序的 DFS 版、找环'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'code', title: '路径总和：是否存在根到叶子的路径和为 target', code: `public class PathSum {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    public static boolean hasPathSum(TreeNode root, int target) {
        if (root == null) return false;
        target -= root.val;                     // 减去当前节点值
        if (root.left == null && root.right == null) return target == 0; // 叶子
        return hasPathSum(root.left, target) || hasPathSum(root.right, target);
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(5);
        root.left = new TreeNode(4);
        root.right = new TreeNode(8);
        root.left.left = new TreeNode(11);
        root.left.left.left = new TreeNode(7);
        root.left.left.right = new TreeNode(2);
        System.out.println(hasPathSum(root, 22)); // true (5+4+11+2)
    }
}` },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '忘记标记访问', d: '图 DFS 不标记 visited（或淹没）会重复访问、死循环；树无环可省略。' },
          { t: '边界判断顺序', d: '先判越界再访问 grid[i][j]，顺序反了会数组越界。' },
          { t: '递归 vs 栈', d: '递归 DFS 层数过深会栈溢出，可改用显式栈迭代。' },
          { t: '回溯时恢复现场', d: '枚举路径的 DFS 在返回前要撤销状态（如删除路径末尾），否则路径残留。' },
          { t: 'DFS 不保证最短', d: 'DFS 先找到的路径不一定最短，求最短路径用 BFS。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '岛屿数量', diff: 'medium', note: 'DFS/BFS 淹没法' },
          { name: '岛屿的最大面积', diff: 'medium', note: 'DFS 统计面积' },
          { name: '路径总和', diff: 'easy', note: 'DFS 减到叶子' },
          { name: '二叉树的所有路径', diff: 'easy', note: 'DFS + 回溯' },
          { name: '被围绕的区域', diff: 'medium', note: '从边界 DFS' }
        ]}
      ]
    }
  ],
  quiz: [
    { q: '二叉树中序遍历的顺序是？', options: ['根 → 左 → 右', '左 → 根 → 右', '左 → 右 → 根', '右 → 根 → 左'], answer: 1, explain: '中序 = 左子树、根、右子树；对二叉搜索树中序遍历得到升序序列。' },
    { q: 'BFS 广度优先搜索用什么数据结构？', options: ['栈', '队列', '堆', '哈希表'], answer: 1, explain: 'BFS 用队列逐层扩展，先入先出保证按距离访问。' },
    { q: 'DFS 深度优先搜索可以用什么实现？', options: ['只用队列', '递归（调用栈）或显式栈', '只用哈希表', '只能循环'], answer: 1, explain: 'DFS 可用递归（隐式用函数调用栈）或显式 Stack 迭代实现。' },
    { q: '求无权图中两点的最短路径，应该用？', options: ['DFS', 'BFS', '二分查找', '排序'], answer: 1, explain: 'BFS 按层扩展，第一次到达目标时的步数就是最短路径；DFS 不保证最短。' }
  ],
  exercises: [
    {
      id: 'ex-c6-1',
      title: '练习 1：二叉树的最大深度',
      level: '入门',
      brief: '给定二叉树的根节点，返回它的最大深度（从根到最远叶子节点的最长路径上的节点数）。',
      requirements: [
        '类名 MaxDepth，定义 TreeNode 节点类',
        '方法 maxDepth(TreeNode root) 递归求深度',
        '空树返回 0，否则 1 + 左右子树深度的较大值',
        'main 构建示例树并输出深度'
      ],
      starter: `public class MaxDepth {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    public int maxDepth(TreeNode root) {
        // TODO: 递归求最大深度
        return 0;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        System.out.println(new MaxDepth().maxDepth(root)); // 3
    }
}`,
      expectedOutput: '3',
      keyPoints: [
        { label: '终止条件 root == null', test: /root\s*==\s*null/ },
        { label: '递归调用左右子树', test: /maxDepth\(root\.left\)|maxDepth\(root\.right\)/ },
        { label: '用 Math.max 取较大值', test: /Math\.max/ },
        { label: '返回 1 + 深度', test: /return\s+1\s*\+/ }
      ],
      hints: [
        'if (root == null) return 0',
        '左深度 = maxDepth(root.left)，右深度 = maxDepth(root.right)',
        'return 1 + Math.max(左深度, 右深度)'
      ],
      analysis: '树的高度 = 1（当前节点）+ 左右子树高度的较大值。递归到空节点返回 0，逐层向上累加。时间 O(n)，空间 O(高度)。',
      solution: `public class MaxDepth {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        System.out.println(new MaxDepth().maxDepth(root)); // 3
    }
}`
    },
    {
      id: 'ex-c6-2',
      title: '练习 2：二叉树的层序遍历',
      level: '中等',
      brief: '给定二叉树根节点，返回其按层序遍历得到的节点值（从左到右，逐层）。',
      requirements: [
        '类名 LevelOrder，定义 TreeNode 节点类',
        '用队列 Queue（ArrayDeque）做 BFS',
        '每层用 size 记录节点数，按层分组',
        'main 构建示例树输出 [[3],[9,20],[15,7]]'
      ],
      starter: `import java.util.*;

public class LevelOrder {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        // TODO: BFS 层序遍历
        return res;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        System.out.println(new LevelOrder().levelOrder(root));
    }
}`,
      expectedOutput: '[[3], [9, 20], [15, 7]]',
      keyPoints: [
        { label: '使用 Queue / ArrayDeque', test: /Queue\s*<|ArrayDeque/ },
        { label: 'offer 入队', test: /\.offer\(/ },
        { label: 'poll 出队', test: /\.poll\(/ },
        { label: '记录每层大小 size', test: /size\s*=\s*q\.size\(\)|q\.size\(\)/ },
        { label: '把左右孩子入队', test: /node\.left[\s\S]*node\.right|\.left[\s\S]*\.right/ }
      ],
      hints: [
        '空树直接返回 res',
        'Queue<TreeNode> q = new ArrayDeque<>(); q.offer(root)',
        'while 循环：size = q.size()，for 处理 size 次',
        '每次 poll 后把 node.left、node.right（非空）offer 入队，本层加入 level'
      ],
      analysis: 'BFS 逐层：while 每轮处理一层，用 q.size() 记录本层节点数，for 循环恰好弹出本层全部节点并压入下一层。时间 O(n)，空间 O(n)。',
      solution: `import java.util.*;

public class LevelOrder {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        System.out.println(new LevelOrder().levelOrder(root));
    }
}`
    },
    {
      id: 'ex-c6-3',
      title: '练习 3：岛屿数量',
      level: '中等',
      brief: '给定二维字符网格 grid，1 表示陆地、0 表示水，相邻（上下左右）的 1 组成一个岛。求岛屿数量。',
      requirements: [
        '类名 NumIslands，方法 numIslands(char[][] grid)',
        '用 DFS 淹没法：访问过的 1 改成 0',
        '四个方向递归，先判越界',
        'main 测试返回 3'
      ],
      starter: `public class NumIslands {
    public int numIslands(char[][] grid) {
        // TODO: DFS 统计岛屿数量
        return 0;
    }

    public static void main(String[] args) {
        char[][] grid = {
            {'1','1','0','0','0'},
            {'1','1','0','0','0'},
            {'0','0','1','0','0'},
            {'0','0','0','1','1'}
        };
        System.out.println(new NumIslands().numIslands(grid)); // 3
    }
}`,
      expectedOutput: '3',
      keyPoints: [
        { label: '定义 dfs 方法', test: /dfs/ },
        { label: '边界判断', test: /i\s*<\s*0\s*\|\|\s*j\s*<\s*0|i\s*>=\s*grid\.length/ },
        { label: '标记已访问 grid[i][j] = 0', test: /grid\[i\]\[j\]\s*=\s*'0'/ },
        { label: '四个方向递归', test: /dfs\(grid,\s*i\s*\+\s*1|dfs\(grid,\s*i\s*-\s*1|dfs\(grid,\s*i,\s*j\s*\+\s*1|dfs\(grid,\s*i,\s*j\s*-\s*1/ },
        { label: '统计岛屿数量 count++', test: /count\s*\+\+/ }
      ],
      hints: [
        '双重循环遍历 grid，遇到 1 就 dfs 淹没并 count++',
        'dfs 先判越界或不是 1，返回',
        '把 grid[i][j] 置为 0，然后对上下左右四个方向递归'
      ],
      analysis: '遇到一个陆地（1），就用 DFS 把它和它连通的所有陆地都标记为已访问（改成 0），这一片就是一个岛，计数加一。每个格子访问一次，时间 O(行 * 列)。',
      solution: `public class NumIslands {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    dfs(grid, i, j);
                    count++;
                }
            }
        }
        return count;
    }

    private void dfs(char[][] grid, int i, int j) {
        if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length
                || grid[i][j] != '1') return;
        grid[i][j] = '0';
        dfs(grid, i + 1, j);
        dfs(grid, i - 1, j);
        dfs(grid, i, j + 1);
        dfs(grid, i, j - 1);
    }

    public static void main(String[] args) {
        char[][] grid = {
            {'1','1','0','0','0'},
            {'1','1','0','0','0'},
            {'0','0','1','0','0'},
            {'0','0','0','1','1'}
        };
        System.out.println(new NumIslands().numIslands(grid)); // 3
    }
}`
    }
  ]
});
