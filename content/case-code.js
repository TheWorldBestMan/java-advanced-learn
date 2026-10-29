/* 每个案例都生成独立、可直接 javac / java 运行的完整程序。 */
(function () {
  'use strict';
  var snippets = {};
  var J = String.raw;
  function add(key, body, helpers, output) {
    var parts = key.split('/');
    var name = 'Case' + parts.map(function (p) { return p.toUpperCase(); }).join('');
    snippets[key] = {
      code: 'import java.util.*;\nimport java.util.concurrent.*;\n\npublic class ' + name + ' {\n'
        + (helpers || '') + '\n    public static void main(String[] args) throws Exception {\n' + body + '\n    }\n}',
      output: output
    };
  }
  var node = J`    static class Node {
        int value; Node next;
        Node(int value) { this.value = value; }
    }
    static Node chain(int... values) {
        Node dummy = new Node(0), tail = dummy;
        for (int value : values) { tail.next = new Node(value); tail = tail.next; }
        return dummy.next;
    }
    static String show(Node head) {
        List<Integer> values = new ArrayList<>();
        for (Node p = head; p != null; p = p.next) values.add(p.value);
        return values.toString();
    }`;
  var tree = J`    static class Tree {
        int value; Tree left, right;
        Tree(int value) { this.value = value; }
    }
    static Tree sampleTree() {
        Tree root = new Tree(1);
        root.left = new Tree(2); root.right = new Tree(3);
        root.left.left = new Tree(4); root.left.right = new Tree(5);
        return root;
    }`;
  var reverse = J`    static Node reverse(Node head) {
        Node prev = null, cur = head;
        while (cur != null) {
            Node next = cur.next; // 先保存后继，否则改指针后会丢失剩余链表
            cur.next = prev;
            prev = cur; cur = next;
        }
        return prev;
    }`;
  add('c1/s1/1', J`        int[] scores = new int[40];
        scores[17] = 92;
        System.out.println(scores[17]); // 下标 17 表示第 18 个元素，读取 O(1)
        scores[4] = 85;
        System.out.println(scores[4]);`, '', '92\n85');
  add('c1/s1/2', J`        List<String> cart = new ArrayList<>();
        cart.add("book"); cart.add("pen"); cart.add("cup");
        cart.add("bag"); // 尾部追加，容量不足时 ArrayList 自动扩容
        System.out.println(cart);`, '', '[book, pen, cup, bag]');
  add('c1/s1/3', J`        char[][] board = new char[3][3];
        for (char[] row : board) Arrays.fill(row, '.');
        board[1][2] = 'X'; // 第 2 行第 3 列：行列下标都要减 1
        for (char[] row : board) System.out.println(new String(row));`, '', '...\n..X\n...');
  add('c1/s1/4', J`        int[] count = new int[26];
        for (char c : "banana".toCharArray()) count[c - 'a']++;
        for (int i = 0; i < count.length; i++) {
            if (count[i] > 0) System.out.println((char) ('a' + i) + "=" + count[i]);
        } // 仅适用于 a~z；任意字符不能直接减 'a'`, '', 'a=3\nb=1\nn=2');
  add('c1/s1/5', J`        int[] a = {1, 2, 3, 4};
        int left = 0, right = a.length - 1;
        while (left < right) {
            int sum = a[left] + a[right];
            if (sum == 5) { System.out.println(a[left] + "+" + a[right]); break; }
            if (sum < 5) left++; else right--; // 数组有序才能这样缩小范围
        }
        int[] b = {2, 4, 6}, pre = new int[b.length + 1];
        for (int i = 0; i < b.length; i++) pre[i + 1] = pre[i] + b[i];
        System.out.println(pre[3] - pre[1]); // 查询闭区间 [1,2]`, '', '1+4\n10');
  add('c1/s2/1', J`        String log = "ERROR|2026-10-17|timeout";
        String[] fields = log.split("\\|", -1); // 竖线是正则符号，需转义；-1 保留末尾空字段
        if (fields.length != 3) throw new IllegalArgumentException("字段数不正确");
        System.out.println(Arrays.toString(fields));
        StringBuilder report = new StringBuilder();
        report.append(fields[0]).append(": ").append(fields[2]);
        System.out.println(report);`, '', '[ERROR, 2026-10-17, timeout]\nERROR: timeout');
  add('c1/s2/2', J`        String s = "level";
        int left = 0, right = s.length() - 1;
        boolean palindrome = true;
        while (left < right) {
            if (s.charAt(left++) != s.charAt(right--)) { palindrome = false; break; }
        }
        System.out.println(palindrome); // 双指针 O(n) 时间、O(1) 额外空间
        System.out.println("ababc".indexOf("bab"));`, '', 'true\n1');
  add('c1/s2/3', J`        List<String> words = Arrays.asList("cat", "dog", "cat");
        Set<String> unique = new LinkedHashSet<>(words); // 保持插入顺序，方便观察结果
        Map<String, Integer> count = new TreeMap<>();
        for (String word : words) count.merge(word, 1, Integer::sum);
        System.out.println(unique);
        System.out.println(count);`, '', '[cat, dog]\n{cat=2, dog=1}');
  add('c1/s2/4', J`        String input = "42";
        int value = Integer.parseInt(input);
        String text = String.valueOf(value);
        System.out.println(value + 1); // 数字相加
        System.out.println(text + "1"); // 字符串拼接
        // 外部输入可能非法；parseInt 遇到非数字或溢出会抛 NumberFormatException`, '', '43\n421');
  add('c1/s2/5', J`        String s = "java,go";
        System.out.println(s.length());
        System.out.println(s.charAt(0));
        System.out.println(s.substring(0, 4)); // [0,4)，不包含下标 4
        System.out.println(s.indexOf("go"));
        System.out.println(Arrays.toString(s.split(",")));`, '', '7\nj\njava\n5\n[java, go]');
  add('c1/s3/1', J`        // accessOrder=true：get 也会把访问项移到最近使用的一端
        Map<String, Integer> cache = new LinkedHashMap<String, Integer>(4, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<String, Integer> eldest) {
                return size() > 3;
            }
        };
        cache.put("A", 1); cache.put("B", 2); cache.put("C", 3);
        cache.get("A");
        System.out.println(cache.keySet()); // A 已移到最近使用端
        cache.put("D", 4);
        System.out.println(cache.keySet()); // 淘汰最久未使用的 B`, '', '[B, C, A]\n[C, A, D]');
  add('c1/s3/2', J`        Deque<Integer> queue = new LinkedList<>();
        queue.offer(1); queue.offer(2);
        System.out.println(queue.poll()); // 队列先进先出
        Deque<Integer> stack = new LinkedList<>();
        stack.push(1); stack.push(2);
        System.out.println(stack.pop()); // 栈后进先出`, '', '1\n2');
  add('c1/s3/3', J`        Node dummy = new Node(0), tail = dummy;
        for (int reading : new int[]{12, 15, 14}) {
            tail.next = new Node(reading); // 总量未知，逐个创建节点
            tail = tail.next; // 保留尾指针，单次尾插 O(1)
        }
        System.out.println(show(dummy.next));`, node, '[12, 15, 14]');
  add('c1/s3/4', J`        System.out.println(show(reverse(chain(1, 2, 3))));
        Node a = chain(1, 2, 3);
        a.next.next.next = a.next; // 让尾节点回到旧节点 2
        Node slow = a, fast = a;
        boolean cycle = false;
        while (fast != null && fast.next != null) {
            slow = slow.next; fast = fast.next.next;
            if (slow == fast) { cycle = true; break; }
        }
        System.out.println(cycle);`, node + '\n' + reverse, '[3, 2, 1]\ntrue');

  var brackets = J`    static boolean valid(String text) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : text.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') stack.push(c);
            else {
                if (stack.isEmpty()) return false;
                char left = stack.pop();
                if ((c == ')' && left != '(') || (c == ']' && left != '[')
                    || (c == '}' && left != '{')) return false;
            }
        }
        return stack.isEmpty(); // 多余左括号也不合法
    }
    static int rpn(String... tokens) {
        Deque<Integer> values = new ArrayDeque<>();
        for (String token : tokens) {
            if (Arrays.asList("+", "-", "*", "/").contains(token)) {
                int right = values.pop(), left = values.pop(); // 先弹的是右操作数
                switch (token) {
                    case "+": values.push(left + right); break;
                    case "-": values.push(left - right); break;
                    case "*": values.push(left * right); break;
                    default: values.push(left / right);
                }
            } else values.push(Integer.parseInt(token));
        }
        return values.pop();
    }
    static void callA() { System.out.println("enter a"); callB(); System.out.println("return a"); }
    static void callB() { System.out.println("enter b"); System.out.println("return b"); }`;
  add('c2/s1/1', J`        System.out.println(valid("{[()]}"));
        System.out.println(valid("([)]"));
        System.out.println(rpn("2", "3", "+", "4", "*"));
        callA(); // b 的调用帧后入栈，所以 b 先返回`, brackets, 'true\nfalse\n20\nenter a\nenter b\nreturn b\nreturn a');
  add('c2/s1/2', J`        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B", "C")); graph.put("B", Arrays.asList("D"));
        Deque<List<String>> stack = new ArrayDeque<>();
        stack.push(Arrays.asList("A"));
        while (!stack.isEmpty()) {
            List<String> path = stack.pop();
            String current = path.get(path.size() - 1);
            if (current.equals("D")) { System.out.println(path); break; }
            List<String> neighbors = graph.getOrDefault(current, Collections.emptyList());
            for (int i = neighbors.size() - 1; i >= 0; i--) { // 逆序压栈，让 B 先出栈
                String next = neighbors.get(i);
                if (path.contains(next)) continue; // 避免当前路径内成环
                List<String> extended = new ArrayList<>(path);
                extended.add(next); stack.push(extended);
            }
        }`, '', '[A, B, D]');
  add('c2/s1/3', J`        Deque<String> back = new ArrayDeque<>(), forward = new ArrayDeque<>();
        String current = "A";
        back.push(current); current = "B"; forward.clear();
        back.push(current); current = "C"; forward.clear();
        forward.push(current); current = back.pop(); // 后退前保存当前页面
        System.out.println(current);
        back.push(current); current = forward.pop(); // 前进是反向移动
        System.out.println(current);
        Deque<String> undo = new ArrayDeque<>(), redo = new ArrayDeque<>();
        String text = "猫";
        undo.push(text); text += "狗"; redo.clear(); // 新编辑清空重做分支
        redo.push(text); text = undo.pop();
        System.out.println(text);
        undo.push(text); text = redo.pop();
        System.out.println(text);`, '', 'B\nC\n猫\n猫狗');
  var nextElement = J`    static int[] next(int[] a, boolean greater) {
        int[] answer = new int[a.length]; Arrays.fill(answer, -1);
        Deque<Integer> pending = new ArrayDeque<>(); // 存下标，保留位置关系
        for (int i = 0; i < a.length; i++) {
            while (!pending.isEmpty() && (greater ? a[i] > a[pending.peek()] : a[i] < a[pending.peek()])) {
                answer[pending.pop()] = a[i]; // 当前元素是被弹项右边首个符合条件的值
            }
            pending.push(i); // 每个下标至多进出栈一次，总时间 O(n)
        }
        return answer;
    }`;
  add('c2/s1/4', J`        System.out.println(Arrays.toString(next(new int[]{2,1,2,4,3}, true)));
        System.out.println(Arrays.toString(next(new int[]{3,1,2}, false)));`, nextElement, '[4, 2, 4, -1, -1]\n[1, -1, -1]');
  add('c2/s1/5', J`        Deque<String> tags = new ArrayDeque<>();
        boolean validTags = true;
        for (String tag : new String[]{"b", "i", "/i", "/b"}) {
            if (!tag.startsWith("/")) tags.push(tag);
            else if (tags.isEmpty() || !tags.pop().equals(tag.substring(1))) { validTags = false; break; }
        } // 演示简化标签流，不是完整 HTML 解析器
        System.out.println(validTags && tags.isEmpty());
        String s = "level";
        Deque<Character> left = new ArrayDeque<>();
        for (int i = 0; i < s.length()/2; i++) left.push(s.charAt(i));
        boolean palindrome = true;
        for (int i = (s.length()+1)/2; i < s.length(); i++) {
            if (left.pop() != s.charAt(i)) { palindrome = false; break; }
        }
        System.out.println(palindrome);`, '', 'true\ntrue');
  var maze = J`    static int shortest(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        int[][] distance = new int[rows][cols];
        for (int[] row : distance) Arrays.fill(row, -1);
        Queue<int[]> q = new ArrayDeque<>(); q.offer(new int[]{0,0}); distance[0][0] = 0;
        int[][] directions = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] p = q.poll();
            if (p[0] == rows-1 && p[1] == cols-1) return distance[p[0]][p[1]];
            for (int[] d : directions) {
                int r = p[0]+d[0], c = p[1]+d[1];
                if (r<0 || r>=rows || c<0 || c>=cols || grid[r][c]==1 || distance[r][c]!=-1) continue;
                distance[r][c] = distance[p[0]][p[1]]+1; // 入队就标记，防止重复入队
                q.offer(new int[]{r,c});
            }
        }
        return -1;
    }`;
  var levels = J`    static List<List<Integer>> levels(Tree root) {
        List<List<Integer>> answer = new ArrayList<>();
        if (root == null) return answer;
        Queue<Tree> queue = new ArrayDeque<>(); queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size(); // 必须先固定本层长度，不能边入队边改变循环界限
            List<Integer> row = new ArrayList<>();
            for (int i=0; i<size; i++) {
                Tree cur = queue.poll(); row.add(cur.value);
                if (cur.left != null) queue.offer(cur.left);
                if (cur.right != null) queue.offer(cur.right);
            }
            answer.add(row);
        }
        return answer;
    }`;
  var windowMax = J`    static int[] maxWindow(int[] a, int k) {
        int[] result = new int[a.length-k+1]; Deque<Integer> q = new ArrayDeque<>();
        for (int i=0; i<a.length; i++) {
            while (!q.isEmpty() && q.peekFirst() <= i-k) q.pollFirst(); // 下标过期
            while (!q.isEmpty() && a[q.peekLast()] <= a[i]) q.pollLast(); // 淘汰较小候选
            q.offerLast(i);
            if (i>=k-1) result[i-k+1] = a[q.peekFirst()];
        }
        return result;
    }`;
  add('c2/s2/1', J`        int[][] grid = {{0,0},{1,0}}; // 0 可走，1 是墙；左上到右下
        System.out.println(shortest(grid));`, maze, '2');
  add('c2/s2/2', J`        BlockingQueue<String> jobs = new LinkedBlockingQueue<>();
        jobs.put("A"); jobs.put("B"); // 生产者先后加入任务
        System.out.println(jobs.take());
        System.out.println(jobs.take()); // 实际多线程可共享队列；take 会等待新任务`, '', 'A\nB');
  add('c2/s2/3', J`        Tree root = new Tree(1); root.left = new Tree(2); root.right = new Tree(3);
        System.out.println(levels(root));`, tree + '\n' + levels, '[[1], [2, 3]]');
  add('c2/s2/4', J`        System.out.println(Arrays.toString(maxWindow(new int[]{1,3,-1,-3,5}, 3)));`, windowMax, '[3, 3, 5]');
  add('c2/s2/5', J`        Queue<String> printQueue = new ArrayDeque<>();
        printQueue.offer("报告"); printQueue.offer("合同"); printQueue.offer("照片");
        while (!printQueue.isEmpty()) System.out.println(printQueue.poll()); // 从队头逐项消费`, '', '报告\n合同\n照片');
  add('c2/s3/1', J`        List<String> words = Arrays.asList("a", "b", "a");
        Set<String> distinct = new LinkedHashSet<>(words);
        Map<String,Integer> count = new TreeMap<>();
        Map<Character,List<String>> groups = new TreeMap<>();
        for (String word : words) {
            count.merge(word, 1, Integer::sum);
            groups.computeIfAbsent(word.charAt(0), key -> new ArrayList<>()).add(word);
        }
        System.out.println(distinct); System.out.println(count); System.out.println(groups);`, '', '[a, b]\n{a=2, b=1}\n{a=[a, a], b=[b]}');
  add('c2/s3/2', J`        int[] a = {2,7,11}; int target = 9;
        Map<Integer,Integer> seen = new HashMap<>();
        for (int i=0; i<a.length; i++) {
            int need = target-a[i];
            if (seen.containsKey(need)) { System.out.println(Arrays.toString(new int[]{seen.get(need),i})); break; }
            seen.put(a[i], i); // 先查后存，避免把当前元素使用两次
        }`, '', '[0, 1]');
  add('c2/s3/3', J`        Map<String,Integer> cache = new LinkedHashMap<String,Integer>(4,0.75f,true) {
            protected boolean removeEldestEntry(Map.Entry<String,Integer> e) { return size()>2; }
        };
        cache.put("A",1); cache.put("B",2); cache.put("C",3);
        System.out.println(cache.keySet()); // 没有再次访问 A，所以容量超限时淘汰 A`, '', '[B, C]');
  add('c2/s3/4', J`        Set<Integer> ids = new HashSet<>();
        for (int id=0; id<100000; id++) ids.add(id);
        System.out.println(ids.contains(731)); // 预处理 O(n)，之后每次查询平均 O(1)
        System.out.println(ids.contains(100001));`, '', 'true\nfalse');

  add('c3/s1/1', J`        int[] a={1,2,4,7}; int left=0, right=a.length-1;
        while(left<right) {
            int sum=a[left]+a[right];
            if(sum==9) { System.out.println(a[left]+"+"+a[right]); break; }
            if(sum<9) left++; else right--; // 利用有序性，一次排除一个端点
        }`, '', '2+7');
  add('c3/s1/2', J`        int[] a={0,1,0,3}; int write=0;
        for(int read=0; read<a.length; read++) {
            if(a[read]!=0) a[write++]=a[read]; // write 指向下一个非零元素写入位置
        }
        while(write<a.length) a[write++]=0;
        System.out.println(Arrays.toString(a));`, '', '[1, 3, 0, 0]');
  add('c3/s1/3', J`        Node head=chain(1,2,3,4,5), slow=head, fast=head;
        while(fast!=null && fast.next!=null) { slow=slow.next; fast=fast.next.next; }
        System.out.println(slow.value); // 快指针到尾，慢指针到中点
        slow=head; fast=head;
        for(int i=0;i<2;i++) fast=fast.next; // 先拉开 2 个节点的距离
        while(fast!=null) { slow=slow.next; fast=fast.next; }
        System.out.println(slow.value);`, node, '3\n4');
  add('c3/s1/4', J`        int[] height={1,8,6,2,5}; int left=0,right=height.length-1,best=0;
        while(left<right) {
            best=Math.max(best, Math.min(height[left],height[right])*(right-left));
            if(height[left]<height[right]) left++; else right--; // 移较短边才可能提升高度
        }
        System.out.println(best);`, '', '15');
  var minWindowSum=J`    static int minLength(int[] a,int target) {
        int left=0,sum=0,best=a.length+1;
        for(int right=0;right<a.length;right++) {
            sum+=a[right];
            while(sum>=target) { // 本方法要求非负元素，缩窗不会增加总和
                best=Math.min(best,right-left+1); sum-=a[left++];
            }
        }
        return best==a.length+1 ? 0 : best;
    }`;
  add('c3/s2/1', J`        System.out.println(minLength(new int[]{2,3,1,2,4,3},7));`, minWindowSum, '2');
  add('c3/s2/2', J`        String s="abcabcbb"; Map<Character,Integer> last=new HashMap<>();
        int left=0,best=0;
        for(int right=0;right<s.length();right++) {
            char c=s.charAt(right);
            if(last.containsKey(c)) left=Math.max(left,last.get(c)+1); // 左边界不能倒退
            last.put(c,right); best=Math.max(best,right-left+1);
        }
        System.out.println(best);`, '', '3');
  add('c3/s2/3', J`        String s="cbaebabacd", pattern="abc";
        int[] need=new int[26],window=new int[26]; List<Integer> result=new ArrayList<>();
        for(char c:pattern.toCharArray()) need[c-'a']++;
        for(int right=0;right<s.length();right++) {
            window[s.charAt(right)-'a']++;
            if(right>=pattern.length()) window[s.charAt(right-pattern.length())-'a']--; // 移出旧字符
            if(right>=pattern.length()-1 && Arrays.equals(window,need)) result.add(right-pattern.length()+1);
        }
        System.out.println(result);`, '', '[0, 6]');
  add('c3/s2/4', J`        int[] a={1,2,3,4}; int k=2,sum=0;
        List<Integer> answer=new ArrayList<>();
        for(int i=0;i<a.length;i++) {
            sum+=a[i];
            if(i>=k) sum-=a[i-k]; // 窗口右移时只调整一进一出
            if(i>=k-1) answer.add(sum);
        }
        System.out.println(answer);`, '', '[3, 5, 7]');
  add('c3/s3/1', J`        int[] a={2,4,6}, pre=new int[a.length+1];
        for(int i=0;i<a.length;i++) pre[i+1]=pre[i]+a[i]; // pre[0]=0 保留空前缀
        int left=1,right=2;
        System.out.println(pre[right+1]-pre[left]);`, '', '10');
  add('c3/s3/2', J`        int[] a={1,2,3}; int sum=0,count=0,k=3;
        Map<Integer,Integer> frequency=new HashMap<>(); frequency.put(0,1);
        for(int x:a) {
            sum+=x; count+=frequency.getOrDefault(sum-k,0); // 之前的前缀与当前前缀相减
            frequency.merge(sum,1,Integer::sum); // 查完再更新，避免空子数组
        }
        System.out.println(count);`, '', '2');
  add('c3/s3/3', J`        int[][] a={{1,2},{3,4}},pre=new int[3][3];
        for(int r=0;r<2;r++) for(int c=0;c<2;c++) {
            pre[r+1][c+1]=a[r][c]+pre[r][c+1]+pre[r+1][c]-pre[r][c];
        }
        int top=0,left=0,bottom=1,right=1;
        int sum=pre[bottom+1][right+1]-pre[top][right+1]-pre[bottom+1][left]+pre[top][left];
        System.out.println(sum); // 重叠的左上区域要加回来`, '', '10');
  add('c3/s3/4', J`        int n=5; int[] difference=new int[n+1];
        difference[1]+=2; difference[4]-=2; // 闭区间 [1,3]，结束影响的位置是 4
        int[] answer=new int[n]; int running=0;
        for(int i=0;i<n;i++) { running+=difference[i]; answer[i]=running; }
        System.out.println(Arrays.toString(answer));`, '', '[0, 2, 2, 2, 0]');
  var lowerBound=J`    static int bound(int[] a,int target,boolean upper) {
        int left=0,right=a.length; // 始终使用左闭右开区间
        while(left<right) {
            int mid=left+(right-left)/2;
            if(a[mid]<target || (upper && a[mid]==target)) left=mid+1;
            else right=mid;
        }
        return left;
    }`;
  add('c4/s1/1', J`        int[] a={1,3,3,7};
        System.out.println(bound(a,3,false)); // 第一个 >=3
        System.out.println(bound(a,3,true)-1); // 第一个 >3 的前一位
        System.out.println(bound(a,4,false)); // 插入位置`, lowerBound, '1\n2\n3');
  add('c4/s1/2', J`        int[] a={4,5,6,1,2,3}; int target=2,left=0,right=a.length-1,answer=-1;
        while(left<=right) {
            int mid=left+(right-left)/2;
            if(a[mid]==target) { answer=mid; break; }
            if(a[left]<=a[mid]) { // 左半有序
                if(a[left]<=target && target<a[mid]) right=mid-1; else left=mid+1;
            } else { // 右半有序；此示例没有重复值
                if(a[mid]<target && target<=a[right]) left=mid+1; else right=mid-1;
            }
        }
        System.out.println(answer);`, '', '4');
  var bookSplit=J`    static boolean feasible(int[] books,int people,int limit) {
        int used=1,sum=0;
        for(int pages:books) {
            if(pages>limit) return false;
            if(sum+pages>limit) { used++; sum=0; }
            sum+=pages;
        }
        return used<=people;
    }`;
  add('c4/s1/3', J`        int[] books={3,2,4,1}; int left=4,right=10;
        while(left<right) {
            int mid=left+(right-left)/2;
            if(feasible(books,2,mid)) right=mid; else left=mid+1;
        } // 可行上界越大越容易，二分寻找第一个可行值
        System.out.println(left);`, bookSplit, '5');
  add('c4/s1/4', J`        int n=20,left=1,right=n,answer=0;
        while(left<=right) {
            int mid=left+(right-left)/2;
            if(mid<=n/mid) { answer=mid; left=mid+1; } // 用除法避免 mid*mid 溢出
            else right=mid-1;
        }
        System.out.println(answer);`, '', '4');
  add('c4/s2/1', J`        int[] a={7,-4,3,1}; Arrays.sort(a);
        int left=0,right=a.length-1;
        while(left<right) {
            int sum=a[left]+a[right];
            if(sum==3) { System.out.println(a[left]+"+"+a[right]); break; }
            if(sum<3) left++; else right--;
        }`, '', '-4+7');
  add('c4/s2/2', J`        int[] scores={88,70,95,82}; Arrays.sort(scores);
        System.out.println(scores[scores.length-1]);
        System.out.println(scores[scores.length-2]); // 升序末端取前两名`, '', '95\n88');
  var mergeIntervals=J`    static List<String> merge(int[][] intervals) {
        Arrays.sort(intervals,Comparator.comparingInt(x->x[0]));
        List<String> answer=new ArrayList<>(); int start=intervals[0][0],end=intervals[0][1];
        for(int i=1;i<intervals.length;i++) {
            if(intervals[i][0]<=end) end=Math.max(end,intervals[i][1]);
            else { answer.add("["+start+", "+end+"]"); start=intervals[i][0]; end=intervals[i][1]; }
        }
        answer.add("["+start+", "+end+"]"); return answer;
    }`;
  add('c4/s2/3', J`        System.out.println(merge(new int[][]{{1,3},{2,6},{8,10}}));`, mergeIntervals, '[[1, 6], [8, 10]]');
  add('c4/s2/4', J`        List<Student> students=new ArrayList<>(Arrays.asList(new Student("张",90),new Student("李",90),new Student("王",80)));
        students.sort(Comparator.comparingInt((Student s)->s.score).reversed().thenComparing(s->s.name));
        for(Student s:students) System.out.println(s.name+":"+s.score); // 姓名按 Unicode 顺序，不是拼音`, J`    static class Student {
        String name; int score;
        Student(String name,int score) { this.name=name; this.score=score; }
    }`, '张:90\n李:90\n王:80');

  var preorder=J`    static void preorder(Tree root,List<Integer> result) {
        if(root==null) return; // 空节点是递归终止条件
        result.add(root.value); preorder(root.left,result); preorder(root.right,result);
    }`;
  var mergeSort=J`    static void sort(int[] a,int left,int right) {
        if(right-left<=1) return; // 半开区间，至多一个元素已有序
        int mid=left+(right-left)/2; sort(a,left,mid); sort(a,mid,right);
        int[] buffer=new int[right-left]; int i=left,j=mid,k=0;
        while(i<mid && j<right) buffer[k++]=a[i]<=a[j] ? a[i++] : a[j++];
        while(i<mid) buffer[k++]=a[i++];
        while(j<right) buffer[k++]=a[j++];
        System.arraycopy(buffer,0,a,left,buffer.length); // 把两段有序区间合并回原数组
    }`;
  var power=J`    static long power(long x,int n) {
        if(n==0) return 1; // 示例只处理非负整数指数和不溢出的 long 结果
        long half=power(x,n/2);
        return n%2==0 ? half*half : half*half*x;
    }`;
  add('c5/s1/1', J`        Tree root=new Tree(1); root.left=new Tree(2); root.right=new Tree(3);
        List<Integer> answer=new ArrayList<>(); preorder(root,answer); System.out.println(answer);`, tree+'\n'+preorder, '[1, 2, 3]');
  add('c5/s1/2', J`        int[] a={4,1,3,2}; sort(a,0,a.length); System.out.println(Arrays.toString(a));`, mergeSort, '[1, 2, 3, 4]');
  add('c5/s1/3', J`        System.out.println(factorial(5));
        System.out.println(power(2,10));`, power+J`
    static long factorial(int n) {
        if(n<=1) return 1;
        return n*factorial(n-1); // 规模减少，最终到达 1
    }`, '120\n1024');
  add('c5/s1/4', J`        Folder root=new Folder(2);
        root.children.add(new Folder(3));
        System.out.println(size(root)); // 当前文件 2 KB + 子文件夹 3 KB`, J`    static class Folder {
        int ownFileKB; List<Folder> children=new ArrayList<>();
        Folder(int ownFileKB) { this.ownFileKB=ownFileKB; }
    }
    static int size(Folder folder) {
        int total=folder.ownFileKB;
        for(Folder child:folder.children) total+=size(child); // 子文件夹沿用同一递归定义
        return total;
    }`, '5');
  add('c5/s2/1', J`        int[] a={4,1,3,2}; sort(a,0,a.length); System.out.println(Arrays.toString(a));`, mergeSort, '[1, 2, 3, 4]');
  add('c5/s2/2', J`        System.out.println(power(3,8)); // 每层把指数除以 2，递归深度 O(log n)`, power, '6561');
  add('c5/s2/3', J`        int[] a={2,2,1,2,3};
        int candidate=majority(a,0,a.length);
        long count=Arrays.stream(a).filter(x->x==candidate).count();
        System.out.println(count>a.length/2 ? candidate : "none"); // 没有多数元素时必须验证`, J`    static int majority(int[] a,int left,int right) {
        if(right-left==1) return a[left];
        int mid=(left+right)/2,x=majority(a,left,mid),y=majority(a,mid,right);
        if(x==y) return x;
        int cx=0,cy=0;
        for(int i=left;i<right;i++) { if(a[i]==x) cx++; if(a[i]==y) cy++; }
        return cx>=cy ? x : y; // 子区间候选不同，回到当前区间计数
    }`, '2');
  add('c5/s2/4', J`        double[][] points={{0,0},{1,1},{5,5}};
        Arrays.sort(points,Comparator.comparingDouble(p->p[0]));
        System.out.printf(Locale.ROOT,"%.3f%n",closest(points,0,points.length));`, J`    static double distance(double[] a,double[] b) { return Math.hypot(a[0]-b[0],a[1]-b[1]); }
    static double closest(double[][] p,int left,int right) {
        if(right-left<=3) { // 小区间直接比较，避免继续拆分
            double best=Double.POSITIVE_INFINITY;
            for(int i=left;i<right;i++) for(int j=i+1;j<right;j++) best=Math.min(best,distance(p[i],p[j]));
            return best;
        }
        int mid=(left+right)/2; double x=p[mid][0];
        double best=Math.min(closest(p,left,mid),closest(p,mid,right));
        List<double[]> strip=new ArrayList<>();
        for(int i=left;i<right;i++) if(Math.abs(p[i][0]-x)<best) strip.add(p[i]);
        strip.sort(Comparator.comparingDouble(a->a[1]));
        for(int i=0;i<strip.size();i++) for(int j=i+1;j<strip.size() && strip.get(j)[1]-strip.get(i)[1]<best;j++) {
            best=Math.min(best,distance(strip.get(i),strip.get(j)));
        } // 本简明版本每层重新排序条带，总时间 O(n log²n)
        return best;
    }`, '1.414');
  var permutations=J`    static void permute(int[] a,boolean[] used,List<Integer> path,List<List<Integer>> result) {
        if(path.size()==a.length) { result.add(new ArrayList<>(path)); return; } // 必须复制，不能存可变 path 本身
        for(int i=0;i<a.length;i++) if(!used[i]) {
            used[i]=true; path.add(a[i]); permute(a,used,path,result);
            path.remove(path.size()-1); used[i]=false; // 恢复进入本分支前的状态
        }
    }`;
  add('c5/s3/1', J`        List<List<Integer>> result=new ArrayList<>();
        permute(new int[]{1,2,3},new boolean[3],new ArrayList<>(),result);
        System.out.println(result);`, permutations, '[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]');
  add('c5/s3/2', J`        int[] a={2,3,6,7}; List<List<Integer>> result=new ArrayList<>();
        combinations(a,0,7,new ArrayList<>(),result); System.out.println(result);`, J`    static void combinations(int[] a,int start,int remaining,List<Integer> path,List<List<Integer>> result) {
        if(remaining==0) { result.add(new ArrayList<>(path)); return; }
        for(int i=start;i<a.length && a[i]<=remaining;i++) {
            path.add(a[i]); combinations(a,i,remaining-a[i],path,result); // 继续用 i，允许重复选本数
            path.remove(path.size()-1);
        } // 输入已排序且为正数，a[i]>remaining 时可剪枝
    }`, '[[2, 2, 3], [7]]');
  add('c5/s3/3', J`        int n=4;
        System.out.println(queens(0,n,new boolean[n],new boolean[2*n],new boolean[2*n]));`, J`    static int queens(int row,int n,boolean[] cols,boolean[] down,boolean[] up) {
        if(row==n) return 1;
        int count=0;
        for(int col=0;col<n;col++) {
            int d=row-col+n,u=row+col; // 相同斜线的编号相同
            if(cols[col] || down[d] || up[u]) continue;
            cols[col]=down[d]=up[u]=true;
            count+=queens(row+1,n,cols,down,up);
            cols[col]=down[d]=up[u]=false; // 回溯时撤销占用
        }
        return count;
    }`, '2');
  add('c5/s3/4', J`        List<String> result=new ArrayList<>(); generate("",0,0,2,result); System.out.println(result);`, J`    static void generate(String path,int left,int right,int n,List<String> result) {
        if(path.length()==2*n) { result.add(path); return; }
        if(left<n) generate(path+"(",left+1,right,n,result);
        if(right<left) generate(path+")",left,right+1,n,result); // 任意前缀里右括号不能多于左括号
    }`, '[(()), ()()]');
  var bst=J`    static Tree insert(Tree root,int value) {
        if(root==null) return new Tree(value);
        if(value<root.value) root.left=insert(root.left,value);
        else if(value>root.value) root.right=insert(root.right,value);
        return root;
    }`;
  add('c6/s1/1', J`        Tree root=null; for(int x:new int[]{5,3,8,4}) root=insert(root,x);
        List<Integer> path=new ArrayList<>(); Tree p=root;
        while(p!=null) {
            path.add(p.value); if(p.value==4) break;
            p=4<p.value ? p.left : p.right;
        }
        System.out.println(path); // 普通 BST 若退化，路径可能长达 n`, tree+'\n'+bst, '[5, 3, 4]');
  add('c6/s1/2', J`        Expr expression=new Expr('*',new Expr('+',new Expr(2),new Expr(3)),new Expr(4));
        System.out.println(eval(expression)); // 先算子树 2+3，再乘 4
        Map<String,List<String>> folders=new LinkedHashMap<>();
        folders.put("项目",Arrays.asList("源码","图片"));
        System.out.println(folders.get("项目"));`, J`    static class Expr {
        char op; int value; Expr left,right;
        Expr(int value) { this.value=value; }
        Expr(char op,Expr left,Expr right) { this.op=op; this.left=left; this.right=right; }
    }
    static int eval(Expr root) {
        if(root.left==null) return root.value;
        int left=eval(root.left),right=eval(root.right);
        return root.op=='+' ? left+right : left*right;
    }`, '20\n[源码, 图片]');
  add('c6/s1/3', J`        PriorityQueue<Integer> tasks=new PriorityQueue<>(Arrays.asList(3,1,2));
        System.out.println(tasks.poll()); // 小顶堆取最小任务
        Trie root=new Trie();
        for(String word:Arrays.asList("cat","car")) {
            Trie p=root;
            for(char c:word.toCharArray()) p=p.children.computeIfAbsent(c,k->new Trie());
            p.word=true;
        }
        Trie prefix=root.children.get('c').children.get('a');
        System.out.println(prefix.children.keySet()); // cat、car 共享 c→a`, J`    static class Trie {
        Map<Character,Trie> children=new TreeMap<>(); boolean word;
    }`, '1\n[r, t]');
  var treePath=J`    static int depth(Tree root) { return root==null ? 0 : 1+Math.max(depth(root.left),depth(root.right)); }
    static boolean hasPath(Tree root,int remaining) {
        if(root==null) return false;
        remaining-=root.value;
        if(root.left==null && root.right==null) return remaining==0; // 必须到叶子才算完整路径
        return hasPath(root.left,remaining) || hasPath(root.right,remaining);
    }`;
  add('c6/s1/4', J`        Tree root=new Tree(1); root.left=new Tree(2); root.right=new Tree(3);
        System.out.println(depth(root)); System.out.println(hasPath(root,4));`, tree+'\n'+treePath, '2\ntrue');
  add('c6/s2/1', J`        List<List<Integer>> rows=levels(sampleTree());
        System.out.println(rows);
        for(int i=1;i<rows.size();i+=2) Collections.reverse(rows.get(i));
        System.out.println(rows); // BFS 取层，再反转奇数层`, tree+'\n'+levels, '[[1], [2, 3], [4, 5]]\n[[1], [3, 2], [4, 5]]');
  add('c6/s2/2', J`        System.out.println(shortest(new int[][]{{0,0},{1,0}}));`, maze, '2');
  add('c6/s2/3', J`        int[][] grid={{2,1,1},{1,1,0},{0,1,2}};
        Queue<int[]> q=new ArrayDeque<>(); int fresh=0;
        for(int r=0;r<3;r++) for(int c=0;c<3;c++) {
            if(grid[r][c]==2) q.offer(new int[]{r,c}); else if(grid[r][c]==1) fresh++;
        }
        int minutes=0; int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};
        while(fresh>0 && !q.isEmpty()) {
            int size=q.size();
            for(int i=0;i<size;i++) {
                int[] p=q.poll();
                for(int[] d:dirs) {
                    int r=p[0]+d[0],c=p[1]+d[1];
                    if(r>=0 && r<3 && c>=0 && c<3 && grid[r][c]==1) {
                        grid[r][c]=2; fresh--; q.offer(new int[]{r,c}); // 立即标记，防止重复感染计数
                    }
                }
            }
            minutes++;
        }
        System.out.println(fresh==0 ? minutes : -1);`, '', '2');
  add('c6/s2/4', J`        int[][] graph={{1,2},{0,3},{0,4},{1},{2}}; // A=0，B=1，C=2，D=3，E=4
        int[] distance=new int[5]; Arrays.fill(distance,-1); distance[0]=0;
        Queue<Integer> q=new ArrayDeque<>(); q.offer(0);
        while(!q.isEmpty()) {
            int u=q.poll();
            for(int v:graph[u]) if(distance[v]==-1) { distance[v]=distance[u]+1; q.offer(v); }
        }
        List<Integer> answer=new ArrayList<>();
        for(int i=0;i<5;i++) if(distance[i]==2) answer.add(i);
        System.out.println(answer);`, '', '[3, 4]');
  var flood=J`    static void flood(int[][] grid,int r,int c) {
        if(r<0 || r>=grid.length || c<0 || c>=grid[0].length || grid[r][c]!=1) return;
        grid[r][c]=0; // 先标记再递归，否则相邻节点会互相反复访问
        flood(grid,r+1,c); flood(grid,r-1,c); flood(grid,r,c+1); flood(grid,r,c-1);
    }`;
  add('c6/s3/1', J`        int[][] grid={{1,1,0},{0,1,0},{1,0,1}}; int count=0;
        for(int r=0;r<grid.length;r++) for(int c=0;c<grid[0].length;c++) {
            if(grid[r][c]==1) { count++; flood(grid,r,c); }
        }
        System.out.println(count); // 此解法会修改网格；需要保留输入时先复制`, flood, '3');
  add('c6/s3/2', J`        Tree root=new Tree(5); root.left=new Tree(4); root.right=new Tree(8);
        System.out.println(hasPath(root,9));`, tree+'\n'+treePath, 'true');
  add('c6/s3/3', J`        List<List<Integer>> result=new ArrayList<>();
        permute(new int[]{1,2,3},new boolean[3],new ArrayList<>(),result);
        System.out.println(result.size()); System.out.println(result.get(0));`, permutations, '6\n[1, 2, 3]');
  var topoDfs=J`    static boolean visit(int u,int[][] graph,int[] color,List<Integer> result) {
        if(color[u]==1) return false; // 再次遇到当前递归路径中的节点，即发现有向环
        if(color[u]==2) return true;
        color[u]=1;
        for(int v:graph[u]) if(!visit(v,graph,color,result)) return false;
        color[u]=2; result.add(u); return true;
    }
    static List<Integer> topoDfs(int[][] graph) {
        int[] color=new int[graph.length]; List<Integer> result=new ArrayList<>();
        for(int u=0;u<graph.length;u++) if(!visit(u,graph,color,result)) return Collections.emptyList();
        Collections.reverse(result); return result;
    }`;
  add('c6/s3/4', J`        System.out.println(topoDfs(new int[][]{{1},{2},{}}));
        System.out.println(topoDfs(new int[][]{{1},{0}})); // 空结果表示此非空图有环`, topoDfs, '[0, 1, 2]\n[]');

  add('c7/s1/1', J`        int[] a={3,2,1,5,6,4}; int k=2;
        PriorityQueue<Integer> heap=new PriorityQueue<>();
        for(int x:a) { heap.offer(x); if(heap.size()>k) heap.poll(); }
        System.out.println(heap.peek()); // 堆中只保留最大的 K 个，堆顶是其中最小值`, '', '5');
  add('c7/s1/2', J`        PriorityQueue<Task> tasks=new PriorityQueue<>(Comparator.comparingInt(t->t.priority));
        tasks.offer(new Task("A",5)); tasks.offer(new Task("B",1)); tasks.offer(new Task("C",3));
        while(!tasks.isEmpty()) System.out.println(tasks.poll().name); // 本例数字越小优先级越高`, J`    static class Task {
        String name; int priority;
        Task(String name,int priority) { this.name=name; this.priority=priority; }
    }`, 'B\nC\nA');
  add('c7/s1/3', J`        int[] a={4,1,3,2};
        for(int i=a.length/2-1;i>=0;i--) down(a,i,a.length); // 从最后一个非叶节点建堆
        for(int end=a.length-1;end>0;end--) {
            int temp=a[0]; a[0]=a[end]; a[end]=temp;
            down(a,0,end); // 末尾已排好，不再属于堆
        }
        System.out.println(Arrays.toString(a));`, J`    static void down(int[] a,int parent,int size) {
        while(2*parent+1<size) {
            int child=2*parent+1;
            if(child+1<size && a[child+1]>a[child]) child++;
            if(a[parent]>=a[child]) break;
            int temp=a[parent]; a[parent]=a[child]; a[child]=temp; parent=child;
        }
    }`, '[1, 2, 3, 4]');
  add('c7/s1/4', J`        PriorityQueue<Node> heap=new PriorityQueue<>(Comparator.comparingInt(n->n.value));
        for(Node head:new Node[]{chain(1,4),chain(2,5),chain(3,6)}) heap.offer(head);
        Node dummy=new Node(0),tail=dummy;
        while(!heap.isEmpty()) {
            Node smallest=heap.poll();
            if(smallest.next!=null) heap.offer(smallest.next); // 同一条链只保留当前候选
            tail.next=smallest; tail=smallest;
        }
        System.out.println(show(dummy.next));`, node, '[1, 2, 3, 4, 5, 6]');
  add('c7/s1/5', J`        int[][][] graph={{{1,2},{2,9}},{{2,1}}, {}};
        int[] dist=new int[3]; Arrays.fill(dist,Integer.MAX_VALUE); dist[0]=0;
        PriorityQueue<int[]> heap=new PriorityQueue<>(Comparator.comparingInt(p->p[1]));
        heap.offer(new int[]{0,0});
        while(!heap.isEmpty()) {
            int[] p=heap.poll(); int u=p[0];
            if(p[1]!=dist[u]) continue; // 跳过距离已被更新的旧堆项
            for(int[] edge:graph[u]) if(dist[u]+edge[1]<dist[edge[0]]) {
                dist[edge[0]]=dist[u]+edge[1]; heap.offer(new int[]{edge[0],dist[edge[0]]});
            }
        }
        System.out.println(dist[2]); // Dijkstra 要求边权非负`, '', '3');
  add('c7/s2/1', J`        int[][] meetings={{1,2},{2,3},{1,3}};
        Arrays.sort(meetings,Comparator.comparingInt(m->m[1]));
        int count=0,end=Integer.MIN_VALUE;
        for(int[] m:meetings) if(m[0]>=end) { count++; end=m[1]; }
        System.out.println(count); // 本例允许两个区间端点相接`, '', '2');
  add('c7/s2/2', J`        int[] appetite={1,2},cookies={1,3}; Arrays.sort(appetite); Arrays.sort(cookies);
        int child=0;
        for(int cookie:cookies) if(child<appetite.length && cookie>=appetite[child]) child++;
        System.out.println(child); // 最小够用的饼干先满足胃口最小的孩子`, '', '2');
  var canJump=J`    static boolean canJump(int[] a) {
        int farthest=0;
        for(int i=0;i<a.length;i++) {
            if(i>farthest) return false;
            farthest=Math.max(farthest,i+a[i]);
            if(farthest>=a.length-1) return true;
        }
        return false;
    }`;
  add('c7/s2/3', J`        System.out.println(canJump(new int[]{2,3,1,1,4}));`, canJump, 'true');
  add('c7/s2/4', J`        PriorityQueue<Integer> frequencies=new PriorityQueue<>(Arrays.asList(2,3,7));
        int cost=0;
        while(frequencies.size()>1) {
            int merged=frequencies.poll()+frequencies.poll(); // 每次合并最小的两个子树
            cost+=merged; frequencies.offer(merged);
        }
        System.out.println(cost);`, '', '17');
  var stairs=J`    static int stairs(int n) {
        int[] dp=new int[n+2]; dp[0]=1; dp[1]=1;
        for(int i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2]; // 最后一步来自前 1 阶或前 2 阶
        return dp[n];
    }`;
  var robber=J`    static int rob(int[] money) {
        int previousTwo=0,previousOne=0;
        for(int value:money) {
            int current=Math.max(previousOne,previousTwo+value);
            previousTwo=previousOne; previousOne=current; // 先算 current，再移动旧状态
        }
        return previousOne;
    }`;
  var lisQuadratic=J`    static int lis(int[] a) {
        int[] dp=new int[a.length]; Arrays.fill(dp,1); int best=0;
        for(int i=0;i<a.length;i++) {
            for(int j=0;j<i;j++) if(a[j]<a[i]) dp[i]=Math.max(dp[i],dp[j]+1);
            best=Math.max(best,dp[i]); // dp[i] 必须以 a[i] 结尾，不是前缀整体的答案
        }
        return best;
    }`;
  var backpack=J`    static int backpack(int[] weight,int[] value,int capacity) {
        int[] dp=new int[capacity+1];
        for(int i=0;i<weight.length;i++) {
            for(int c=capacity;c>=weight[i];c--) {
                dp[c]=Math.max(dp[c],dp[c-weight[i]]+value[i]); // 倒序防止同一物品被再次使用
            }
        }
        return dp[capacity];
    }`;
  add('c8/s1/1', J`        System.out.println(stairs(4));`, stairs, '5');
  add('c8/s1/2', J`        System.out.println(rob(new int[]{2,7,9,3,1}));`, robber, '12');
  add('c8/s1/3', J`        int[] a={3,2,1,0,4}; boolean[] reachable=new boolean[a.length]; reachable[0]=true;
        for(int i=0;i<a.length;i++) if(reachable[i]) {
            for(int step=1;step<=a[i] && i+step<a.length;step++) reachable[i+step]=true;
        } // 存在性 DP，清楚但最坏 O(n²)；也可用贪心最远可达位置优化
        System.out.println(reachable[a.length-1]);`, '', 'false');
  add('c8/s1/4', J`        System.out.println(lis(new int[]{10,9,2,5,3,7,101}));`, lisQuadratic, '4');
  add('c8/s1/5', J`        System.out.println(backpack(new int[]{2,3},new int[]{3,4},5));`, backpack, '7');
  add('c8/s2/1', J`        System.out.println(backpack(new int[]{2,3},new int[]{3,4},5));`, backpack, '7');
  add('c8/s2/2', J`        int[] coins={1,2,5}; int amount=11;
        int[] dp=new int[amount+1]; Arrays.fill(dp,amount+1); dp[0]=0;
        for(int coin:coins) for(int sum=coin;sum<=amount;sum++) {
            dp[sum]=Math.min(dp[sum],dp[sum-coin]+1); // 正序允许当前硬币反复使用
        }
        System.out.println(dp[amount]>amount ? -1 : dp[amount]);`, '', '3');
  add('c8/s2/3', J`        String a="ABCBDAB",b="BDCABA"; int[][] dp=new int[a.length()+1][b.length()+1];
        for(int i=1;i<=a.length();i++) for(int j=1;j<=b.length();j++) {
            if(a.charAt(i-1)==b.charAt(j-1)) dp[i][j]=dp[i-1][j-1]+1;
            else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
        } // dp[i][j] 表示 a 前 i 个字符与 b 前 j 个字符的 LCS 长度
        System.out.println(dp[a.length()][b.length()]);`, '', '4');
  add('c8/s2/4', J`        int[] a={10,9,2,5,3,7,101,18},tails=new int[a.length]; int size=0;
        for(int x:a) {
            int left=0,right=size;
            while(left<right) { int mid=(left+right)/2; if(tails[mid]<x) left=mid+1; else right=mid; }
            tails[left]=x; if(left==size) size++; // 替换结尾，不表示 tails 本身一定是原数组的子序列
        }
        System.out.println(size); // O(n log n) 时间`, '', '4');
  add('c8/s2/5', J`        String a="cat",b="cut"; int[][] dp=new int[a.length()+1][b.length()+1];
        for(int i=0;i<=a.length();i++) dp[i][0]=i; // 删除 i 个字符
        for(int j=0;j<=b.length();j++) dp[0][j]=j; // 插入 j 个字符
        for(int i=1;i<=a.length();i++) for(int j=1;j<=b.length();j++) {
            if(a.charAt(i-1)==b.charAt(j-1)) dp[i][j]=dp[i-1][j-1];
            else dp[i][j]=1+Math.min(dp[i-1][j-1],Math.min(dp[i-1][j],dp[i][j-1]));
        } // 三种操作分别是替换、删除、插入
        System.out.println(dp[a.length()][b.length()]);`, '', '1');

  var topo=J`    static List<Integer> topo(int[][] graph) {
        int[] indegree=new int[graph.length];
        for(int[] neighbors:graph) for(int v:neighbors) indegree[v]++;
        Queue<Integer> queue=new ArrayDeque<>();
        for(int i=0;i<graph.length;i++) if(indegree[i]==0) queue.offer(i);
        List<Integer> order=new ArrayList<>();
        while(!queue.isEmpty()) {
            int u=queue.poll(); order.add(u);
            for(int v:graph[u]) if(--indegree[v]==0) queue.offer(v);
        }
        return order.size()==graph.length ? order : Collections.emptyList();
    }`;
  var dsu=J`    static class DSU {
        int[] parent,size;
        DSU(int n) { parent=new int[n]; size=new int[n]; for(int i=0;i<n;i++) { parent[i]=i; size[i]=1; } }
        int find(int x) {
            if(parent[x]!=x) parent[x]=find(parent[x]); // 路径压缩
            return parent[x];
        }
        boolean union(int a,int b) {
            int x=find(a),y=find(b); if(x==y) return false;
            if(size[x]<size[y]) { int temp=x; x=y; y=temp; } // 小树挂到大树下
            parent[y]=x; size[x]+=size[y]; return true;
        }
    }`;
  var graphWalk=J`    static List<Integer> reachable(int[][] graph,int start,int excluded) {
        boolean[] seen=new boolean[graph.length]; Queue<Integer> q=new ArrayDeque<>();
        List<Integer> result=new ArrayList<>(); seen[start]=true; q.offer(start);
        while(!q.isEmpty()) {
            int u=q.poll(); result.add(u);
            for(int v:graph[u]) if(v!=excluded && !seen[v]) { seen[v]=true; q.offer(v); }
        }
        return result;
    }`;
  add('c9/s1/1', J`        Map<String,List<String>> friends=new LinkedHashMap<>();
        friends.put("A",Arrays.asList("B")); friends.put("B",Arrays.asList("A","C")); friends.put("C",Arrays.asList("B"));
        System.out.println(friends.get("B")); // 无向边同时记录两个方向
        Map<String,Map<String,Integer>> roads=new HashMap<>();
        roads.put("A",Collections.singletonMap("B",2)); roads.put("B",Collections.singletonMap("C",3));
        System.out.println(roads.get("A").get("B")+roads.get("B").get("C"));`, '', '[A, C]\n5');
  add('c9/s1/2', J`        int[][] graph={{1},{2},{}}; // 0=数据结构，1=算法基础，2=算法进阶
        List<Integer> order=topo(graph);
        for(int id:order) System.out.println(new String[]{"数据结构","算法基础","算法进阶"}[id]);`, topo, '数据结构\n算法基础\n算法进阶');
  add('c9/s1/3', J`        int[][] graph={{1},{0,2},{1,3},{2}}; // 节点 0~3 对应 R1~R4
        System.out.println(reachable(graph,1,0)); // 排除故障 R1，从 R2 出发
        // 结果含起点 R2；其余可达路由器是 R3、R4`, graphWalk, '[1, 2, 3]');
  add('c9/s1/4', J`        int[][] graph={{1},{0,2},{1},{4},{3}}; boolean[] seen=new boolean[5]; int count=0;
        for(int u=0;u<5;u++) if(!seen[u]) {
            count++;
            for(int v:reachable(graph,u,-1)) seen[v]=true;
        }
        System.out.println(count);`, graphWalk, '2');
  add('c9/s2/1', J`        DSU dsu=new DSU(3); // A=0，B=1，C=2
        dsu.union(0,1); dsu.union(1,2);
        System.out.println(dsu.find(0)==dsu.find(2));`, dsu, 'true');
  add('c9/s2/2', J`        DSU dsu=new DSU(3);
        for(int[] edge:new int[][]{{0,1},{1,2},{0,2}}) {
            if(!dsu.union(edge[0],edge[1])) System.out.println(Arrays.toString(edge)); // 已连通，再加边就成环
        }`, dsu, '[0, 2]');
  add('c9/s2/3', J`        DSU dsu=new DSU(4);
        for(int[] edge:new int[][]{{0,1},{2,3},{1,2}}) dsu.union(edge[0],edge[1]);
        System.out.println(dsu.find(0)==dsu.find(3)); // 编号 0~3 对应电脑 1~4`, dsu, 'true');
  add('c9/s2/4', J`        int[][] edges={{0,1,1},{1,2,2},{0,2,3}}; // 起点、终点、权重
        Arrays.sort(edges,Comparator.comparingInt(e->e[2])); DSU dsu=new DSU(3); int weight=0;
        List<String> chosen=new ArrayList<>();
        for(int[] edge:edges) if(dsu.union(edge[0],edge[1])) {
            weight+=edge[2]; chosen.add(edge[0]+"-"+edge[1]);
        }
        System.out.println(chosen); System.out.println(weight); // 最小生成树只选连接不同集合的边`, dsu, '[0-1, 1-2]\n3');
  add('c9/s2/5', J`        int[][] grid={{1,1,0},{0,1,0},{1,0,1}}; int rows=3,cols=3; DSU dsu=new DSU(rows*cols);
        for(int r=0;r<rows;r++) for(int c=0;c<cols;c++) if(grid[r][c]==1) {
            if(r+1<rows && grid[r+1][c]==1) dsu.union(r*cols+c,(r+1)*cols+c);
            if(c+1<cols && grid[r][c+1]==1) dsu.union(r*cols+c,r*cols+c+1); // 只连右、下，避免重复边
        }
        Set<Integer> roots=new HashSet<>();
        for(int r=0;r<rows;r++) for(int c=0;c<cols;c++) if(grid[r][c]==1) roots.add(dsu.find(r*cols+c));
        System.out.println(roots.size()); // 水格虽然有编号，但不能计入岛屿`, dsu, '3');
  add('c9/s3/1', J`        System.out.println(topo(new int[][]{{1},{2},{}})); // A→B→C
        System.out.println(topo(new int[][]{{1},{0}})); // A→B→A，无法修完`, topo, '[0, 1, 2]\n[]');
  add('c9/s3/2', J`        String[] names={"生成代码","编译","测试"};
        for(int id:topo(new int[][]{{1},{2},{}})) System.out.println(names[id]);`, topo, '生成代码\n编译\n测试');
  add('c9/s3/3', J`        int[][] graph={{1},{2},{0}};
        boolean cycle=topo(graph).size()!=graph.length;
        System.out.println(cycle); // 无入度 0 的起点，不能处理完所有节点`, topo, 'true');
  add('c9/s3/4', J`        String[] tasks={"建表","导入数据","生成报表"};
        for(int id:topo(new int[][]{{1},{2},{}})) System.out.println(tasks[id]);`, topo, '建表\n导入数据\n生成报表');

  (window.COURSE || []).forEach(function (chapter) {
    chapter.sections.forEach(function (section) {
      section.blocks.filter(function (block) { return block.t==='case-studies'; }).forEach(function (block) {
        block.items.forEach(function (item,i) {
          var key=chapter.id+'/'+section.id+'/'+(i+1), snippet=snippets[key];
          if(!snippet) throw new Error('缺少代码案例：'+key);
          item.code=snippet.code; item.expectedOutput=snippet.output;
        });
      });
    });
  });
})();
