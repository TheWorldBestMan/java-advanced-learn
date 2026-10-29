(function () {
  'use strict';

  /* ================= 工具 ================= */
  function $(sel) { return document.querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  var BT = String.fromCharCode(96); // 反引号，避免在字符串里直接写反引号
  function escCode(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function inlineMd(text) {
    var s = esc(text);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(new RegExp(BT + '([^' + BT + ']+)' + BT, 'g'), '<code class="inline">$1</code>');
    return s;
  }
  function toast(msg, ok) {
    var host = $('#toastHost');
    var d = document.createElement('div');
    d.className = 'toast' + (ok ? ' ok' : '');
    d.textContent = msg;
    host.appendChild(d);
    setTimeout(function () { d.remove(); }, 2200);
  }

  /* ================= 代码高亮 ================= */
  var KW = ('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var').split(' ');
  var KWSET = {};
  KW.forEach(function (w) { KWSET[w] = 1; });

  function highlight(code) {
    var s = escCode(code);
    var out = '', i = 0, n = s.length;
    while (i < n) {
      var c = s[i];
      if (c === '/' && s[i + 1] === '*') {
        var j = s.indexOf('*/', i + 2); j = j === -1 ? n : j + 2;
        out += '<span class="tok-com">' + s.slice(i, j) + '</span>'; i = j; continue;
      }
      if (c === '/' && s[i + 1] === '/') {
        var j2 = s.indexOf('\n', i); j2 = j2 === -1 ? n : j2;
        out += '<span class="tok-com">' + s.slice(i, j2) + '</span>'; i = j2; continue;
      }
      if (c === '"') {
        var j3 = i + 1;
        while (j3 < n && s[j3] !== '"') { if (s[j3] === '\\') j3++; j3++; }
        j3 = Math.min(j3 + 1, n);
        out += '<span class="tok-str">' + s.slice(i, j3) + '</span>'; i = j3; continue;
      }
      if (c === "'") {
        var j4 = i + 1;
        while (j4 < n && s[j4] !== "'") { if (s[j4] === '\\') j4++; j4++; }
        j4 = Math.min(j4 + 1, n);
        out += '<span class="tok-str">' + s.slice(i, j4) + '</span>'; i = j4; continue;
      }
      if (/[0-9]/.test(c)) {
        var j5 = i;
        while (j5 < n && /[0-9a-fA-FxX._]/.test(s[j5])) j5++;
        out += '<span class="tok-num">' + s.slice(i, j5) + '</span>'; i = j5; continue;
      }
      if (/[A-Za-z_$]/.test(c)) {
        var j6 = i;
        while (j6 < n && /[A-Za-z0-9_$]/.test(s[j6])) j6++;
        var w = s.slice(i, j6);
        if (KWSET[w]) out += '<span class="tok-kw">' + w + '</span>';
        else if (/^[A-Z]/.test(w)) out += '<span class="tok-type">' + w + '</span>';
        else out += w;
        i = j6; continue;
      }
      out += c; i++;
    }
    return out;
  }

  function codeBlock(title, code, lang, numbered) {
    return '<div class="code-wrap">'
      + '<div class="code-head">'
      + (title ? '<span>' + esc(title) + '</span>' : '')
      + '<span class="lang">' + esc(lang || 'java') + '</span>'
      + '<button class="copy" data-copy="1" type="button">复制</button>'
      + '</div>'
      + '<pre class="code">' + (numbered ? code.split('\n').map(function (line, i) { return '<span class="source-line" data-line="' + (i + 1) + '">' + highlight(line) + '</span>'; }).join('\n') : highlight(code)) + '</pre>'
      + '</div>';
  }

  /* ================= 力扣题目标题 -> slug 映射 ================= */
  var SLUGS = {
    '两数之和': 'two-sum', '移动零': 'move-zeroes', '合并区间': 'merge-intervals',
    '旋转图像': 'rotate-image', '最大子数组和': 'maximum-subarray', '反转字符串': 'reverse-string',
    '有效的字母异位词': 'valid-anagram', '无重复字符的最长子串': 'longest-substring-without-repeating-characters',
    '最长回文子串': 'longest-palindromic-substring', '字符串转换整数 (atoi)': 'string-to-integer-atoi',
    '反转链表': 'reverse-linked-list', '环形链表': 'linked-list-cycle', '环形链表 II': 'linked-list-cycle-ii',
    '合并两个有序链表': 'merge-two-sorted-lists', '删除链表的倒数第 N 个节点': 'remove-nth-node-from-end-of-list',
    '相交链表': 'intersection-of-two-linked-lists', '有效的括号': 'valid-parentheses', '最小栈': 'min-stack',
    '每日温度': 'daily-temperatures', '逆波兰表达式求值': 'evaluate-reverse-polish-notation',
    '柱状图中最大的矩形': 'largest-rectangle-in-histogram', '用栈实现队列': 'implement-queue-using-stacks',
    '用队列实现栈': 'implement-stack-using-queues', '滑动窗口最大值': 'sliding-window-maximum',
    '二叉树的层序遍历': 'binary-tree-level-order-traversal', '完全平方数': 'perfect-squares',
    '字母异位词分组': 'group-anagrams', '存在重复元素': 'contains-duplicate', 'LRU 缓存': 'lru-cache',
    '最长连续序列': 'longest-consecutive-sequence', '两数之和 II - 输入有序数组': 'two-sum-ii-input-array-is-sorted',
    '盛最多水的容器': 'container-with-most-water', '三数之和': '3sum', '长度最小的子数组': 'minimum-size-subarray-sum',
    '找到字符串中所有字母异位词': 'find-all-anagrams-in-a-string', '最小覆盖子串': 'minimum-window-substring',
    '替换后的最长重复字符': 'longest-repeating-character-replacement', '区域和检索 - 数组不可变': 'range-sum-query-immutable',
    '和为 K 的子数组': 'subarray-sum-equals-k', '连续数组': 'contiguous-array',
    '二维区域和检索': 'range-sum-query-2d-immutable', '和可被 K 整除的子数组': 'subarray-sums-divisible-by-k',
    '二分查找': 'binary-search', '搜索插入位置': 'search-insert-position',
    '在排序数组中查找元素的第一个和最后一个位置': 'find-first-and-last-position-of-element-in-sorted-array',
    '寻找峰值': 'find-peak-element', '搜索旋转排序数组': 'search-in-rotated-sorted-array', '排序数组': 'sort-an-array',
    '颜色分类': 'sort-colors', '数组中的第 K 个最大元素': 'kth-largest-element-in-an-array',
    '根据身高重建队列': 'queue-reconstruction-by-height', '爬楼梯': 'climbing-stairs', '斐波那契数': 'fibonacci-number',
    '汉诺塔问题': 'hanota-lcci', 'Pow(x, n)': 'powx-n', '多数元素': 'majority-element',
    '为运算表达式设计优先级': 'different-ways-to-add-parentheses', '全排列': 'permutations', '子集': 'subsets',
    '组合总和': 'combination-sum', '括号生成': 'generate-parentheses', 'N 皇后': 'n-queens',
    '二叉树的最大深度': 'maximum-depth-of-binary-tree', '对称二叉树': 'symmetric-tree',
    '验证二叉搜索树': 'validate-binary-search-tree', '二叉树的最近公共祖先': 'lowest-common-ancestor-of-a-binary-tree',
    '路径总和': 'path-sum', '二叉树的最小深度': 'minimum-depth-of-binary-tree', '岛屿数量': 'number-of-islands',
    '腐烂的橘子': 'rotting-oranges', '单词接龙': 'word-ladder', '岛屿的最大面积': 'max-area-of-island',
    '二叉树的所有路径': 'binary-tree-paths', '被围绕的区域': 'surrounded-regions',
    '前 K 个高频元素': 'top-k-frequent-elements', '合并 K 个有序链表': 'merge-k-sorted-lists',
    '数据流的中位数': 'find-median-from-data-stream', '最后一块石头的重量': 'last-stone-weight',
    '分发饼干': 'assign-cookies', '无重叠区间': 'non-overlapping-intervals', '跳跃游戏': 'jump-game',
    '买卖股票的最佳时机 II': 'best-time-to-buy-and-sell-stock-ii', '用最少数量的箭引爆气球': 'minimum-number-of-arrows-to-burst-balloons',
    '打家劫舍': 'house-robber', '不同路径': 'unique-paths', '买卖股票的最佳时机': 'best-time-to-buy-and-sell-stock',
    '分割等和子集': 'partition-equal-subset-sum', '0-1 背包 / 分割等和子集': 'partition-equal-subset-sum',
    '零钱兑换': 'coin-change', '最长公共子序列': 'longest-common-subsequence', '最长递增子序列': 'longest-increasing-subsequence',
    '编辑距离': 'edit-distance', '克隆图': 'clone-graph', '课程表': 'course-schedule',
    '课程表 II': 'course-schedule-ii', '课程表 IV': 'course-schedule-iv', '网络延迟时间': 'network-delay-time',
    '省份数量': 'number-of-provinces', '冗余连接': 'redundant-connection',
    '等式方程的可满足性': 'satisfiability-of-equality-equations', '连通网络的操作次数': 'number-of-operations-to-make-network-connected',
    '外星文字典': 'alien-dictionary', '重新安排行程': 'reconstruct-itinerary'
  };
  function slugFor(name) {
    if (SLUGS[name]) return SLUGS[name];
    var base = String(name).split('（')[0].split('(')[0].trim();
    return SLUGS[base] || null;
  }

  /* ================= 内容块渲染 ================= */
  function renderBlock(b) {
    if (!b) return '';
    var t = b.t;
    if (t === 'p') return '<p class="block">' + inlineMd(b.text) + '</p>';
    if (t === 'h') return '<h3 class="block">' + esc(b.text) + '</h3>';
    if (t === 'code') return codeBlock(b.title, b.code, b.lang);
    if (t === 'quick-start') {
      var item=b.item;
      return '<section class="quick-start" id="'+esc(item.id)+'" data-quick-start="'+esc(item.id)+'" aria-label="常见符号与简单使用案例">'
        + '<h3>常见符号 / 方法速查</h3><p class="muted small">先看常用写法，再运行下面的小例子；表中注明“自定义”的方法会在完整程序中定义。</p>'
        + '<p class="muted small quick-table-hint">表格可左右滑动，查看完整写法和说明。</p>'
        + renderBlock({t:'table',head:['符号 / 方法','作用','最小写法','说明 / 结果'],rows:b.rows.map(function(row){return row.map(function(cell,i){return i===0||i===2?BT+cell+BT:cell;});})})
        + '<h3>简单使用案例：'+esc(b.title)+'</h3><p>'+inlineMd(b.intro)+'</p>'
        + codeBlock('Java 入门示例 · 可直接复制运行',item.code,'java',true)
        + '<div class="case-output"><strong>原示例的预期输出</strong><pre>'+escCode(item.expectedOutput)+'</pre></div>'
        + '<div class="quick-explanation"><strong>跟着读一遍</strong><ol>'+b.steps.map(function(step){return '<li>'+inlineMd(step)+'</li>';}).join('')+'</ol><p><strong>先记住：</strong>'+inlineMd(b.pitfall)+'</p></div>'
        + (window.LearningTools?window.LearningTools.editor(item):'')+'</section>';
    }
    if (t === 'list') {
      var li = b.items.map(function (x) { return '<li>' + inlineMd(x) + '</li>'; }).join('');
      return '<ul class="block">' + li + '</ul>';
    }
    if (t === 'case-studies') {
      return '<div class="case-studies"><p class="muted small">下列空间复杂度默认指额外工作空间，不计输入与必须返回的结果；哈希操作按平均情况讨论。</p>' + (b.items || []).map(function (item, i) {
        return '<article class="case-study" id="' + esc(item.id || '') + '">'
          + '<h4>场景 ' + (i + 1) + '：' + inlineMd(item.scenario) + '</h4>'
          + '<p><strong>具体题目：</strong>' + inlineMd(item.question) + '</p>'
          + '<p><strong>示例说明：</strong>' + inlineMd(item.sample) + '</p>'
          + '<p><strong>解决方法：</strong>' + inlineMd(item.solution) + '</p>'
          + (window.LearningTools ? window.LearningTools.tradeoff(item) : '')
          + (item.code ? codeBlock('Java 完整代码：' + (item.code.match(/public class (\w+)/) || ['', ''])[1], item.code, 'java', true) : '')
          + (window.LearningTools ? window.LearningTools.notes(item) : '')
          + (item.expectedOutput != null ? '<div class="case-output"><strong>原代码的预期输出：</strong><pre>' + escCode(item.expectedOutput) + '</pre></div>' : '')
          + (window.LearningTools ? window.LearningTools.editor(item) : '')
          + '</article>';
      }).join('') + '</div>';
    }
    if (t === 'table') {
      var th = b.head.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('');
      var tr = b.rows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + inlineMd(c) + '</td>'; }).join('') + '</tr>';
      }).join('');
      return '<div class="table-wrap"><table class="kt"><thead><tr>' + th + '</tr></thead><tbody>' + tr + '</tbody></table></div>';
    }
    if (t === 'tip') return '<div class="box tip"><div class="box-title">💡 提示</div>' + inlineMd(b.text) + '</div>';
    if (t === 'warn') return '<div class="box warn"><div class="box-title">⚠️ 注意</div>' + inlineMd(b.text) + '</div>';
    if (t === 'info') return '<div class="box info"><div class="box-title">ℹ️ 说明</div>' + inlineMd(b.text) + '</div>';
    if (t === 'why') {
      var li2 = (b.items || []).map(function (x) { return '<li>' + inlineMd(x) + '</li>'; }).join('');
      return '<div class="box why"><div class="box-title">🤔 为什么这么写</div><ul class="block">' + li2 + '</ul></div>';
    }
    if (t === 'pitfalls') {
      var pit = (b.items || []).map(function (it) {
        return '<div class="pitfall-item"><div class="p-head">' + esc(it.t) + '</div><p>' + inlineMd(it.d) + '</p></div>';
      }).join('');
      return '<div class="box warn"><div class="box-title">易错点 · 易忘点</div>' + pit + '</div>';
    }
    if (t === 'problems') {
      var pr = (b.items || []).map(function (it) {
        var diffCls = it.diff === 'hard' ? 'hard' : (it.diff === 'medium' ? 'medium' : 'easy');
        var diffTxt = it.diff === 'hard' ? '困难' : (it.diff === 'medium' ? '中等' : '简单');
        var slug = it.slug || slugFor(it.name);
        var link = slug ? ('https://leetcode.cn/problems/' + encodeURIComponent(slug) + '/') : 'https://leetcode.cn/problemset/';
        return '<a class="problem-item" href="' + link + '" target="_blank" rel="noopener">'
          + '<span class="diff ' + diffCls + '">' + diffTxt + '</span>'
          + '<span class="p-name">' + (it.number ? esc(it.number) + '. ' : '') + esc(it.name) + ' ↗</span></a>'
          + (it.note ? '<div class="muted small" style="margin:-2px 0 8px 12px">' + inlineMd(it.note) + '</div>' : '');
      }).join('');
      return '<h3 class="block">' + esc(b.title || '经典题目') + ' <span class="muted small">（点击题目可跳转力扣）</span></h3>' + pr;
    }
    if (t === 'practice') {
      return '<h3 class="block">场景练习 <span class="muted small">（先思考，再展开解析）</span></h3>'
        + '<div class="scenario-practice">' + (b.items || []).map(function (item, i) {
          return '<div class="scenario-question"><strong>第 ' + (i + 1) + ' 题：</strong>' + inlineMd(item[0])
            + '<details><summary>查看答案与解析</summary><p>' + inlineMd(item[1]) + '</p></details></div>';
        }).join('') + '</div>';
    }
    return '';
  }

  /* ================= 状态 / 进度 ================= */
  var KEY = 'java-advanced-progress-v1';
  var state = load();
  function load() {
    var d = { theme: 'dark', doneSections: {}, quiz: {}, doneEx: {}, code: {}, tests: {}, bookmarks: {}, weeklyMinutes: 180, xp: 0 };
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var p = JSON.parse(raw); for (var k in p) { if (Object.prototype.hasOwnProperty.call(p, k)) d[k] = p[k]; } }
      if (!d.tests || typeof d.tests !== 'object' || Array.isArray(d.tests)) d.tests = {};
      if (!d.bookmarks || typeof d.bookmarks !== 'object' || Array.isArray(d.bookmarks)) d.bookmarks = {};
    } catch (e) {}
    return d;
  }
  function save() { return window.LearningStorage.write(KEY, JSON.stringify(state)); }
  function exerciseStatus(id) {
    var result = state.tests[id];
    if (!result) return state.code[id] != null ? 'attempted' : 'new';
    if (result.code !== (state.code[id] != null ? state.code[id] : (findEx(id) || {}).starter)) return 'attempted';
    return result.passed === result.total && result.total > 0 ? 'passed' : 'failed';
  }
  window.LearningProgress = {
    status: function (record) {
      if (record.type === 'exercise') return exerciseStatus(record.id);
      if (record.type === 'lesson') return state.doneSections[record.chapterId + '-' + record.id.split('/')[1]] ? 'read' : 'new';
      if (record.type === 'quiz') { var match = /^quiz-(.+)-(\d+)$/.exec(record.id), ch = match && findChapter(match[1]), q = ch && state.quiz[ch.id]; if (q && q.answers[match[2]] != null) return q.answers[match[2]] === ch.quiz[Number(match[2])].answer ? 'attempted' : 'failed'; }
      if (record.type === 'bug' || record.type === 'project') return window.StudyHub.taskStatus(record.id);
      return 'new';
    },
    bookmarked: function (id) { return !!state.bookmarks[id]; },
    toggleBookmark: function (id) { if (state.bookmarks[id]) delete state.bookmarks[id]; else state.bookmarks[id] = true; save(); },
    quiz: function () { return state.quiz; },
    tests: function () { return state.tests; }
  };
  var BACKUP_KEYS = [KEY, 'java-advanced-case-drafts-v1', 'java-advanced-studio-v1'];
  function exportProgress() {
    try {
      var stores = {};
      BACKUP_KEYS.forEach(function (key) { stores[key] = localStorage.getItem(key); });
      stores[KEY] = JSON.stringify(state);
      if (window.LearningTools) stores['java-advanced-case-drafts-v1'] = JSON.stringify(window.LearningTools.getDrafts());
      if (window.StudyHub) stores['java-advanced-studio-v1'] = JSON.stringify(window.StudyHub.getSaved());
      var backup = { app: 'java-advanced-learn', version: 1, exportedAt: new Date().toISOString(), stores: stores };
      var url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
      var link = document.createElement('a');
      link.href = url; link.download = 'java-learning-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      toast('学习记录已导出', true);
    } catch (e) { toast('导出失败：浏览器无法读取本地记录', false); }
  }
  function isRecord(value) { return value && typeof value === 'object' && !Array.isArray(value); }
  function importProgress(file) {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { toast('备份文件不能超过 20 MB', false); return; }
    file.text().then(function (text) {
      var backup = JSON.parse(text), stores = backup.stores;
      if (backup.app !== 'java-advanced-learn' || backup.version !== 1 || !isRecord(stores)) throw new Error('文件格式不匹配');
      var progress = JSON.parse(stores[KEY]);
      if (!isRecord(progress) || !isRecord(progress.doneSections) || !isRecord(progress.quiz) || !isRecord(progress.doneEx) || !isRecord(progress.code)) throw new Error('学习记录不完整');
      if (progress.tests != null && (!isRecord(progress.tests) || !Object.values(progress.tests).every(function (r) { return isRecord(r) && typeof r.code === 'string' && Number.isSafeInteger(r.passed) && Number.isSafeInteger(r.total) && r.passed >= 0 && r.passed <= r.total; }))) throw new Error('测试记录字段不正确');
      if (progress.bookmarks != null && (!isRecord(progress.bookmarks) || !Object.values(progress.bookmarks).every(function (v) { return typeof v === 'boolean'; }))) throw new Error('收藏记录字段不正确');
      if (!['dark', 'light'].includes(progress.theme) || !Number.isSafeInteger(progress.xp) || progress.xp < 0 ||
          (progress.lastLesson != null && typeof progress.lastLesson !== 'string') ||
          !Object.values(progress.doneSections).every(function (v) { return typeof v === 'boolean'; }) ||
          !Object.values(progress.doneEx).every(function (v) { return typeof v === 'boolean'; }) ||
          !Object.values(progress.code).every(function (v) { return typeof v === 'string'; }) ||
          !Object.values(progress.quiz).every(function (v) { return isRecord(v) && Number.isSafeInteger(v.score) && Number.isSafeInteger(v.total) && isRecord(v.answers); })) throw new Error('学习记录字段不正确');
      BACKUP_KEYS.forEach(function (key) {
        if (stores[key] !== null && typeof stores[key] !== 'string') throw new Error('记录格式不正确');
        if (stores[key] !== null && !isRecord(JSON.parse(stores[key]))) throw new Error('记录内容不正确');
      });
      if (!window.confirm('导入将覆盖此浏览器中的学习进度和代码草稿。确定继续吗？')) return;
      var previous = {};
      BACKUP_KEYS.forEach(function (key) { previous[key] = localStorage.getItem(key); });
      try {
        BACKUP_KEYS.forEach(function (key) { if (stores[key] === null) localStorage.removeItem(key); else localStorage.setItem(key, stores[key]); });
      } catch (error) {
        BACKUP_KEYS.forEach(function (key) { if (previous[key] === null) localStorage.removeItem(key); else localStorage.setItem(key, previous[key]); });
        throw error;
      }
      location.reload();
    }).catch(function (error) { toast('导入失败：' + error.message, false); });
  }

  var CHAPTERS = window.COURSE || [];
  var SECTIONS = [];
  var EXERCISES = [];
  CHAPTERS.forEach(function (ch) {
    ch.sections.forEach(function (s) { SECTIONS.push({ ch: ch, s: s, id: ch.id + '-' + s.id }); });
    (ch.exercises || []).forEach(function (ex) { EXERCISES.push({ ch: ch, ex: ex }); });
  });

  function findChapter(id) { return CHAPTERS.filter(function (c) { return c.id === id; })[0]; }
  function findSection(ch, id) { return ch.sections.filter(function (s) { return s.id === id; })[0]; }

  function totalDone() {
    var n = 0; SECTIONS.forEach(function (s) { if (state.doneSections[s.id]) n++; });
    return n;
  }
  function xp() { return state.xp || 0; }
  function level() { return Math.floor(xp() / 60) + 1; }
  function nextLesson() {
    var last = SECTIONS.filter(function (item) { return item.id === state.lastLesson; })[0];
    if (last && !state.doneSections[last.id]) return last;
    var start = last ? SECTIONS.indexOf(last) + 1 : 0;
    return SECTIONS.slice(start).concat(SECTIONS.slice(0, start)).filter(function (item) { return !state.doneSections[item.id]; })[0] || null;
  }
  function weeklyPlan() {
    var budget = Math.max(30, Math.min(3000, Number(state.weeklyMinutes) || 180)), total = 0, picked = [];
    for (var i = 0; i < SECTIONS.length; i++) { var item = SECTIONS[i]; if (state.doneSections[item.id]) continue; var minutes = Number(item.s.minutes) || Math.ceil(item.ch.minutes / item.ch.sections.length); if (picked.length && total + minutes > budget) break; picked.push(item); total += minutes; }
    return '<div class="card"><div class="card-title">本周学习计划</div><p class="muted small">按未标记完成的小节和预计阅读时间生成，可根据实际进度调整；估时不包含全部练习。</p><form id="weekly-plan"><label>每周可用时间（分钟） <input name="minutes" type="number" min="30" max="3000" step="30" value="' + budget + '"></label> <button class="btn ghost" type="submit">更新计划</button></form>' + (picked.length ? '<p class="muted small">建议 ' + picked.length + ' 节，约 ' + total + ' 分钟阅读：</p><div class="learning-links">' + picked.map(function (item) { return '<button type="button" class="learning-link" data-nav="#/c/' + esc(item.ch.id) + '/s/' + esc(item.s.id) + '">' + esc(item.s.title) + '</button>'; }).join('') + '</div>' : '<p>已标记完成所有小节，可到复习页继续巩固。</p>') + '</div>';
  }

  /* ================= 学习路线与前后衔接 ================= */
  function learningLink(key) {
    var n = window.CoursePath && window.CoursePath.get(key);
    return n ? '<button class="learning-link" type="button" data-learning-step data-nav="' + esc(n.href) + '">' + esc(n.title) + '</button>' : '';
  }
  function chapterLearning(ch) {
    if (!window.CoursePath || !ch.learning) return '';
    var guide = ch.learning, phase = window.CoursePath.phases[guide.phase];
    return '<section class="card learning-chapter" aria-label="章节学习定位">'
      + '<div class="kicker">' + esc(phase.title) + '</div><h2>这一章为什么放在这里</h2><p>' + esc(guide.reason) + '</p>'
      + '<h3>建议先学</h3>' + (guide.requires.length ? '<div class="learning-links">' + guide.requires.map(learningLink).join('') + '</div>' : '<p>从本章开始，先把数组遍历、字符访问与节点引用写熟。</p>')
      + '<h3>对后续学习的作用</h3>' + (guide.unlocks.length ? '<p>这一章的方法会直接用于下面这些后续章节；每节的学习定位会说明具体怎样复用。</p><div class="learning-links">' + guide.unlocks.map(function (id) { var next = window.CoursePath.chapter(id); return '<button class="learning-link" type="button" data-learning-step data-nav="#/c/' + esc(id) + '">第 ' + next.number + ' 章 · ' + esc(next.title) + '</button>'; }).join('') + '</div>' : '<p>本章是专题能力的应用落点：把前面的基础组合成可以独立实现的解法。各小节列出了对应的实际用途与完成标准。</p>')
      + '</section>';
  }
  function sectionLearning(ch, sec) {
    var n = window.CoursePath && window.CoursePath.get(ch.id + '/' + sec.id);
    if (!n) return '';
    var role = n.laterCount >= 10 ? '多章共用的核心基础' : n.unlocks.length >= 2 ? '承前启后的关键方法' : n.unlocks.length ? '后续专题的直接基础' : '专题应用落点';
    return '<section class="learning-guidance" data-learning-section="' + esc(n.key) + '" aria-label="小节学习定位与后续作用">'
      + '<div class="tag-row"><span class="tag">学习难度：' + esc(n.level) + '</span><span class="tag gray">' + role + '</span></div>'
      + '<h3>为什么学这一节</h3><p>' + esc(n.why) + '</p>'
      + '<div class="learning-columns"><div><h4>建议先学</h4>' + (n.requires.length ? '<ul class="learning-dependencies">' + n.requires.map(function (r) { return '<li>' + learningLink(r.key) + '<p>' + esc(r.reason) + '</p></li>'; }).join('') + '</ul>' : '<p>这是整条路线的起点，不要求先学其他算法小节。</p>')
      + '<h4>学到什么程度可以继续</h4><ul>' + n.ready.map(function (text) { return '<li>' + esc(text) + '</li>'; }).join('') + '</ul></div>'
      + '<div><h4>后面哪些内容会用到</h4>' + (n.unlocks.length ? '<p class="muted small">以下 ' + n.unlocks.length + ' 节直接复用这里的方法；沿本路线的先修链，后续共 ' + n.laterCount + ' 节会用到这份基础。</p><ul class="learning-dependencies">' + n.unlocks.map(function (r) { return '<li>' + learningLink(r.key) + '<p>' + esc(r.reason) + '</p></li>'; }).join('') + '</ul>' : '<p>这一节是本专题的应用落点。掌握它，意味着你能将前面的基础迁移到下面的实际问题。</p>')
      + '<h4>实际用途</h4><p>' + esc(n.application) + '</p></div></div>'
      + (n.challenge ? '<details class="learning-challenge"><summary>基础先学什么，挑战何时回访</summary><p>' + esc(n.challenge) + '</p></details>' : '') + '</section>';
  }
  function lessonNavigation(ch, sec) {
    var at = SECTIONS.findIndex(function (item) { return item.ch.id === ch.id && item.s.id === sec.id; });
    function link(item, label) { return '<button class="btn ghost" type="button" data-learning-step data-nav="#/c/' + esc(item.ch.id) + '/s/' + esc(item.s.id) + '"><span>' + label + '</span><strong>' + esc(item.s.title) + '</strong></button>'; }
    return '<nav class="lesson-navigation" aria-label="按学习路线切换小节">'
      + (at > 0 ? link(SECTIONS[at - 1], '← 上一节') : '<button class="btn ghost" type="button" data-learning-step data-nav="#/">返回课程目录</button>')
      + (at + 1 < SECTIONS.length ? link(SECTIONS[at + 1], '下一节 →') : '<button class="btn ghost" type="button" data-learning-step data-nav="#/">已到路线末尾 · 返回课程目录</button>') + '</nav>';
  }

  /* ================= 主题 ================= */
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme || 'dark');
  }

  /* ================= 侧边栏 ================= */
  function renderSidebar() {
    var html = '<div class="brand"><div class="logo">&lt;/&gt;</div><div><div class="name">Java 进阶算法</div><div class="sub">数据结构 · 算法 · 面试</div></div><button class="sidebar-close" type="button" data-close-menu aria-label="关闭课程导航">×</button></div>';
    html += '<button class="nav-item nav-home" type="button" data-nav="#/">首页总览</button>';
    if (window.StudyHub) html += window.StudyHub.nav();
    CHAPTERS.forEach(function (ch, i) {
      var done = ch.sections.every(function (s) { return state.doneSections[ch.id + '-' + s.id]; });
      html += '<div class="nav-group" data-group="' + ch.id + '">';
      html += '<button class="nav-chapter" type="button" data-toggle="' + ch.id + '" aria-expanded="false" aria-controls="nav-' + ch.id + '">';
      html += '<span class="idx">' + pad(i + 1) + '</span>';
      html += '<span>' + esc(ch.title) + '</span>';
      if (done) html += '<span class="done-flag">✓</span>';
      html += '<span class="chev">▶</span></button>';
      html += '<div class="nav-subs" id="nav-' + ch.id + '">';
      ch.sections.forEach(function (s) {
        var sid = ch.id + '-' + s.id;
        var tick = state.doneSections[sid] ? '<span class="tick">✓</span>' : '';
        html += '<button class="nav-item" type="button" data-nav="#/c/' + ch.id + '/s/' + s.id + '">' + esc(s.title) + tick + '</button>';
      });
      html += '<button class="nav-item nav-quiz" type="button" data-nav="#/c/' + ch.id + '/quiz">📝 随堂测验</button>';
      html += '<button class="nav-item nav-ex" type="button" data-nav="#/c/' + ch.id + '/ex">⚡ 编程练习</button>';
      html += '<button class="nav-item nav-interview" type="button" data-nav="#/c/' + ch.id + '/interview">🎯 面试高频题</button>';
      html += '</div></div>';
    });
    $('#sidebar').innerHTML = html;
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ================= 顶部栏 ================= */
  function renderTopbar(crumb) {
    var pct = SECTIONS.length ? Math.round(totalDone() / SECTIONS.length * 100) : 0;
    $('#topbar').innerHTML =
      '<button class="icon-btn menu-btn" type="button" data-menu="1" aria-label="打开课程导航" aria-controls="sidebar" aria-expanded="false">☰</button>'
      + '<div class="crumb">' + crumb + '</div>'
      + '<div class="spacer"></div>'
      + '<div class="progress-badge">Lv.' + level() + ' · ' + xp() + ' XP · 进度 ' + pct + '%</div>'
      + '<button class="btn ghost topbar-search" type="button" data-nav="#/library" title="搜索全部课程与案例">搜索</button>'
      + '<button class="theme-toggle" type="button" data-theme-toggle="1" title="点击切换深色 / 浅色主题">' + (state.theme === 'light' ? '☀️ 浅色模式' : '🌙 深色模式') + '</button>';
  }

  /* ================= 首页 ================= */
  function renderHome() {
    var pct = SECTIONS.length ? Math.round(totalDone() / SECTIONS.length * 100) : 0;
    var target = nextLesson();
    var html = '<div class="card hero">'
      + '<h1>Java 进阶 · 数据结构与算法</h1>'
      + '<p>面向面试与工程实践的进阶算法学习站：' + CHAPTERS.length + ' 大专题、' + SECTIONS.length + ' 个小节。每个小节都按「概念 → 符号与方法 → 简单案例 → 运用场景 → 完整案例 → 题目」组织，复杂专题配多个完整 Java 案例。</p>'
      + '<div class="tag-row">'
      + '<span class="tag">' + CHAPTERS.length + ' 章</span>'
      + '<span class="tag">' + SECTIONS.length + ' 小节</span>'
      + '<span class="tag">' + EXERCISES.length + ' 道编程练习</span>'
      + '<span class="tag gray">纯静态 · 可离线 · 进度本地保存</span>'
      + '</div>'
      + (target ? '<div class="home-next"><div><span class="home-next-label">' + (state.lastLesson || totalDone() ? '继续学习' : '从这里开始') + '</span><strong>' + esc(target.s.title) + '</strong><span>' + esc(target.ch.title) + ' · 约 ' + (target.s.minutes || target.ch.minutes) + ' 分钟</span></div><button class="btn" type="button" data-learning-step data-nav="#/c/' + target.ch.id + '/s/' + target.s.id + '">' + (state.lastLesson || totalDone() ? '继续这一节 →' : '开始第一节 →') + '</button></div>' : '<div class="home-next"><strong>所有小节已完成！</strong><button class="btn ghost" type="button" data-nav="#/library">搜索内容并复习</button></div>')
      + '</div>';

    html += '<div class="card"><div class="card-title">选择学习方式</div><div class="hub-entry-grid"><button class="hub-entry" type="button" data-nav="#/c/' + CHAPTERS[0].id + '"><strong>按路线学习</strong><span>从基础开始，逐节掌握</span></button><button class="hub-entry" type="button" data-nav="#/library"><strong>查找知识</strong><span>搜索知识点、案例与题目</span></button><button class="hub-entry" type="button" data-nav="#/review"><strong>复习与练习</strong><span>回看错题、测试结果和收藏</span></button></div><p class="muted small" id="service-status" role="status">正在检查 Java 运行服务…</p></div>';
    var last = SECTIONS.find(function (item) { return item.id === state.lastLesson; });
    if (last && last.ch.sections.every(function (s) { return state.doneSections[last.ch.id + '-' + s.id]; }) && !(state.quiz[last.ch.id] && state.quiz[last.ch.id].done)) html += '<div class="card"><strong>下一步：巩固 ' + esc(last.ch.title) + '</strong><p class="muted small">已标记读完本章，可以先做随堂测验，再继续下一章。</p><button class="btn" type="button" data-nav="#/c/' + esc(last.ch.id) + '/quiz">进行本章测验</button></div>';
    html += weeklyPlan();
    html += '<div class="card"><div class="card-title">📊 我的学习进度</div>'
      + '<div class="progressbar"><div class="fill" style="width:' + pct + '%"></div></div>'
      + '<p class="muted small">已完成 ' + totalDone() + ' / ' + SECTIONS.length + ' 个小节 · 经验值 ' + xp() + '（Lv.' + level() + '）· 测验 ' + Object.keys(state.quiz).length + ' 章 · 练习 ' + Object.keys(state.doneEx).filter(function (id) { return state.doneEx[id]; }).length + ' 道</p>'
      + '<div class="progress-actions"><button class="btn ghost" type="button" data-export-progress>导出学习记录</button><button class="btn ghost" type="button" data-import-progress>导入学习记录</button><input id="progressBackupFile" type="file" accept=".json,application/json" aria-label="选择学习记录备份文件" hidden></div>'
      + '<p class="muted small">记录与代码草稿保存在当前浏览器。换设备前先导出，再在新设备导入。</p></div>';
    if (window.StudyHub) html += window.StudyHub.home();

    html += '<div class="card"><div class="card-title">📚 课程目录 · 按先修关系与难度编排</div><p class="muted small">先打通基础，再组合方法，最后进入专项应用。每章、每节都会说明为什么学、后续用在哪里，以及可以继续的标准。</p>';
    CHAPTERS.forEach(function (ch, i) {
      if (window.CoursePath && ch.learning && (i === 0 || CHAPTERS[i - 1].learning.phase !== ch.learning.phase)) {
        var phase = window.CoursePath.phases[ch.learning.phase];
        html += '<div class="learning-stage"><h3>' + esc(phase.title) + '</h3><p>' + esc(phase.intro) + '</p></div>';
      }
      var done = ch.sections.every(function (s) { return state.doneSections[ch.id + '-' + s.id]; });
      html += '<button class="problem-item course-row" type="button" data-learning-step data-nav="#/c/' + ch.id + '">'
        + '<span style="font-family:var(--mono);color:var(--accent);min-width:24px">' + pad(i + 1) + '</span>'
        + '<span class="p-name"><strong>' + esc(ch.title) + '</strong>'
        + '<div class="muted small">' + esc(ch.sections.map(function (s) { return s.short || s.title.split('. ')[1] || s.title; }).join(' · ')) + '</div></span>'
        + (done ? '<span style="color:var(--green)">✓</span>' : '<span class="diff medium">' + ch.minutes + ' 分钟</span>')
        + '</button>';
    });
    html += '</div>';

    html += '<div class="card"><div class="card-title">🎯 学习建议</div><ul class="block">'
      + '<li>按目录的四个阶段推进：数据基础 → 递归、顺序与树 → 算法框架与状态 → 进阶专题。每节的「建议先学」可直接跳转复习。</li>'
      + '<li>先达到本节的「可以继续」标准，再进入下一节；涉及尚未学到知识的挑战题，会提示何时回访。</li>'
      + '<li>每个小结：先看「概念」与「符号 / 方法速查」→ 运行「简单使用案例」→ 再做「使用案例」 → 读「易错点」避开坑 → 做「题目」巩固。</li>'
      + '<li>案例可点击「编辑 / 运行代码」动手修改；使用「启动学习网站.bat」打开后，可调用本机 JDK 运行。</li>'
      + '<li>用算法步骤演示观察变量变化；编程练习可运行 5 组公开测试，逐组核对输入与结果。</li>'
      + '<li>每天 1~2 个专题，配 3~5 道题，一个月能系统过一遍常见面试算法。</li>'
      + '</ul></div>';

    $('#content').innerHTML = html;
    var service = $('#service-status');
    if (location.protocol === 'file:' || /\.github\.io$/i.test(location.hostname)) service.textContent = '课程和演示可直接使用；运行 Java 需在电脑上启动本地服务并安装 JDK。';
    else fetch('/api/status').then(function (r) { if (!r.ok) throw new Error(); return r.json(); }).then(function (s) { if (service.isConnected) service.textContent = s.jdk.java && s.jdk.javac ? 'Java 运行服务和 JDK 已就绪。' + (s.requiresToken ? '局域网运行需要启动窗口中的访问码。' : '') : '运行服务已连接，但未检测到完整 JDK；请安装后重启服务。'; }).catch(function () { if (service.isConnected) service.textContent = '当前可阅读课程；Java 运行服务未连接，请使用启动脚本。'; });
  }

  /* ================= 章节页 ================= */
  function renderChapter(ch, sectionId) {
    var done = ch.sections.every(function (s) { return state.doneSections[ch.id + '-' + s.id]; });
    var selected = findSection(ch, sectionId) || ch.sections[0];
    if (selected) sectionId = selected.id;
    var html = '<div class="card chapter-head">'
      + '<div class="kicker">第 ' + pad(CHAPTERS.indexOf(ch) + 1) + ' 章 · 约 ' + ch.minutes + ' 分钟' + (done ? ' · ✅ 已全部完成' : '') + '</div>'
      + '<h1>' + esc(ch.title) + '</h1>'
      + '<div class="meta">' + ch.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>'
      + '<div class="goals"><div class="g-title">本章学习目标</div><ul>' + ch.goals.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></div>'
      + '</div>';

    html += chapterLearning(ch);

    html += '<div class="section-tabs">';
    ch.sections.forEach(function (s) {
      var sid = ch.id + '-' + s.id;
      var active = s.id === sectionId;
      var tick = state.doneSections[sid] ? ' ✓' : '';
      html += '<button class="section-tab' + (active ? ' active' : '') + '" type="button" data-nav="#/c/' + ch.id + '/s/' + s.id + '">' + esc(s.title) + tick + '</button>';
    });
    html += '</div>';

    var sec = findSection(ch, sectionId) || ch.sections[0];
    if (sec) html += renderSectionBody(ch, sec);

    $('#content').innerHTML = html;
  }

  function renderSectionBody(ch, sec) {
    var sid = ch.id + '-' + sec.id;
    var done = !!state.doneSections[sid];
    var html = '<div class="card">';
    html += '<div class="card-title">' + esc(sec.title) + '</div>';
    if (sec.minutes) html += '<div class="card-sub">预计阅读 ' + sec.minutes + ' 分钟</div>';
    html += '<div class="progressbar"><div class="fill" style="width:' + (done ? 100 : 0) + '%"></div></div>';
    html += sectionLearning(ch, sec);
    html += '<nav class="lesson-jumps" aria-label="本节快捷导航"><button type="button" data-scroll-to="lesson-content">概念</button><button type="button" data-scroll-to="lesson-quick">入门案例</button><button type="button" data-scroll-to="lesson-demo">步骤演示</button><button type="button" data-scroll-to="lesson-practice">练习</button></nav><div id="lesson-content"></div>';
    sec.blocks.forEach(function (b) {
      if (b.t === 'quick-start') html += '<div id="lesson-quick"></div>';
      if (b.t === 'case-studies') {
        html += '<div id="lesson-demo"></div>';
        if (window.LearningTools) html += window.LearningTools.guide(ch.id + '/' + sec.id);
        if (window.AlgorithmLab) html += window.AlgorithmLab.panel(ch.id + '/' + sec.id);
      }
      if (b.t === 'practice') html += '<div id="lesson-practice"></div>';
      html += renderBlock(b);
    });
    html += '<div class="done-row">'
      + '<button class="btn ' + (done ? 'done' : '') + '" type="button" data-section-done="' + sid + '">' + (done ? '✓ 已完成本节' : '标记本节完成') + '</button>'
      + '<span class="hint-note">标记完成后获得经验值，并记录到本地进度。</span>'
      + '</div><div class="lesson-actions"><button class="btn ghost" type="button" data-nav="#/c/' + esc(ch.id) + '/quiz">进行本章测验</button><button class="btn ghost" type="button" data-nav="#/c/' + esc(ch.id) + '/ex">练习本章代码</button></div>' + lessonNavigation(ch, sec) + '</div>';
    return html;
  }

  /* ================= 面试题页 ================= */
  function renderInterview(ch) {
    var html = '<div class="card chapter-head"><div class="kicker">第 ' + pad(CHAPTERS.indexOf(ch) + 1) + ' 章</div><h1>面试高频题 · ' + esc(ch.title) + '</h1>'
      + '<p class="muted">这些问题面试很可能被问到。建议先自己组织答案，再对照下面的解析；代码题务必亲手写一遍。</p></div>';
    (ch.interview || []).forEach(function (it, i) {
      html += '<div class="card iv-item">'
        + '<div class="iv-q">Q' + (i + 1) + '. ' + inlineMd(it.q) + '</div>'
        + '<div class="iv-a">' + inlineMd(it.a) + '</div>'
        + (it.code ? codeBlock('参考代码', it.code, 'java') : '')
        + '</div>';
    });
    $('#content').innerHTML = html;
  }

  /* ================= 测验页 ================= */
  function renderQuiz(ch) {
    var prev = state.quiz[ch.id];
    var html = '<div class="card chapter-head"><div class="kicker">第 ' + pad(CHAPTERS.indexOf(ch) + 1) + ' 章</div><h1>随堂测验 · ' + esc(ch.title) + '</h1>';
    if (prev && prev.done) html += '<p class="muted">上次成绩：' + prev.score + ' / ' + prev.total + '</p>';
    html += '</div>';

    ch.quiz.forEach(function (q, qi) {
      var answered = prev && prev.answers && prev.answers[qi] != null;
      html += '<div class="card quiz-q" data-q="' + qi + '">'
        + '<div class="q-text">' + (qi + 1) + '. ' + inlineMd(q.q) + '</div>';
      q.options.forEach(function (o, oi) {
        var cls = 'opt';
        if (answered) {
          cls += ' disabled';
          if (oi === q.answer) cls += ' correct';
          if (oi === prev.answers[qi] && oi !== q.answer) cls += ' wrong';
        }
        html += '<button class="' + cls + '" type="button" data-answer="' + qi + ':' + oi + '"' + (answered ? ' disabled' : '') + '>'
          + String.fromCharCode(65 + oi) + '. ' + inlineMd(o) + '</button>';
      });
      if (answered) {
        var right = prev.answers[qi] === q.answer;
        html += '<div class="explain"><div class="e-title">' + (right ? '✅ 回答正确' : '❌ 回答错误，正确答案是 ' + String.fromCharCode(65 + q.answer)) + '</div>' + inlineMd(q.explain) + '</div>';
        if (!right) html += '<button class="btn ghost" type="button" data-quiz-retry="' + qi + '">重做此题</button>';
      }
      html += '</div>';
    });
    $('#content').innerHTML = html;
  }

  function answerQuiz(ch, qi, oi) {
    if (!state.quiz[ch.id]) state.quiz[ch.id] = { score: 0, total: ch.quiz.length, answers: {}, done: false };
    var q = ch.quiz[qi];
    var rec = state.quiz[ch.id];
    if (rec.answers[qi] != null) return;
    rec.answers[qi] = oi;
    if (oi === q.answer) { rec.score++; if (!rec.retried || !rec.retried[qi]) { state.xp = (state.xp || 0) + 2; toast('回答正确 +2 XP', true); } else toast('回答正确', true); }
    else toast('回答错误，看看解析', false);
    var all = ch.quiz.every(function (_, i) { return rec.answers[i] != null; });
    if (all) rec.done = true;
    save();
    renderQuiz(ch);
    renderSidebar(); renderTopbar(crumb());
  }

  /* ================= 练习页 ================= */
  function renderExercises(ch) {
    var html = '<div class="card chapter-head"><div class="kicker">第 ' + pad(CHAPTERS.indexOf(ch) + 1) + ' 章</div><h1>编程练习 · ' + esc(ch.title) + '</h1>'
      + '<p class="muted">修改代码后可运行 main，也可以运行每题 5 组公开测试。测试逐组调用解题方法，展示输入、预期和实际结果；结构提示帮助检查写法。</p></div>';
    ch.exercises.forEach(function (ex) {
      html += renderExercise(ex);
    });
    $('#content').innerHTML = html;
  }

  function renderExercise(ex) {
    var done = !!state.doneEx[ex.id];
    var code = state.code[ex.id] != null ? state.code[ex.id] : ex.starter;
    var labels = {new:'尚未尝试',attempted:'已尝试 · 需要运行当前代码的测试',passed:'当前代码已通过公开测试',failed:'公开测试未全部通过'};
    var lvCls = ex.level === '困难' ? 'lv-hard' : (ex.level === '中等' ? 'lv-med' : 'lv-easy');
    var html = '<div class="exercise" id="ex-' + ex.id + '">'
      + '<div class="ex-head"><span class="ex-title">' + esc(ex.title) + '</span>'
      + '<span class="level-badge ' + lvCls + '">' + esc(ex.level) + '</span>'
      + (done ? '<span style="color:var(--green);font-weight:700">✓ 已完成</span>' : '')
      + '</div>'
      + '<p class="exercise-status muted small" data-ex-status="' + esc(ex.id) + '" aria-live="polite">' + labels[exerciseStatus(ex.id)] + '</p>'
      + '<div class="brief">' + inlineMd(ex.brief) + '</div>'
      + '<div class="req-title">要求</div><ul class="req">' + ex.requirements.map(function (r) { return '<li>' + inlineMd(r) + '</li>'; }).join('') + '</ul>';
    if (ex.expectedOutput) {
      html += '<div class="req-title">期望输出示例</div>' + codeBlock('', ex.expectedOutput, 'text');
    }
    html += '<div class="mobile-ex-nav"><button type="button" data-scroll-to="ex-' + ex.id + '">题目</button><button type="button" data-scroll-to="code-' + ex.id + '">代码</button><button type="button" data-scroll-to="tests-' + ex.id + '">测试结果</button></div><div class="req-title">✍️ 你的代码</div>'
      + (window.LearningTools ? window.LearningTools.testPanel(ex) : '')
      + '<div class="code-wrap"><textarea class="java-editor" aria-label="' + esc(ex.title) + '代码编辑器" spellcheck="false" id="code-' + ex.id + '">' + esc(code) + '</textarea></div><p class="muted small" data-ex-save="' + esc(ex.id) + '" aria-live="polite">修改自动保存在当前浏览器。按 Shift+Tab 可离开编辑器。</p>'
      + '<div class="ex-actions">'
      + '<button class="btn run" type="button" data-ex-run="' + ex.id + '">▶ 运行代码</button>'
      + '<button class="btn" type="button" data-ex-test="' + ex.id + '">运行 5 组公开测试</button>'
      + '<button class="btn ghost" type="button" data-ex-check="' + ex.id + '">检查代码结构</button>'
      + '<button class="btn ghost" type="button" data-ex-hint="' + ex.id + '">💡 显示提示</button>'
      + '<button class="btn ghost" type="button" data-ex-solution="' + ex.id + '">👁 参考答案</button>'
      + '<button class="btn done" type="button" data-ex-done="' + ex.id + '">' + (done ? '✓ 已完成' : '标记完成') + '</button>'
      + '</div>'
      + '<div class="run-out-box" id="out-' + ex.id + '"></div>'
      + '<div class="test-results" id="tests-' + ex.id + '" tabindex="-1" aria-live="polite"></div>'
      + '<div class="keypoint-check" id="kp-' + ex.id + '"></div>'
      + '<div class="hint-box" id="hint-' + ex.id + '">' + ex.hints.map(function (h, i) { return '<div style="margin:4px 0">' + (i + 1) + '. ' + inlineMd(h) + '</div>'; }).join('') + '</div>'
      + '<div class="solution-box" id="sol-' + ex.id + '">'
      + (ex.analysis ? '<div class="box info"><div class="box-title">解题思路</div>' + inlineMd(ex.analysis) + '</div>' : '')
      + codeBlock('参考答案', ex.solution, 'java')
      + '</div>'
      + '</div>';
    return html;
  }

  function checkExercise(ex) {
    var ta = $('#code-' + ex.id);
    if (!ta) return;
    var code = ta.value;
    state.code[ex.id] = code; save();
    var box = $('#kp-' + ex.id);
    var html = '<div class="req-title">检查结果</div>';
    var passAll = true;
    ex.keyPoints.forEach(function (kp) {
      var re = new RegExp(kp.test);
      var pass = re.test(code);
      if (!pass) passAll = false;
      html += '<div class="keypoint ' + (pass ? 'pass' : 'fail') + '"><span class="kp-dot">' + (pass ? '✓' : '✗') + '</span>' + esc(kp.label) + '</div>';
    });
    if (passAll) {
      html += '<div class="box tip"><div class="box-title">已匹配这些写法提示</div>结构检查不判断算法是否正确，请继续运行公开测试核对结果。</div>';
      toast('关键点全部通过', true);
    } else {
      html += '<div class="box warn"><div class="box-title">还有未命中的关键点</div>对照提示补全后再试；写法与参考答案不同但逻辑正确也属正常。</div>';
    }
    box.innerHTML = html;
  }

  function runExercise(ex) {
    var ta = $('#code-' + ex.id);
    var out = $('#out-' + ex.id);
    if (!ta || !out) return;
    var code = ta.value;
    state.code[ex.id] = code; save();
    if (window.LearningTools) {
      window.LearningTools.run('/run', { code: code }, out, document.querySelector('[data-ex-run="' + ex.id + '"]'));
      return;
    }
    if (location.protocol === 'file:') {
      out.innerHTML = '<div class="run-out warn"><div class="ro-title">⚠️ 无法运行</div>直接双击 index.html 无法运行代码。请双击「启动学习网站.bat」打开本页面（会启动本地服务器 + 用本机 JDK 编译运行）。</div>';
      return;
    }
    out.innerHTML = '<div class="run-out"><div class="ro-title">⏳ 正在编译运行…</div></div>';
    fetch('/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    }).then(function (r) { return r.json(); }).then(function (d) {
      var h = '';
      if (d.error) {
        h += '<div class="run-out fail"><div class="ro-title">❌ 错误</div>' + esc(d.error) + '</div>';
      } else if (d.compileError) {
        h += '<div class="run-out fail"><div class="ro-title">❌ 编译错误</div><pre>' + esc(d.compileError) + '</pre></div>';
      } else {
        if (d.stdout) h += '<div class="run-out ok"><div class="ro-title">▶ 程序输出</div><pre>' + esc(d.stdout) + '</pre></div>';
        if (d.stderr) h += '<div class="run-out fail"><div class="ro-title">⚠️ 错误输出</div><pre>' + esc(d.stderr) + '</pre></div>';
        if (d.timedOut) h += '<div class="run-out fail"><div class="ro-title">⏱ 超时</div>运行超过 5 秒被自动中止（可能有死循环）。</div>';
        if (!d.stdout && !d.stderr) h += '<div class="run-out ok">程序正常结束，无输出。</div>';
      }
      out.innerHTML = h;
    }).catch(function () {
      out.innerHTML = '<div class="run-out warn"><div class="ro-title">⚠️ 无法连接运行服务</div>请确认是用「启动学习网站.bat」打开的页面，且本机已安装 JDK（javac / java 在 PATH 中）。</div>';
    });
  }

  /* ================= 路由 ================= */
  function parseHash() {
    var h = (location.hash || '#/').split('?')[0];
    var parts = h.replace(/^#\//, '').split('/').filter(Boolean);
    return parts;
  }
  function crumb() {
    var p = parseHash();
    if (!p.length) return '<b>首页</b>';
    if (window.StudyHub && window.StudyHub.handles(p[0])) return '<b>' + esc(window.StudyHub.title(p[0])) + '</b>';
    var ch = findChapter(p[1]);
    if (!ch) return '<b>首页</b>';
    var s = '第 ' + pad(CHAPTERS.indexOf(ch) + 1) + ' 章 <b>' + esc(ch.title) + '</b>';
    if (p[2] === 's') { var sec = findSection(ch, p[3]); if (sec) s += ' / <b>' + esc(sec.title) + '</b>'; }
    else if (p[2] === 'quiz') s += ' / <b>随堂测验</b>';
    else if (p[2] === 'ex') s += ' / <b>编程练习</b>';
    else if (p[2] === 'interview') s += ' / <b>面试高频题</b>';
    return s;
  }

  function render() {
    if (window.AlgorithmLab) window.AlgorithmLab.stopAll();
    if (window.StudyHub) window.StudyHub.stop();
    applyTheme();
    var p = parseHash();
    if (p[0] === 'c' && p[2] === 's') {
      var lessonKey = p[1] + '-' + p[3];
      if (SECTIONS.some(function (item) { return item.id === lessonKey; }) && state.lastLesson !== lessonKey) {
        state.lastLesson = lessonKey; save();
      }
    }
    renderSidebar();
    syncMenu();
    if (window.StudyHub && window.StudyHub.handles(p[0])) { window.StudyHub.render(p); renderTopbar(crumb()); syncNav(); return; }
    var ch = p.length > 1 ? findChapter(p[1]) : null;
    if (!p.length) { renderHome(); renderTopbar(crumb()); syncNav(); return; }
    if (!ch) { $('#content').innerHTML = '<div class="card"><div class="card-title">未找到该章节</div></div>'; renderTopbar(crumb()); return; }
    var kind = p[2];
    if (kind === 'quiz') { renderQuiz(ch); renderTopbar(crumb()); syncNav(); if (window.StudyHub) window.StudyHub.follow(p); return; }
    if (kind === 'ex') { renderExercises(ch); renderTopbar(crumb()); syncNav(); if (window.StudyHub) window.StudyHub.follow(p); return; }
    if (kind === 'interview') { renderInterview(ch); renderTopbar(crumb()); syncNav(); if (window.StudyHub) window.StudyHub.follow(p); return; }
    if (kind === 's') { renderChapter(ch, p[3]); renderTopbar(crumb()); syncNav(); if (window.AlgorithmLab) window.AlgorithmLab.mountAll(); if (window.StudyHub) window.StudyHub.follow(p); return; }
    renderChapter(ch, null); renderTopbar(crumb()); syncNav(); if (window.AlgorithmLab) window.AlgorithmLab.mountAll();
  }

  function syncNav() {
    var h = location.hash.split('?')[0];
    document.querySelectorAll('#sidebar .nav-item').forEach(function (n) {
      var href = n.getAttribute('data-nav');
      n.classList.toggle('active', href === h || (href !== '#/' && h.indexOf(href + '/') === 0));
    });
    var group = document.querySelector('#sidebar [data-group="' + (parseHash()[1] || '') + '"]');
    if (group) {
      group.classList.add('open');
      group.querySelector('.nav-chapter').setAttribute('aria-expanded', 'true');
    }
  }

  /* ================= 事件委托 ================= */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var jump = t.closest('[data-scroll-to]');
    if (jump) { e.preventDefault(); var destination = document.getElementById(jump.getAttribute('data-scroll-to')); if (destination) destination.scrollIntoView({block:'start'}); return; }
    var retry = t.closest('[data-quiz-retry]');
    if (retry) { var chapter = findChapter(parseHash()[1]), qi = Number(retry.dataset.quizRetry), rec = state.quiz[chapter.id]; rec.retried = rec.retried || {}; rec.retried[qi] = true; delete rec.answers[qi]; rec.done = false; save(); renderQuiz(chapter); var qEl = document.querySelector('[data-q="' + qi + '"] button'); if (qEl) qEl.focus(); return; }
    var nav = t.closest('[data-nav]');
    if (nav) {
      var h = nav.getAttribute('data-nav');
      if (nav.hasAttribute('data-learning-step')) window.scrollTo(0, 0);
      if (location.hash === h) render();
      else location.hash = h;
      closeMenu();
      return;
    }
    var tg = t.closest('[data-toggle]');
    if (tg) {
      var isOpen = tg.closest('.nav-group').classList.toggle('open');
      tg.setAttribute('aria-expanded', String(isOpen));
      return;
    }
    if (t.closest('[data-menu]')) { toggleMenu(); return; }
    if (t.closest('[data-close-menu]')) { closeMenu(true); return; }
    if (t.closest('[data-export-progress]')) { exportProgress(); return; }
    if (t.closest('[data-import-progress]')) { $('#progressBackupFile').click(); return; }
    if (t.closest('[data-theme-toggle]')) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      save(); render();
      return;
    }
    if (t.closest('[data-copy]')) {
      var pre = t.closest('.code-wrap').querySelector('pre.code');
      var txt = pre ? pre.textContent : '';
      navigator.clipboard.writeText(txt).then(function () { toast('已复制到剪贴板', true); }, function () { toast('复制失败，请手动选择复制', false); });
      return;
    }
    var sd = t.closest('[data-section-done]');
    if (sd) {
      var sid = sd.getAttribute('data-section-done');
      state.doneSections[sid] = !state.doneSections[sid];
      if (state.doneSections[sid]) { state.xp = (state.xp || 0) + 3; toast('本节完成 +3 XP', true); }
      else state.xp = Math.max(0, (state.xp || 0) - 3);
      save(); render();
      return;
    }
    var ans = t.closest('[data-answer]');
    if (ans) {
      var parts = ans.getAttribute('data-answer').split(':');
      var ch = findChapter(parseHash()[1]);
      answerQuiz(ch, parseInt(parts[0], 10), parseInt(parts[1], 10));
      return;
    }
    var ec = t.closest('[data-ex-check]');
    if (ec) { var ex1 = findEx(ec.getAttribute('data-ex-check')); if (ex1) checkExercise(ex1); return; }
    var er = t.closest('[data-ex-run]');
    if (er) { var exr = findEx(er.getAttribute('data-ex-run')); if (exr) runExercise(exr); return; }
    var eh = t.closest('[data-ex-hint]');
    if (eh) { var b = $('#hint-' + eh.getAttribute('data-ex-hint')); if (b) b.classList.toggle('show'); return; }
    var es = t.closest('[data-ex-solution]');
    if (es) { var b2 = $('#sol-' + es.getAttribute('data-ex-solution')); if (b2) b2.classList.toggle('show'); return; }
    var ed = t.closest('[data-ex-done]');
    if (ed) {
      var id = ed.getAttribute('data-ex-done');
      state.doneEx[id] = !state.doneEx[id];
      if (state.doneEx[id]) { state.xp = (state.xp || 0) + 5; toast('练习完成 +5 XP', true); }
      else state.xp = Math.max(0, (state.xp || 0) - 5);
      save(); render();
      return;
    }
  });

  function findEx(id) {
    var r = null;
    EXERCISES.forEach(function (e) { if (e.ex.id === id) r = e.ex; });
    return r;
  }

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id && e.target.id.indexOf('code-') === 0) {
      var id = e.target.id.slice(5);
      state.code[id] = e.target.value;
      var ok = save(), hint = document.querySelector('[data-ex-save="' + id + '"]'), status = document.querySelector('[data-ex-status="' + id + '"]');
      if (hint) hint.textContent = ok ? '修改已保存。按 Shift+Tab 可离开编辑器。' : '保存失败，请复制当前代码。';
      if (status) status.textContent = exerciseStatus(id) === 'passed' ? '当前代码已通过公开测试' : '代码已修改，请运行当前代码的公开测试。';
    }
  });
  document.addEventListener('learning:test-result', function (e) {
    var d = e.detail, failed = d.result.results ? d.result.results.find(function (r) { return r.state !== 'passed'; }) : {input:'编译未通过',state:'compile_error'};
    state.tests[d.id] = {code:d.code, passed:d.result.results ? d.result.passed : 0, total:d.result.results ? d.result.total : 1, failed:failed ? {input:failed.input, state:failed.state} : null};
    save();
    var el = document.querySelector('[data-ex-status="' + d.id + '"]');
    if (el) el.textContent = exerciseStatus(d.id) === 'passed' ? '当前代码已通过全部公开测试。' : exerciseStatus(d.id) === 'failed' ? '公开测试未全部通过，可在复习页回看。' : '代码已修改，请重新运行公开测试。';
  });
  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'progressBackupFile') {
      importProgress(e.target.files[0]);
      e.target.value = '';
    }
  });
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'weekly-plan') return;
    e.preventDefault();
    var value = Number(e.target.elements.minutes.value);
    if (!Number.isFinite(value) || value < 30 || value > 3000) return;
    state.weeklyMinutes = Math.round(value); save(); renderHome();
    var field = document.querySelector('#weekly-plan input'); if (field) field.focus();
  });

  function syncMenu() {
    var sidebar = $('#sidebar'), open = sidebar.classList.contains('open');
    var mobile = window.matchMedia('(max-width: 820px)').matches;
    sidebar.inert = mobile && !open;
    document.querySelector('.main').inert = mobile && open;
    $('#sidebarBackdrop').classList.toggle('open', mobile && open);
    var trigger = $('[data-menu]');
    if (trigger) {
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', open ? '关闭课程导航' : '打开课程导航');
    }
    document.body.classList.toggle('menu-open', mobile && open);
  }
  function toggleMenu() {
    var sidebar = $('#sidebar');
    sidebar.classList.toggle('open');
    syncMenu();
    if (sidebar.classList.contains('open')) sidebar.querySelector('.nav-home').focus();
  }
  function closeMenu(restoreFocus) {
    var wasOpen = $('#sidebar').classList.contains('open');
    $('#sidebar').classList.remove('open');
    syncMenu();
    if (wasOpen && restoreFocus && $('[data-menu]')) $('[data-menu]').focus();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('#sidebar').classList.contains('open')) closeMenu(true);
  });
  window.addEventListener('resize', syncMenu);

  window.addEventListener('hashchange', function () {
    closeMenu();
    render();
    $('#content').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  });
  render();
})();
