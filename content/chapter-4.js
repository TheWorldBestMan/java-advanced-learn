/* 第 4 章 · 二分查找、排序 */
window.COURSE = window.COURSE || [];
window.COURSE.push({
  id: 'c4',
  title: '二分查找、排序',
  minutes: 150,
  tags: ['二分查找', '排序', '快排', '归并', '比较器'],
  goals: [
    '掌握二分查找的边界写法（左闭右闭 / 左闭右开）与防死循环技巧',
    '会找左右边界、二分答案',
    '理解常见排序算法的复杂度、稳定性与适用场景',
    '会用 Arrays.sort 与自定义比较器'
  ],
  interview: [
    { q: '二分查找的时间复杂度？为什么是 O(log n)？', a: '每次比较排除一半区间，最多比较 log₂(n) 次，所以 **O(log n)**。前提是区间有序。' },
    { q: '手写快速排序？时间复杂度与最坏情况？', a: '选基准，把小的放左、大的放右，再递归两边。平均 **O(n log n)**、最坏 **O(n²)**（已有序且固定选首元素为基准时退化成链）、空间 O(log n)、不稳定。随机选基准或三数取中可避免最坏。', code: `void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[lo], i = lo, j = hi;
    while (i < j) {
        while (i < j && a[j] >= pivot) j--;
        a[i] = a[j];
        while (i < j && a[i] <= pivot) i++;
        a[j] = a[i];
    }
    a[i] = pivot;
    quickSort(a, lo, i - 1);
    quickSort(a, i + 1, hi);
}` },
    { q: '哪些排序稳定？快排为什么不稳定？', a: '归并、插入、冒泡稳定；快排、堆排、选择不稳定。快排不稳定因为交换时相等元素可能被换到相对位置颠倒。需要保持相对顺序（如多关键字排序）用稳定排序，Java 对对象数组的 Arrays.sort 用 TimSort 保证稳定。' },
    { q: '二分查找的边界怎么避免死循环？', a: '关键是**区间定义一致**：左闭右闭 [left,right] 配 left <= right 且 left = mid+1 / right = mid-1；左闭右开 [left,right) 配 left < right 且 right = mid。mid 用 left + (right-left)/2 防溢出。' }
  ],
  sections: [
    {
      id: 's1',
      title: '4.1 二分查找',
      short: '二分查找',
      minutes: 55,
      blocks: [
        { t: 'h', text: '概念：每次砍掉一半' },
        { t: 'p', text: '二分查找在**有序区间**上，每次和中间元素比较，排除掉一半，把查找从 O(n) 降到 **O(log n)**。除了「找一个数」，它还能找「第一个 >= target 的位置」（下界）、「最后一个 <= target 的位置」（上界），以及「二分答案」。' },
        { t: 'code', title: '标准二分查找（左闭右闭）', code: `public class BinarySearch {
    public static int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;   // [left, right]
        while (left <= right) {
            int mid = left + (right - left) / 2; // 防溢出写法
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {1, 3, 5, 7, 9, 11};
        System.out.println(search(a, 7));  // 3
        System.out.println(search(a, 4));  // -1
    }
}` },
        { t: 'p', text: '**案例问题**：给定升序数组和 target，求第一个 >= target 的下标（即 lowerBound，也叫搜索插入位置）。 ' },
        { t: 'code', title: '找左边界：第一个 >= target 的位置（左闭右开）', code: `public class LowerBound {
    public static int lowerBound(int[] nums, int target) {
        int left = 0, right = nums.length;        // [left, right)
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) left = mid + 1;
            else right = mid;                     // mid 可能还有用，right 不动
        }
        return left;                              // 第一个 >= target 的下标
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 2, 2, 3, 5};
        System.out.println(lowerBound(a, 2));  // 1
        System.out.println(lowerBound(a, 4));  // 5（第一个 >= 4 的位置）
    }
}` },
        { t: 'why', items: [
          '用左闭右开 [left, right)：right 初始为 nums.length（不是 length-1），因为答案可能落在数组末尾之后（所有元素都 < target）。',
          '循环条件 left < right：当 left == right 时区间为空，left 就是答案。',
          'nums[mid] < target 才 left = mid + 1；>= target 时 right = mid 而不是 mid-1，因为 mid 本身可能是答案，不能丢掉。',
          '「左闭右开 + right = mid」组合能避免死循环，是二分找边界的推荐写法。'
        ] },
        { t: 'info', text: '**思路与复杂度**：lowerBound 求「第一个 >= target」的位置，是二分题的通用原语：搜索插入位置 = lowerBound(target)；最后一个位置 = lowerBound(target+1) - 1。左闭右开 [left, right) + 循环条件 left < right + 命中时 right = mid，是防死循环的推荐写法。时间 O(log n)。' },
        { t: 'tip', text: '口诀：求「第一个 >=」用 lowerBound（nums[mid] < target 时 left = mid+1）；求「第一个 >」等价于 lowerBound(target+1)；求「最后一个 <=」等价于 lowerBound(target+1) - 1。' },
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '有序数组中查找元素、插入位置、左右边界',
          '在旋转排序数组中搜索、寻找峰值',
          '二分答案：把「求最值」转成「判断能否达到某值」，对答案区间二分',
          '求平方根、解方程等数值问题'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'code', title: '二分答案：求 x 的平方根（整数部分）', code: `public class SqrtX {
    public static int mySqrt(int x) {
        if (x == 0) return 0;
        int left = 1, right = x;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            long square = (long) mid * mid;   // 防溢出
            if (square == x) return mid;
            else if (square < x) left = mid + 1;
            else right = mid - 1;
        }
        return right;                          // 循环结束时 right < left
    }

    public static void main(String[] args) {
        System.out.println(mySqrt(8));   // 2
        System.out.println(mySqrt(25));  // 5
    }
}` },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '死循环', d: '左闭右闭用 left <= right 且 left=mid+1 / right=mid-1；左闭右开用 left < right 且 right=mid。混用极易死循环。' },
          { t: 'mid 计算溢出', d: '(left + right) / 2 在 left、right 很大时会溢出，写 left + (right - left) / 2。' },
          { t: '边界开闭不一致', d: '想清楚区间是 [left, right] 还是 [left, right)，left、right 的更新必须和区间定义一致。' },
          { t: '忘记有序前提', d: '二分查找要求区间单调；无序数组不能直接二分。' },
          { t: '乘法溢出', d: '二分答案里 mid * mid 可能溢出 int，先转 long 再乘。' },
          { t: '返回值是 left 还是 right', d: '找下界返回 left；找「最后一个 <=」时返回 right 或 lowerBound(target+1)-1，别搞混。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '二分查找', diff: 'easy', note: '标准模板' },
          { name: '搜索插入位置', diff: 'easy', note: '就是 lowerBound' },
          { name: '在排序数组中查找元素的第一个和最后一个位置', diff: 'medium', note: '两次二分找左右边界' },
          { name: '寻找峰值', diff: 'medium', note: '二分局部单调' },
          { name: '搜索旋转排序数组', diff: 'medium', note: '判断哪半有序' }
        ]}
      ]
    },
    {
      id: 's2',
      title: '4.2 排序',
      short: '排序',
      minutes: 55,
      blocks: [
        { t: 'h', text: '概念：让元素按某种顺序排列' },
        { t: 'p', text: '排序是很多算法的前置步骤（双指针、贪心、二分都要有序）。Java 的 Arrays.sort 对基本类型用**双轴快排**，对对象用**归并/ TimSort**（稳定）。理解各排序的复杂度与稳定性，面试常考手写快排、归并。' },
        { t: 'table', head: ['算法', '平均时间', '空间', '稳定', '特点'], rows: [
          ['快速排序', 'O(n log n)', 'O(log n)', '否', '最常用，原地'],
          ['归并排序', 'O(n log n)', 'O(n)', '是', '稳定，适合链表/外部排序'],
          ['堆排序', 'O(n log n)', 'O(1)', '否', '原地，见第 7 章'],
          ['插入排序', 'O(n^2)', 'O(1)', '是', '小规模/近乎有序很快'],
          ['冒泡/选择', 'O(n^2)', 'O(1)', '看实现', '教学用，实际少用']
        ]},
        { t: 'h', text: '运用场景' },
        { t: 'list', items: [
          '为双指针、二分、贪心等算法提供有序前提',
          'Top K 问题（排序后取前 K 或第 K 大）',
          '合并区间、会议室、区间覆盖等要先排序',
          '自定义比较器：按对象某字段排序、多关键字排序'
        ]},
        { t: 'h', text: '使用案例' },
        { t: 'code', title: 'Arrays.sort 与自定义比较器', code: `import java.util.*;

public class SortDemo {
    public static void main(String[] args) {
        // 基本类型：升序
        int[] a = {5, 2, 8, 1, 9};
        Arrays.sort(a);
        System.out.println(Arrays.toString(a)); // [1, 2, 5, 8, 9]

        // 对象数组：自定义比较器（降序）
        Integer[] b = {5, 2, 8, 1, 9};
        Arrays.sort(b, (x, y) -> y - x);
        System.out.println(Arrays.toString(b)); // [9, 8, 5, 2, 1]

        // 按字符串长度排序
        String[] words = {"apple", "a", "banana", "go"};
        Arrays.sort(words, (x, y) -> x.length() - y.length());
        System.out.println(Arrays.toString(words));
    }
}` },
        { t: 'p', text: '**案例问题**：手写快速排序，把一个无序 int 数组原地升序排好。 ' },
        { t: 'code', title: '手写快速排序', code: `import java.util.*;

public class QuickSort {
    public static void quickSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int pivot = a[lo];          // 取第一个为基准
        int i = lo, j = hi;
        while (i < j) {
            while (i < j && a[j] >= pivot) j--;   // 从右找小于基准的
            a[i] = a[j];
            while (i < j && a[i] <= pivot) i++;   // 从左找大于基准的
            a[j] = a[i];
        }
        a[i] = pivot;               // 基准归位
        quickSort(a, lo, i - 1);    // 递归左半
        quickSort(a, i + 1, hi);    // 递归右半
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 8, 1, 9, 3};
        quickSort(a, 0, a.length - 1);
        System.out.println(Arrays.toString(a)); // [1, 2, 3, 5, 8, 9]
    }
}` },
        { t: 'why', items: [
          '挖坑法：先取基准 pivot = a[lo]，从右找小于基准的填到左边、从左找大于基准的填到右边，最后把基准放回中间。',
          '两个内层 while 都带 i < j 条件，防止 i、j 交叉越界。',
          '外层 while 结束时 i == j，该位置就是基准的最终位置，把 pivot 放进去。',
          '递归终止条件 lo >= hi：区间只有一个元素或为空时不再分，否则无限递归栈溢出。',
          '不稳定且最坏 O(n²)：固定取首元素在已有序数组上会退化，实际中常随机选基准或三数取中。'
        ] },
        { t: 'info', text: '**思路与复杂度**：快排：选基准，用挖坑法把小于它的放左边、大于的放右边，再递归两边。平均 O(n log n)、最坏 O(n^2)（已有序时退化）、空间 O(log n)、不稳定。随机选基准或三数取中可避免最坏。归并排序稳定但需 O(n) 额外空间。' },
        { t: 'code', title: '手写归并排序（稳定）', code: `import java.util.*;

public class MergeSort {
    public static void mergeSort(int[] a, int lo, int hi, int[] tmp) {
        if (lo >= hi) return;
        int mid = lo + (hi - lo) / 2;
        mergeSort(a, lo, mid, tmp);
        mergeSort(a, mid + 1, hi, tmp);
        // 合并两个有序段
        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i <= mid) tmp[k++] = a[i++];
        while (j <= hi) tmp[k++] = a[j++];
        for (k = lo; k <= hi; k++) a[k] = tmp[k];
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 8, 1, 9, 3};
        mergeSort(a, 0, a.length - 1, new int[a.length]);
        System.out.println(Arrays.toString(a)); // [1, 2, 3, 5, 8, 9]
    }
}` },
        { t: 'h', text: '易错点与易忘点' },
        { t: 'pitfalls', items: [
          { t: '比较器返回错误', d: '升序比较器返回 x - y（负表示 x 在前），降序返回 y - x；返回逻辑写反结果就反了。' },
          { t: 'int 相减溢出', d: '比较器里 x - y 可能溢出 int（如 Integer.MIN_VALUE - 1），大数比较用 Integer.compare(x, y)。' },
          { t: '基本类型不能用比较器', d: 'Arrays.sort(int[]) 没有带比较器的重载，要降序得转成 Integer[] 或用流。' },
          { t: '稳定性', d: '快排不稳定、归并稳定；需要保持相等元素相对顺序时选稳定排序。' },
          { t: '快排基准选择', d: '固定取第一个元素在「已有序」时退化成 O(n^2)，可随机取基准或三数取中。' },
          { t: '递归忘了终止条件', d: '快排 / 归并都要先写 if (lo >= hi) return，否则栈溢出。' }
        ]},
        { t: 'h', text: '经典题目' },
        { t: 'problems', items: [
          { name: '排序数组', diff: 'medium', note: '手写快排 / 归并 / 堆排' },
          { name: '颜色分类', diff: 'medium', note: '荷兰国旗三路划分' },
          { name: '数组中的第 K 个最大元素', diff: 'medium', note: '快速选择 / 堆' },
          { name: '合并区间', diff: 'medium', note: '按起点排序后合并' },
          { name: '根据身高重建队列', diff: 'medium', note: '二维排序技巧' }
        ]}
      ]
    }
  ],
  quiz: [
    { q: '二分查找的时间复杂度是？', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, explain: '每次排除一半，最多比较 log n 次，O(log n)。' },
    { q: '计算中点 mid 防溢出的正确写法是？', options: ['(left + right) / 2', 'left + (right - left) / 2', 'left / 2 + right', '(right - left) / 2'], answer: 1, explain: 'left + (right - left) / 2 避免 left + right 直接相加溢出。' },
    { q: '哪种排序是稳定的？', options: ['快速排序', '堆排序', '归并排序', '选择排序'], answer: 2, explain: '归并排序在合并时相等元素保持原顺序，是稳定排序；快排、堆排、选择排序都不稳定。' },
    { q: '对基本类型 int[] 做降序排序，正确的是？', options: ['Arrays.sort(a, (x,y)->y-x)', 'Arrays.sort(a) 就是降序', '转成 Integer[] 再用比较器', '不能降序'], answer: 2, explain: 'int[] 没有带比较器的重载，需转成 Integer[]（或先升序再反转）。' }
  ],
  exercises: [
    {
      id: 'ex-c4-1',
      title: '练习 1：二分查找',
      level: '入门',
      brief: '给定升序数组 nums 和目标值 target，用二分查找返回 target 的下标，不存在返回 -1。',
      requirements: [
        '类名 BinarySearch，方法 search(int[] nums, int target)',
        '左闭右闭区间，while (left <= right)',
        'mid 用 left + (right - left) / 2 防溢出',
        'main 测试 {1,3,5,7,9,11} 中找 7 返回 3，找 4 返回 -1'
      ],
      starter: `public class BinarySearch {
    public int search(int[] nums, int target) {
        // TODO: 二分查找
        return -1;
    }

    public static void main(String[] args) {
        BinarySearch b = new BinarySearch();
        System.out.println(b.search(new int[]{1, 3, 5, 7, 9, 11}, 7)); // 3
        System.out.println(b.search(new int[]{1, 3, 5, 7, 9, 11}, 4)); // -1
    }
}`,
      expectedOutput: '3\n-1',
      keyPoints: [
        { label: 'left 和 right 初始化', test: /int\s+left\s*=\s*0[\s\S]*int\s+right\s*=\s*\w+\.length\s*-\s*1|int\s+left\s*=\s*0[\s\S]*right\s*=\s*\w+\.length\s*-\s*1/ },
        { label: 'while (left <= right)', test: /while\s*\(\s*left\s*<=\s*right/ },
        { label: 'mid 防溢出写法', test: /mid\s*=\s*left\s*\+\s*\(right\s*-\s*left\)\s*\/\s*2/ },
        { label: '比较 nums[mid] 与 target', test: /nums\[mid\]\s*==\s*target|nums\[mid\]\s*<\s*target/ },
        { label: '收缩 left = mid + 1', test: /left\s*=\s*mid\s*\+\s*1/ }
      ],
      hints: [
        'left = 0，right = nums.length - 1',
        'while (left <= right) 循环',
        'mid = left + (right - left) / 2',
        'nums[mid] == target 返回 mid，小于则 left = mid+1，大于则 right = mid-1'
      ],
      analysis: '每次取中点与 target 比较，相等返回；小于 target 说明在右半（left = mid+1），大于说明在左半（right = mid-1）。区间每次减半，O(log n)。',
      solution: `public class BinarySearch {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        BinarySearch b = new BinarySearch();
        System.out.println(b.search(new int[]{1, 3, 5, 7, 9, 11}, 7)); // 3
        System.out.println(b.search(new int[]{1, 3, 5, 7, 9, 11}, 4)); // -1
    }
}`
    },
    {
      id: 'ex-c4-2',
      title: '练习 2：查找元素的第一个和最后一个位置',
      level: '中等',
      brief: '给定升序数组 nums 和目标值 target，找出 target 在数组中出现的第一个和最后一个位置；不存在返回 [-1, -1]。',
      requirements: [
        '类名 SearchRange，方法 searchRange(int[] nums, int target)',
        '分别二分查找左边界和右边界',
        '返回 int[]{first, last}',
        'main 测试 {5,7,7,8,8,10} 找 8 返回 3 4，找 6 返回 -1 -1'
      ],
      starter: `public class SearchRange {
    public int[] searchRange(int[] nums, int target) {
        // TODO: 找第一个和最后一个位置
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        SearchRange s = new SearchRange();
        int[] r1 = s.searchRange(new int[]{5, 7, 7, 8, 8, 10}, 8);
        System.out.println(r1[0] + " " + r1[1]); // 3 4
        int[] r2 = s.searchRange(new int[]{5, 7, 7, 8, 8, 10}, 6);
        System.out.println(r2[0] + " " + r2[1]); // -1 -1
    }
}`,
      expectedOutput: '3 4\n-1 -1',
      keyPoints: [
        { label: '写了一个二分查找辅助方法', test: /int\s+\w*[Bb]ound|int\s+search/ },
        { label: '左边界右移：left 或 lo = mid + 1', test: /(?:left|lo)\s*=\s*mid\s*\+\s*1/ },
        { label: '右边界左移：right 或 hi = mid - 1', test: /(?:right|hi)\s*=\s*mid\s*-\s*1/ },
        { label: '记录找到的下标', test: /first\s*=|last\s*=|result\s*=|ans\s*=/ },
        { label: '返回 first 和 last', test: /new\s+int\[\]\s*\{\s*\w+\s*,\s*\w+\s*\}/ }
      ],
      hints: [
        '写一个辅助方法 findBound(nums, target, left) 找边界',
        '找左边界：mid == target 时 right = mid - 1，继续向左找',
        '找右边界：mid == target 时 left = mid + 1，继续向右找',
        '都找不到（first > last）返回 {-1, -1}'
      ],
      analysis: '分别做两次二分：找左边界时即使命中 target 也继续向左收缩，找右边界时继续向右收缩。两次二分各 O(log n)，总 O(log n)。',
      solution: `public class SearchRange {
    public int[] searchRange(int[] nums, int target) {
        int first = findBound(nums, target, true);
        int last = findBound(nums, target, false);
        return new int[]{first, last};
    }

    // left=true 找左边界，否则找右边界
    private int findBound(int[] nums, int target, boolean left) {
        int lo = 0, hi = nums.length - 1, res = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                res = mid;
                if (left) hi = mid - 1; else lo = mid + 1;
            } else if (nums[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return res;
    }

    public static void main(String[] args) {
        SearchRange s = new SearchRange();
        int[] r1 = s.searchRange(new int[]{5, 7, 7, 8, 8, 10}, 8);
        System.out.println(r1[0] + " " + r1[1]); // 3 4
        int[] r2 = s.searchRange(new int[]{5, 7, 7, 8, 8, 10}, 6);
        System.out.println(r2[0] + " " + r2[1]); // -1 -1
    }
}`
    },
    {
      id: 'ex-c4-3',
      title: '练习 3：数组中的第 K 个最大元素',
      level: '中等',
      brief: '给定整数数组 nums 和整数 k，返回数组中第 k 个最大的元素（排序后倒数第 k 个）。',
      requirements: [
        '类名 KthLargest，方法 findKthLargest(int[] nums, int k)',
        '可以先排序再取（简单做法）',
        '排序后第 k 大 = 升序数组下标 nums.length - k',
        'main 测试 {3,2,1,5,6,4}, k=2 返回 5'
      ],
      starter: `import java.util.*;

public class KthLargest {
    public int findKthLargest(int[] nums, int k) {
        // TODO: 返回第 k 大的元素
        return 0;
    }

    public static void main(String[] args) {
        KthLargest k = new KthLargest();
        System.out.println(k.findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2)); // 5
    }
}`,
      expectedOutput: '5',
      keyPoints: [
        { label: '使用 Arrays.sort 排序', test: /Arrays\.sort/ },
        { label: '下标 length - k', test: /length\s*-\s*k/ },
        { label: '返回对应元素', test: /return\s+nums\[/ },
        { label: '方法签名 findKthLargest', test: /findKthLargest/ }
      ],
      hints: [
        'Arrays.sort(nums) 升序',
        '第 k 大在升序数组里下标是 nums.length - k',
        '返回 nums[nums.length - k]'
      ],
      analysis: '简单做法：升序排序后，倒数第 k 个即第 k 大，下标为 nums.length - k，O(n log n)。进阶可用「快速选择」（O(n) 平均）或大小为 k 的最小堆（见第 7 章堆）。',
      solution: `import java.util.*;

public class KthLargest {
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }

    public static void main(String[] args) {
        KthLargest k = new KthLargest();
        System.out.println(k.findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2)); // 5
    }
}`
    }
  ]
});
