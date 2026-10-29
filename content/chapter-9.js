/* 第 9 章 · 图、并查集、拓扑排序 */
window.COURSE = window.COURSE || [];
window.COURSE.push({
  id: 'c9',
  title: '图、并查集、拓扑排序',
  minutes: 170,
  tags: ['图', '邻接表', '并查集', '拓扑排序', 'DAG'],
  goals: [
    '掌握图的两种表示：邻接矩阵与邻接表',
    '理解并查集的 find（路径压缩）与 union（按秩合并）',
    '掌握拓扑排序的 Kahn 算法（BFS + 入度）与环检测',
    '会解省份数量、课程表、冗余连接等经典题'
  ],
  interview: [
    { q: '图的存储方式？邻接矩阵 vs 邻接表？', a: '邻接矩阵 matrix[i][j] 表示边，查边 **O(1)** 但空间 **O(V²)**，适合稠密图；邻接表每个顶点存邻居列表，空间 **O(V+E)**、遍历快，适合稀疏图。' },
    { q: '并查集的两个优化？时间复杂度？', a: '**路径压缩**（find 时把沿途节点直接指向根）+ **按秩合并**（把小树挂到大树下）。两者结合，单次操作均摊接近 **O(α(n))**（反阿克曼函数，近似常数）。' },
    { q: '拓扑排序怎么实现？什么图才能拓扑排序？', a: '只有**有向无环图 DAG** 能拓扑排序。Kahn 算法：不断取出入度为 0 的节点、删掉其出边、入度减 1。若最后还有节点没被访问说明有环。' },
    { q: '怎么判断一个有向图有没有环？', a: '三种：① 拓扑排序（Kahn），能排完即无环；② DFS 三色标记（白/灰/黑，遇到灰色说明有环）；③ 无向图可用并查集（加边时两端已连通则有环）。' }
  ],
  sections: [
    {
      id: 's1',
      title: '9.1 图',
      short: '图',
      minutes: 45,
      blocks: [
        { t: 'h', text: '概念：顶点 + 边' },
        { t: 'p', text: '图由**顶点**（节点）和**边**（连接）组成，分有向图（边有方向）和无向图。常用两种表示：**邻接矩阵**（matrix[i][j]=1 表示 i 连 j，O(1) 查边但占 O(V^2) 空间）和**邻接表**（每个顶点一个邻居列表，省空间，遍历快）。' },
        { t: 'code', title: '邻接表表示图', code: `import java.util.*;

public class GraphDemo {
    public static void main(String[] args) {
        int n = 5;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());

        // 无向边：0-1, 0-2, 1-3, 2-3, 3-4
        addEdge(adj, 0, 1);
        addEdge(adj, 0, 2);
        addEdge(adj, 1, 3);
        addEdge(adj, 2, 3);
        addEdge(adj, 3, 4);

        for (int i = 0; i < n; i++) {
            System.out.println(i + " -> " + adj.get(i));
        }
    }

    private static void addEdge(List<List<Integer>> adj, int u, int v) {
        adj.get(u).add(v);
        adj.get(v).add(u);   // 无向图加两次
    }
}` },
        { t: 'table', head: ['表示方式', '查边', '遍历邻居', '空间'], rows: [
          ['邻接矩阵', 'O(1)', 'O(V)', 'O(V^2)'],
          ['邻接表', 'O(度)', 'O(度)', 'O(V + E)']
        ]},
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '社交网络（好友关系）、地图导航',
          '课程依赖、任务调度（有向图）',
          '网络拓扑、路由、传播',
          '图的遍历（DFS / BFS）、连通性、最短路径'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'p', text: '**案例问题**：用 DFS 遍历一个无向连通图，打印访问顺序。 ' },
        { t: 'code', title: '图的 DFS 遍历', code: `import java.util.*;

public class GraphDFS {
    private static boolean[] visited;

    public static void dfs(List<List<Integer>> adj, int u) {
        visited[u] = true;
        System.out.print(u + " ");
        for (int v : adj.get(u)) {
            if (!visited[v]) dfs(adj, v);
        }
    }

    public static void main(String[] args) {
        int n = 5;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[][] edges = {{0,1},{0,2},{1,3},{2,3},{3,4}};
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }

        visited = new boolean[n];
        dfs(adj, 0);   // 0 1 3 2 4
    }
}` },
        { t: 'h', text: '案例：图的 BFS 遍历' },
        { t: 'p', text: '**案例问题**：用 BFS 遍历一个无向图，打印访问顺序。' },
        { t: 'code', title: '图的 BFS 遍历', code: `import java.util.*;

public class GraphBFS {
    public static void bfs(List<List<Integer>> adj, int start) {
        boolean[] visited = new boolean[adj.size()];
        Queue<Integer> q = new ArrayDeque<>();
        q.offer(start);
        visited[start] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            System.out.print(u + " ");
            for (int v : adj.get(u)) {
                if (!visited[v]) { visited[v] = true; q.offer(v); }
            }
        }
    }

    public static void main(String[] args) {
        int n = 5;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[][] edges = {{0,1},{0,2},{1,3},{2,3},{3,4}};
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        bfs(adj, 0); // 0 1 2 3 4
    }
}` },
        { t: 'why', items: [
          'BFS 用队列先入先出，按「离起点由近到远」的顺序访问，和 DFS 的深入优先相反。',
          '入队时就标记 visited：如果出队才标记，同一个节点可能被重复入队多次。',
          'q.offer(start) 先放起点，visited[start] = true 初始化。',
          'BFS 的访问顺序天然是「层序」，适合求无权图最短路径。'
        ] },
        { t: 'why', items: [
          'visited 数组标记已访问：图可能有环，不标记会重复访问甚至死循环。',
          '进入递归前就 visited[u] = true，再遍历邻居，避免重复入栈。',
          '无向图加边要在两个顶点各加一次（addEdge 里加两次），漏加会导致遍历结果不完整。',
          '图不连通时，要对每个未访问的顶点都启动一次 DFS，才能遍历完所有连通分量。'
        ] },
        { t: 'info', text: '**思路与复杂度**：图可能成环，DFS/BFS 必须用 visited 数组标记已访问，否则死循环。无向图加边要加两次。时间 O(V + E)。图不连通时要对每个未访问顶点都启动一次遍历。' },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '忘记访问标记', d: '图可能有环，DFS/BFS 不标记 visited 会重复访问甚至死循环。' },
          { t: '无向图加边加两次', d: '无向图的边要在两个顶点都加一次，漏加导致遍历结果错误。' },
          { t: '邻接矩阵 vs 邻接表', d: '稠密图（边多）用矩阵，稀疏图用邻接表；选错会超时或超内存。' },
          { t: '遍历所有连通分量', d: '图可能不连通，要 for 循环对每个未访问的顶点都启动一次遍历。' },
          { t: '有向图方向', d: '依赖关系里边的方向（谁依赖谁）要看清楚，方向反了拓扑排序就错。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '岛屿数量', diff: 'medium', note: '网格图 DFS/BFS' },
          { name: '克隆图', diff: 'medium', note: 'DFS/BFS + 哈希映射' },
          { name: '课程表', diff: 'medium', note: '有向图 + 环检测' },
          { name: '网络延迟时间', diff: 'medium', note: 'Dijkstra 最短路径' },
          { name: '岛屿的最大面积', diff: 'medium', note: '图连通块面积' }
        ]}
      ]
    },
    {
      id: 's2',
      title: '9.2 并查集',
      short: '并查集',
      minutes: 50,
      blocks: [
        { t: 'h', text: '概念：合并 + 查询所属集合' },
        { t: 'p', text: '并查集（Union-Find）维护若干**不相交集合**，支持两个操作：**find**（找某元素属于哪个集合，用根节点代表）和 **union**（把两个集合合并）。它用「树」组织，配合**路径压缩**和**按秩合并**，单次操作接近 O(1)。' },
        { t: 'code', title: '并查集模板（路径压缩 + 按秩合并）', code: `public class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;  // 初始各自为根
    }

    public int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);  // 路径压缩
        return parent[x];
    }

    public void union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return;                  // 已经在同一集合
        if (rank[rx] < rank[ry]) parent[rx] = ry;
        else if (rank[rx] > rank[ry]) parent[ry] = rx;
        else { parent[ry] = rx; rank[rx]++; }  // 按秩合并
    }

    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}` },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '判断两个节点是否连通（省份数量、朋友圈）',
          '检测无向图中的环（冗余连接）',
          '动态连通性：逐步加边、判断连通',
          '最小生成树 Kruskal 算法的辅助结构',
          '网格上的连通块（岛屿数量）'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'p', text: '**案例问题**：n 个城市，isConnected[i][j]=1 表示 i、j 直接相连，相连城市组成一个省份，求省份数量。 ' },
        { t: 'code', title: '省份数量（连通分量个数）', code: `public class Provinces {
    public static int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        UnionFind uf = new UnionFind(n);
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (isConnected[i][j] == 1) uf.union(i, j);
            }
        }
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (uf.find(i) == i) count++;   // 根节点数 = 集合数
        }
        return count;
    }

    public static void main(String[] args) {
        int[][] m = {{1,1,0},{1,1,0},{0,0,1}};
        System.out.println(findCircleNum(m)); // 2
    }
}` },
        { t: 'why', items: [
          '并查集把相连城市合并到同一集合，最后集合的个数（根节点数）就是省份数。',
          'find 带路径压缩 parent[x] = find(parent[x])：把沿途节点直接指向根，摊还后接近 O(1)。',
          '统计根节点用 find(i) == i：路径压缩后 parent[i] 不一定直接是根，必须用 find(i) 判断。',
          'union 时先 find 再合并，rx == ry 时跳过，避免重复合并。'
        ] },
        { t: 'info', text: '**思路与复杂度**：并查集把相连城市合并到同一集合，集合数（根节点个数，即 find(i) == i 的个数）就是省份数。find 带路径压缩、union 按秩合并，单次操作接近 O(α(n))。统计根一定要用 find(i)，别直接用 parent[i]。' },
        { t: 'code', title: '冗余连接：找到使图成环的最后一条边', code: `public class RedundantConnection {
    public static int[] findRedundantConnection(int[][] edges) {
        int n = edges.length;
        UnionFind uf = new UnionFind(n + 1);
        for (int[] e : edges) {
            if (uf.connected(e[0], e[1])) return e;  // 已连通，这条边就是多余的
            uf.union(e[0], e[1]);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[][] edges = {{1,2},{1,3},{2,3}};
        int[] r = findRedundantConnection(edges);
        System.out.println(r[0] + " " + r[1]); // 2 3
    }
}` },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: 'find 没做路径压缩', d: '不压缩路径，find 最坏退化成 O(n) 链；写 parent[x] = find(parent[x])。' },
          { t: 'union 不按秩', d: '不按秩合并树可能退化成链；按 rank 决定谁挂到谁下面。' },
          { t: '下标偏移', d: '题目节点编号从 1 开始时，并查集要开 n+1 大小，别用 0 号。' },
          { t: '统计集合数', d: '统计「根节点个数」（find(i) == i）而不是遍历 parent，路径压缩后 parent 可能不是根。' },
          { t: '忘了先 find 再比较', d: '判断是否同集合要用 find(x) == find(y)，直接比 parent[x] 会出错（父节点不一定就是根）。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '省份数量', diff: 'medium', note: '并查集统计连通分量' },
          { name: '冗余连接', diff: 'medium', note: '并查集检测环' },
          { name: '岛屿数量（并查集版）', diff: 'medium', note: '网格并查集' },
          { name: '等式方程的可满足性', diff: 'medium', note: '先合并 == 再查 !=' },
          { name: '连通网络的操作次数', diff: 'medium', note: '连通分量 + 多余边' }
        ]}
      ]
    },
    {
      id: 's3',
      title: '9.3 拓扑排序',
      short: '拓扑排序',
      minutes: 50,
      blocks: [
        { t: 'h', text: '概念：有向无环图的线性排序' },
        { t: 'p', text: '拓扑排序把**有向无环图（DAG）**的所有顶点排成一个线性序列，使得每条边的起点都在终点前面。它描述的是「依赖 / 先后」关系。常用 **Kahn 算法**（BFS + 入度）：不断取出**入度为 0** 的节点，删除它的出边。若最后还有节点没被访问，说明图有环。' },
        { t: 'p', text: '**案例问题**：numCourses 门课，prerequisites[i]=[a,b] 表示先修 b 才能修 a，判断能否修完所有课（图是否无环）。 ' },
        { t: 'code', title: '课程表（Kahn 算法 + 环检测）', code: `import java.util.*;

public class CourseSchedule {
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        // 邻接表 + 入度
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indegree = new int[numCourses];
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);   // 先修 p[1] 再修 p[0]
            indegree[p[0]]++;
        }
        // 入度为 0 的入队
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) q.offer(i);
        }
        int visited = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            visited++;
            for (int v : adj.get(u)) {
                indegree[v]--;
                if (indegree[v] == 0) q.offer(v);
            }
        }
        return visited == numCourses;   // 有环则访问不完
    }

    public static void main(String[] args) {
        System.out.println(canFinish(2, new int[][]{{1, 0}}));        // true
        System.out.println(canFinish(2, new int[][]{{1, 0}, {0, 1}})); // false（有环）
    }
}` },
        { t: 'h', text: '案例：课程表 II（输出拓扑序）' },
        { t: 'p', text: '**案例问题**：给定课程数和先修关系，返回一种合法的修课顺序（拓扑排序）；若有环返回空数组。' },
        { t: 'code', title: '课程表 II（输出拓扑序）', code: `import java.util.*;

public class CourseScheduleII {
    public static int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indegree = new int[numCourses];
        for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); indegree[p[0]]++; }

        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.offer(i);

        int[] order = new int[numCourses];
        int idx = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            order[idx++] = u;                    // 记录拓扑序
            for (int v : adj.get(u)) {
                if (--indegree[v] == 0) q.offer(v);
            }
        }
        return idx == numCourses ? order : new int[0]; // 有环返回空
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(findOrder(4, new int[][]{{1,0},{2,0},{3,1},{3,2}})));
    }
}` },
        { t: 'why', items: [
          '和「课程表」一样用 Kahn 算法，只是这次把弹出的节点按顺序记录到 order 数组。',
          'order[idx++] = u：出队的顺序就是拓扑序。',
          'return idx == numCourses ? order : new int[0]：有环时 idx < numCourses，返回空数组表示无解。',
          '拓扑序不唯一，返回任意一种合法顺序即可。'
        ] },
        { t: 'why', items: [
          'Kahn 算法：不断取出入度为 0 的节点（没有前置依赖），删掉它的出边，邻居入度减 1。',
          '边的方向：先修 b 再修 a，所以边是 b -> a（adj.get(p[1]).add(p[0])），别建反。',
          '入度变 0 才入队：只有没有任何前置依赖的课才能被修。',
          '最后 visited == numCourses 判无环：有环时总有一部分节点的入度永远不为 0，访问不完。'
        ] },
        { t: 'info', text: '**思路与复杂度**：Kahn 算法：不断取出入度为 0 的节点并删除其出边。若最终访问的节点数 != 总数，说明有环（无法拓扑排序）。时间 O(V + E)。边的方向要看清楚：先修 b 再修 a，则边是 b -> a。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '课程安排：判断能否修完所有课，给出选课顺序',
          '任务调度：编译依赖、构建系统（如 Make、Gradle）',
          '检测有向图是否有环',
          '确定依赖关系的执行顺序'
        ]},
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '边的方向', d: 'prerequisites[i] = [a, b] 表示先修 b 再修 a，所以边是 b -> a（b 指向 a），别建反。' },
          { t: '入度更新', d: '取出节点后要把它所有邻居的入度减 1，入度变 0 才能入队。' },
          { t: '环检测', d: '最后 visited != 节点总数说明有环（无法拓扑排序），要返回 false 或空。' },
          { t: '入度为 0 的初始集合', d: '要先找出所有初始入度为 0 的节点入队，漏掉就排不完整。' },
          { t: '拓扑排序结果不唯一', d: 'DAG 的拓扑序可能不止一种，只要满足先后关系即可。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '课程表', diff: 'medium', note: '检测能否完成（有无环）' },
          { name: '课程表 II', diff: 'medium', note: '输出一种拓扑序' },
          { name: '课程表 IV', diff: 'medium', note: '查询是否有依赖关系' },
          { name: '外星文字典', diff: 'hard', note: '从单词顺序建图 + 拓扑' },
          { name: '重新安排行程', diff: 'hard', note: '欧拉路径（Hierholzer）' }
        ]}
      ]
    }
  ],
  quiz: [
    { q: '图的邻接表表示，遍历某个顶点的所有邻居的复杂度是？', options: ['O(1)', 'O(该顶点的度数)', 'O(V)', 'O(V^2)'], answer: 1, explain: '邻接表存的就是邻居列表，遍历邻居 O(度)。' },
    { q: '并查集中「路径压缩」的作用是？', options: ['压缩存储空间', '让 find 更快接近 O(1)', '合并两个集合', '排序元素'], answer: 1, explain: '路径压缩把沿途节点直接指向根，摊还后 find 接近 O(1)。' },
    { q: '拓扑排序要求图是？', options: ['任意图', '有向无环图 DAG', '无向连通图', '完全图'], answer: 1, explain: '拓扑排序只对 DAG 有意义；有环的图无法拓扑排序。' },
    { q: 'Kahn 算法（BFS 拓扑排序）每次取出什么节点？', options: ['出度为 0 的', '入度为 0 的', '度数最大的', '随机'], answer: 1, explain: '不断取入度为 0 的节点（没有依赖），删掉它的出边，直到全部处理完。' }
  ],
  exercises: [
    {
      id: 'ex-c9-1',
      title: '练习 1：省份数量（并查集）',
      level: '中等',
      brief: '有 n 个城市，isConnected[i][j]=1 表示城市 i 和 j 直接相连。相连的城市组成一个省份，求省份数量。',
      requirements: [
        '类名 Provinces，方法 findCircleNum(int[][] isConnected)',
        '用并查集：find 带路径压缩，union 合并',
        '统计根节点个数（find(i) == i）',
        'main 测试返回 2'
      ],
      starter: `public class Provinces {
    public int findCircleNum(int[][] isConnected) {
        // TODO: 用并查集统计省份
        return 0;
    }

    public static void main(String[] args) {
        Provinces p = new Provinces();
        int[][] m = {{1,1,0},{1,1,0},{0,0,1}};
        System.out.println(p.findCircleNum(m)); // 2
    }
}`,
      expectedOutput: '2',
      keyPoints: [
        { label: '定义 parent 数组', test: /parent/ },
        { label: 'find 方法带路径压缩', test: /find\s*\(|parent\[[^\]]*\]\s*=\s*find/ },
        { label: 'union 合并两个集合', test: /union\s*\(|void\s+union/ },
        { label: '统计根节点个数', test: /find\(i\)\s*==\s*i|count\s*\+\+/ }
      ],
      hints: [
        '写一个内部类 UnionFind（parent 数组 + find + union）',
        '双重循环，isConnected[i][j]==1 就 union(i, j)',
        '最后数 find(i) == i 的个数'
      ],
      analysis: '把相连的城市合并到同一集合，最后集合的个数（根节点数）就是省份数量。并查集 find 带路径压缩、union 按秩合并，接近 O(n^2 * α(n))。',
      solution: `public class Provinces {
    private int[] parent;

    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (isConnected[i][j] == 1) union(i, j);
            }
        }
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (find(i) == i) count++;
        }
        return count;
    }

    private int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    private void union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx != ry) parent[ry] = rx;
    }

    public static void main(String[] args) {
        Provinces p = new Provinces();
        int[][] m = {{1,1,0},{1,1,0},{0,0,1}};
        System.out.println(p.findCircleNum(m)); // 2
    }
}`
    },
    {
      id: 'ex-c9-2',
      title: '练习 2：课程表（拓扑排序检测环）',
      level: '中等',
      brief: '有 numCourses 门课，prerequisites[i] = [a, b] 表示必须先修 b 才能修 a。判断能否修完所有课程（即图无环）。',
      requirements: [
        '类名 CourseSchedule，方法 canFinish(int numCourses, int[][] prerequisites)',
        '构建邻接表 + 入度数组',
        'Kahn 算法：入度为 0 入队，BFS 处理',
        '最后判断 visited == numCourses',
        'main 测试有环和无环两种情况'
      ],
      starter: `import java.util.*;

public class CourseSchedule {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // TODO: 拓扑排序检测环
        return false;
    }

    public static void main(String[] args) {
        CourseSchedule c = new CourseSchedule();
        System.out.println(c.canFinish(2, new int[][]{{1, 0}}));        // true
        System.out.println(c.canFinish(2, new int[][]{{1, 0}, {0, 1}})); // false
    }
}`,
      expectedOutput: 'true\nfalse',
      keyPoints: [
        { label: '构建邻接表 adj', test: /List\s*<List|ArrayList\s*<ArrayList|adj/ },
        { label: '统计入度 indegree', test: /indegree/ },
        { label: '入度为 0 入队', test: /indegree\[i\]\s*==\s*0/ },
        { label: '用 Queue BFS', test: /Queue\s*<|ArrayDeque/ },
        { label: '判断 visited == numCourses', test: /visited\s*==\s*numCourses/ }
      ],
      hints: [
        'adj 建 numCourses 个空列表，indegree 统计入度',
        '每条边 p：adj.get(p[1]).add(p[0])，indegree[p[0]]++',
        '入度为 0 的入队，while 弹出，邻居入度减 1，变 0 入队',
        '返回 visited == numCourses'
      ],
      analysis: 'Kahn 算法：不断删除入度为 0 的课程（没有前置依赖），并更新其后续课程的入度。若所有课程都能被删除（visited == numCourses）说明无环可修完，否则有环。时间 O(V + E)。',
      solution: `import java.util.*;

public class CourseSchedule {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indegree = new int[numCourses];
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            indegree[p[0]]++;
        }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) q.offer(i);
        }
        int visited = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            visited++;
            for (int v : adj.get(u)) {
                indegree[v]--;
                if (indegree[v] == 0) q.offer(v);
            }
        }
        return visited == numCourses;
    }

    public static void main(String[] args) {
        CourseSchedule c = new CourseSchedule();
        System.out.println(c.canFinish(2, new int[][]{{1, 0}}));        // true
        System.out.println(c.canFinish(2, new int[][]{{1, 0}, {0, 1}})); // false
    }
}`
    },
    {
      id: 'ex-c9-3',
      title: '练习 3：冗余连接',
      level: '中等',
      brief: '一棵树有 n 个节点，多了一条边后变成有环的图。给定 edges（每边连接两个节点），找出使图成环的那条多余边（若有多个答案返回最后出现的）。',
      requirements: [
        '类名 RedundantConnection，方法 findRedundantConnection(int[][] edges)',
        '用并查集，先判断是否已连通再 union',
        '已连通说明当前边多余，直接返回',
        'main 测试 {{1,2},{1,3},{2,3}} 返回 2 3'
      ],
      starter: `public class RedundantConnection {
    public int[] findRedundantConnection(int[][] edges) {
        // TODO: 并查集检测环
        return new int[]{};
    }

    public static void main(String[] args) {
        RedundantConnection r = new RedundantConnection();
        int[] ans = r.findRedundantConnection(new int[][]{{1,2},{1,3},{2,3}});
        System.out.println(ans[0] + " " + ans[1]); // 2 3
    }
}`,
      expectedOutput: '2 3',
      keyPoints: [
        { label: '定义 parent / find / union', test: /find\s*\(|union\s*\(|parent/ },
        { label: '遍历每条边', test: /for\s*\(int\[\]\s*e\s*:\s*edges/ },
        { label: '判断是否已连通', test: /connected|find\([^)]*\)\s*==\s*find/ },
        { label: '返回多余边', test: /return\s+e|return\s+new\s+int\[\]\s*\{e/ }
      ],
      hints: [
        '并查集大小 n + 1（节点从 1 开始）',
        '遍历每条边 e：若 find(e[0]) == find(e[1]) 说明已连通，返回 e',
        '否则 union(e[0], e[1])'
      ],
      analysis: '树是无环连通图，加一条边必然成环。按顺序加边，若某条边的两个端点已经连通，说明这条边就是形成环的那条（多余的）。并查集判断连通 + 合并，时间 O(n * α(n))。',
      solution: `public class RedundantConnection {
    private int[] parent;

    public int[] findRedundantConnection(int[][] edges) {
        int n = edges.length;
        parent = new int[n + 1];
        for (int i = 1; i <= n; i++) parent[i] = i;
        for (int[] e : edges) {
            if (find(e[0]) == find(e[1])) return e;
            union(e[0], e[1]);
        }
        return new int[]{};
    }

    private int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    private void union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx != ry) parent[ry] = rx;
    }

    public static void main(String[] args) {
        RedundantConnection r = new RedundantConnection();
        int[] ans = r.findRedundantConnection(new int[][]{{1,2},{1,3},{2,3}});
        System.out.println(ans[0] + " " + ans[1]); // 2 3
    }
}`
    }
  ]
});
