(function () {
  'use strict';
  var topics = window.TOPIC_GUIDES || [];
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function courseLink(link) { return '#/c/' + link[1] + (link[2] ? '/s/' + link[2] : '/ex'); }
  function render(host, parts) {
    var topic = topics.find(function (item) { return item.id === parts[1]; });
    if (!parts[1]) {
      host.innerHTML = '<div class="card chapter-head"><div class="kicker">按知识体系学习</div><h1>专题知识地图</h1><p class="muted">每个专题按分支整理概念、题型识别、解题步骤、例子、易错点和复杂度。先选择一个知识领域，再按需要进入原有课程与外部练习。</p></div><div class="topic-grid">' + topics.map(function (t) {
        return '<article class="card topic-card"><div class="kicker">' + t.branches.length + ' 个知识分支</div><h2>' + esc(t.title) + '</h2><p>' + esc(t.intro) + '</p><p class="muted small">' + esc(t.branches.slice(0,4).map(function (x) { return x.title; }).join(' · ')) + '</p><button class="btn" type="button" data-nav="#/topics/' + esc(t.id) + '">进入专题 →</button></article>';
      }).join('') + '</div>';
      return;
    }
    if (!topic) { host.innerHTML = '<div class="card"><h1>没有找到这个专题</h1><button class="btn" type="button" data-nav="#/topics">返回专题目录</button></div>'; return; }
    var html = '<div class="card chapter-head"><button class="btn ghost" type="button" data-nav="#/topics">← 专题目录</button><div class="kicker">专题知识地图 · ' + topic.branches.length + ' 个分支</div><h1>' + esc(topic.title) + '</h1><p>' + esc(topic.intro) + '</p><p class="muted"><strong>建议先学：</strong>' + esc(topic.prerequisites) + '</p><div class="goals"><div class="g-title">学完能做到</div><ul>' + topic.goals.map(function (goal) { return '<li>' + esc(goal) + '</li>'; }).join('') + '</ul></div></div>';
    html += '<section class="card"><h2>从这里开始</h2><p class="muted small">选择分支查看讲解；题目链接跳转力扣，练习状态与本站记录分开。</p><nav class="topic-jumps" aria-label="专题知识分支">' + topic.branches.map(function (branch) { return '<button type="button" class="learning-link" data-nav="#/topics/' + esc(topic.id) + '/' + esc(branch.id) + '">' + esc(branch.title) + '</button>'; }).join('') + '</nav><h3>相关课程和练习</h3><div class="learning-links">' + topic.links.map(function (link) { return '<button class="learning-link" type="button" data-nav="' + esc(courseLink(link)) + '">' + esc(link[0]) + '</button>'; }).join('') + '</div></section>';
    html += topic.branches.map(function (branch, i) {
      return '<details class="card topic-branch" id="topic-branch-' + esc(branch.id) + '"' + (parts[2] === branch.id ? ' open' : '') + '><summary><span class="topic-index">' + String(i + 1).padStart(2,'0') + '</span><span><strong>' + esc(branch.title) + '</strong><small>' + esc(branch.signal) + '</small></span></summary><div class="topic-content"><h3>核心概念</h3><p>' + esc(branch.core) + '</p><h3>解题步骤</h3><ol>' + branch.steps.map(function (step) { return '<li>' + esc(step) + '</li>'; }).join('') + '</ol><div class="topic-example"><strong>举例理解</strong><p>' + esc(branch.example) + '</p></div><h3>容易出错的地方</h3><p>' + esc(branch.pitfalls) + '</p><h3>时间与空间</h3><p>' + esc(branch.cost) + '</p><h3>常见题型与练习</h3><ul class="topic-problems">' + branch.problems.map(function (problem) { return '<li><a href="https://leetcode.cn/problems/' + esc(problem.slug) + '/" target="_blank" rel="noopener noreferrer">' + problem.number + '. ' + esc(problem.name) + ' ↗</a><span>' + esc(problem.focus) + '</span></li>'; }).join('') + '</ul></div></details>';
    }).join('');
    if (topic.checks && topic.checks.length) {
      html += '<section class="card"><h2>学完自测</h2><p class="muted small">先自己解释，再展开参考思路。</p>' + topic.checks.map(function (check, i) { return '<div class="topic-check"><strong>' + (i + 1) + '. ' + esc(check[0]) + '</strong><details><summary>查看参考思路</summary><p>' + esc(check[1]) + '</p></details></div>'; }).join('') + '</section>';
    }
    if (topic.examples && topic.examples.length) {
      html += '<section class="card"><h2>完整 Java 示例</h2><p class="muted small">可以复制到 IDE 运行；本机启动学习服务后也可点击运行。GitHub Pages 本身不提供 Java 运行环境。</p>' + topic.examples.map(function (example) { return '<article class="topic-code" data-topic-example="' + esc(example.id) + '"><h3>' + esc(example.title) + '</h3><p>' + esc(example.description) + '</p><pre><code>' + esc(example.code) + '</code></pre><p><strong>预期输出：</strong></p><pre><code>' + esc(example.output) + '</code></pre><div class="studio-actions"><button class="btn ghost" type="button" data-topic-copy>复制代码</button><button class="btn" type="button" data-topic-run>运行代码</button></div><div class="topic-output" aria-live="polite"></div></article>'; }).join('') + '</section>';
    }
    host.innerHTML = html;
    host.querySelectorAll('[data-topic-example]').forEach(function (article) {
      var example = topic.examples.find(function (item) { return item.id === article.dataset.topicExample; });
      article.querySelector('[data-topic-run]').addEventListener('click', function () { window.LearningTools.run('/run', {code:example.code}, article.querySelector('.topic-output'), this); });
      article.querySelector('[data-topic-copy]').addEventListener('click', function () { var button = this; if (!navigator.clipboard) { button.textContent = '请手动选择代码复制'; return; } navigator.clipboard.writeText(example.code).then(function () { button.textContent = '已复制'; }, function () { button.textContent = '请手动选择代码复制'; }); });
    });
    if (parts[2]) requestAnimationFrame(function () { var target = document.getElementById('topic-branch-' + parts[2]); if (target) target.scrollIntoView({block:'start'}); });
  }
  window.TopicGuides = {render:render};
})();
