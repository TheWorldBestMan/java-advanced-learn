// 供个人学习使用的本地 JDK 运行器；公开测试不冒充隐藏判题。
const fs=require('fs/promises'),path=require('path'),crypto=require('crypto');
const {execFile}=require('child_process');
const banks=Object.assign({},require('./content/exercise-tests.js'),require('./content/practice-studio.js').banks,require('./content/advanced-chapters.js').banks);
const RUN_DIR=path.resolve(__dirname,'.run');
const MARKER='__JAVA_LEARN_RESULT__';
let active=0;
function processFile(command,args,cwd,timeout) {
  return new Promise(resolve=>execFile(command,args,{cwd,timeout,maxBuffer:256*1024,windowsHide:true,encoding:'utf8'},(error,stdout,stderr)=>resolve({error,stdout:stdout||'',stderr:stderr||''})));
}
function normalize(text){return String(text).replace(/\r\n/g,'\n').trimEnd();}
function failureState(result){return !result.error ? null : result.error.code==='ERR_CHILD_PROCESS_STDIO_MAXBUFFER' ? 'output_limit' : result.error.killed ? 'time_limit' : 'runtime_error';}
function harness(spec) {
  const switches=spec.tests.map((t,i)=>`case ${i}: { ${t.setup} return String.valueOf(${t.expression}); }`).join('\n');
  return `import java.util.*; import java.lang.reflect.*; import java.nio.charset.StandardCharsets;
public class PracticeHarness {
  static Object call(Object target,String name,Object... args) throws Exception {
    for(Method method:target.getClass().getDeclaredMethods()) if(method.getName().equals(name) && method.getParameterCount()==args.length) {
      method.setAccessible(true);
      try { return method.invoke(target,args); } catch(InvocationTargetException e) { throw new RuntimeException(e.getCause()); }
    }
    throw new IllegalArgumentException("缺少题目要求的方法："+name);
  }
  static String reverseText(Object subject,String value) throws Exception {
    char[] chars=value.toCharArray(); call(subject,"reverseString",chars); return new String(chars);
  }
  static String sortedIndices(int[] indices) { Arrays.sort(indices); return Arrays.toString(indices); }
  static String canonical(Object value,boolean sortInside) {
    List<String> rows=new ArrayList<>();
    for(Object item:(List<?>)value) {
      List<Integer> row=new ArrayList<>(); for(Object n:(List<?>)item) row.add((Integer)n);
      if(sortInside) Collections.sort(row); rows.add(row.toString());
    }
    Collections.sort(rows); return String.join(" | ",rows);
  }
  static Method method(Object subject,String name) {
    for(Method m:subject.getClass().getDeclaredMethods()) if(m.getName().equals(name)) return m;
    throw new IllegalArgumentException("缺少方法："+name);
  }
  static Object node(Class<?> type,int value) throws Exception {
    Constructor<?> ctor=type.getDeclaredConstructor(int.class); ctor.setAccessible(true); return ctor.newInstance(value);
  }
  static Field field(Class<?> type,String name) throws Exception { Field f=type.getDeclaredField(name); f.setAccessible(true); return f; }
  static String reverseList(Object subject,int[] values) throws Exception {
    Class<?> type=method(subject,"reverse").getParameterTypes()[0]; Field next=field(type,"next"),val=field(type,"val");
    Object head=null,tail=null; Set<Object> original=Collections.newSetFromMap(new IdentityHashMap<>());
    for(int value:values) { Object n=node(type,value); original.add(n); if(head==null)head=n;else next.set(tail,n);tail=n; }
    Object p=call(subject,"reverse",head); List<Integer> result=new ArrayList<>(); Set<Object> seen=Collections.newSetFromMap(new IdentityHashMap<>());
    while(p!=null) {
      if(!seen.add(p)) throw new IllegalStateException("返回链表存在环");
      if(!original.contains(p)) throw new IllegalStateException("要求原地反转，不能新建结果节点");
      result.add((Integer)val.get(p)); p=next.get(p);
    }
    return result.toString();
  }
  static Object treeCall(Object subject,String name,Integer[] values) throws Exception {
    Class<?> type=method(subject,name).getParameterTypes()[0]; Object root=null;
    if(values.length>0 && values[0]!=null) {
      root=node(type,values[0]); Queue<Object> q=new ArrayDeque<>();q.offer(root);int i=1;
      Field left=field(type,"left"),right=field(type,"right");
      while(!q.isEmpty() && i<values.length) {
        Object p=q.poll();
        if(values[i]!=null) { Object child=node(type,values[i]);left.set(p,child);q.offer(child); } i++;
        if(i<values.length) { if(values[i]!=null){Object child=node(type,values[i]);right.set(p,child);q.offer(child);}i++; }
      }
    }
    return call(subject,name,root);
  }
  static String queueScenario(Object subject,String operations) throws Exception {
    List<Object> output=new ArrayList<>();
    for(String op:operations.split(",")) {
      if(op.startsWith("push:")) call(subject,"push",Integer.parseInt(op.substring(5)));
      else output.add(call(subject,op));
    }
    return output.toString();
  }
  static String test(int index) throws Exception {
    switch(index) { ${switches} default: throw new IllegalArgumentException("未知测试"); }
  }
  public static void main(String[] args) throws Exception {
    String actual=test(Integer.parseInt(args[0]));
    System.out.println("${MARKER}"+Base64.getEncoder().encodeToString(actual.getBytes(StandardCharsets.UTF_8)));
  }
}`;
}
async function execute(code,exerciseId) {
  if(active>=2) return {error:'已有两个程序正在运行，请稍后重试。',state:'busy'};
  if(typeof code!=='string'||!code.trim()||Buffer.byteLength(code)>256*1024) return {error:'代码不能为空，且应小于 256 KB。',state:'invalid'};
  const classMatch=code.match(/public\s+class\s+([A-Za-z_]\w*)/);
  if(!classMatch || /\bpackage\s+[\w.]+\s*;/.test(code)) return {error:'请保留题目中的 public class 类名，并移除 package 声明。',state:'invalid'};
  const spec=exerciseId ? banks[exerciseId] : null;
  if(exerciseId && !spec) return {error:'没有找到这道练习的测试组。',state:'invalid'};
  if(spec && classMatch[1]!==spec.className) return {error:'本题类名应为 '+spec.className+'。',state:'invalid'};
  active++;
  const dir=path.join(RUN_DIR,crypto.randomUUID());
  try {
    await fs.mkdir(dir,{recursive:true});
    const file=classMatch[1]+'.java'; await fs.writeFile(path.join(dir,file),code,'utf8');
    const files=[file];
    if(spec) {await fs.writeFile(path.join(dir,'PracticeHarness.java'),harness(spec),'utf8');files.push('PracticeHarness.java');}
    const compiled=await processFile('javac',['-J-Duser.language=en','-encoding','UTF-8',...files],dir,15000);
    if(compiled.error) return compiled.error.code==='ENOENT' ? {error:'找不到 javac，请安装 JDK 并重新启动网站。',state:'infrastructure_error'} : {compileError:compiled.stderr||compiled.error.message,state:'compile_error'};
    async function run(name,args=[]) {
      return processFile('java',['-Xmx128m','-XX:MaxMetaspaceSize=128m','-Dstdout.encoding=UTF-8','-Dstderr.encoding=UTF-8','-cp',dir,name,...args],dir,5000);
    }
    if(!spec) {
      const r=await run(classMatch[1]);
      if(r.error?.code==='ENOENT')return {error:'找不到 java，请检查 JDK 环境并重新启动网站。',state:'infrastructure_error'};
      const failure=failureState(r);
      return {stdout:r.stdout,stderr:r.stderr,timedOut:failure==='time_limit',outputLimited:failure==='output_limit',runtimeError:!!failure,state:failure||'finished'};
    }
    const results=[];
    for(let i=0;i<spec.tests.length;i++) {
      const t=spec.tests[i],r=await run('PracticeHarness',[String(i)]),at=r.stdout.lastIndexOf(MARKER);
      let actual=at<0?'':Buffer.from(r.stdout.slice(at+MARKER.length).split(/\r?\n/)[0].trim(),'base64').toString('utf8');
      const state=failureState(r)||(at<0?'runtime_error':normalize(actual)===normalize(t.expected)?'passed':'wrong_answer');
      results.push({id:t.id,input:t.input,expected:t.expected,actual,state,note:t.note,stderr:r.stderr,debugOutput:at<0?r.stdout:r.stdout.slice(0,at)});
    }
    return {state:'tested',passed:results.filter(r=>r.state==='passed').length,total:results.length,results};
  } catch(error) { return {error:error.message,state:'infrastructure_error'}; }
  finally {
    active--;
    // 只删除本次 UUID 工作目录，绝不对用户提供的路径递归操作。
    if(path.dirname(path.resolve(dir))===RUN_DIR) await fs.rm(dir,{recursive:true,force:true}).catch(()=>{});
  }
}
module.exports={execute,harness,banks};
