// Validate the actual scripts in index.html in their browser load order.
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="(content\/[^\"]+)"/g)].map(m => m[1]);
const context = {console}; context.window = context;
vm.createContext(context);
for (const script of scripts) vm.runInContext(fs.readFileSync(path.join(root, script), 'utf8'), context, {filename:script});
const errors = [], chapters = new Set(), exercises = new Set(), sections = new Set(), cases = new Set();
function check(ok, message) { if (!ok) errors.push(message); }
for (const ch of context.COURSE) {
  check(!chapters.has(ch.id), '重复章节: ' + ch.id); chapters.add(ch.id);
  check(ch.title && Array.isArray(ch.sections) && Array.isArray(ch.quiz) && Array.isArray(ch.exercises), '章节字段不完整: ' + ch.id);
  for (const sec of ch.sections) {
    const key = ch.id + '/' + sec.id; check(!sections.has(key), '重复小节: ' + key); sections.add(key);
    check(sec.title && Array.isArray(sec.blocks), '小节字段不完整: ' + key);
    check(!!context.CoursePath.get(key), '缺少学习路线: ' + key);
    for (const block of sec.blocks) {
      const items = block.t === 'case-studies' ? block.items : block.t === 'quick-start' ? [block.item] : [];
      for (const item of items) { if (item.id) {check(!cases.has(item.id), '重复案例: ' + item.id);cases.add(item.id);} check(typeof item.code === 'string' && /public\s+class\s+\w+/.test(item.code), '案例代码不完整: ' + key); }
    }
  }
  for (const [i, q] of ch.quiz.entries()) check(Array.isArray(q.options) && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, '测验答案无效: ' + ch.id + '/' + i);
  for (const ex of ch.exercises) {
    check(!exercises.has(ex.id), '重复练习: ' + ex.id); exercises.add(ex.id);
    check(typeof ex.solution === 'string' && typeof ex.starter === 'string' && Array.isArray(ex.keyPoints), '练习字段不完整: ' + ex.id);
    for (const kp of ex.keyPoints || []) { try { check(new RegExp(kp.test).test(ex.solution), '参考答案未命中结构提示: ' + ex.id + ' / ' + kp.label); } catch {errors.push('无效正则: ' + ex.id);} }
    const bank = context.EXERCISE_TESTS[ex.id]; check(bank && bank.tests && bank.tests.length, '缺少公开测试: ' + ex.id);
  }
}
for (const task of context.PRACTICE_STUDIO.bugs.concat(context.PRACTICE_STUDIO.projects)) {
  check(!exercises.has(task.id), '重复练习: ' + task.id); exercises.add(task.id);
  check(chapters.has(task.chapterId), '练习章节不存在: ' + task.id);
  check(context.PRACTICE_STUDIO.banks[task.id] && task.tests.length > 0, '缺少公开测试: ' + task.id);
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`内容验证通过：${chapters.size} 章、${sections.size} 节、${exercises.size} 个课程练习/项目。`);
