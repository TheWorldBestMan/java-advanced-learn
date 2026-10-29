// Compile and run real course exercises; --all also executes every case and quick example.
const fs=require('fs'), path=require('path'), vm=require('vm');
const {execute}=require('../runner');
const root=path.resolve(__dirname,'..'), html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const context={console};context.window=context;vm.createContext(context);
for(const [,file] of html.matchAll(/<script src="(content\/[^\"]+)"/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const exercises=context.COURSE.flatMap(ch=>ch.exercises).concat(context.PRACTICE_STUDIO.bugs,context.PRACTICE_STUDIO.projects);
const examples=context.COURSE.flatMap(ch=>ch.sections.flatMap(s=>s.blocks.flatMap(b=>b.t==='case-studies'?b.items:b.t==='quick-start'?[b.item]:[])));
async function main(){let errors=[];
  for(const [i,ex] of exercises.entries()){
    const r=await execute(ex.solution,ex.id);
    if(!r.results||r.passed!==r.total) errors.push(ex.id+': '+JSON.stringify(r));
    if((i+1)%10===0) console.log('已验证参考答案 '+(i+1)+'/'+exercises.length);
  }
  if(process.argv.includes('--all'))for(const [i,item] of examples.entries()){
    const r=await execute(item.code,null),expected=String(item.expectedOutput||'').replace(/\r\n/g,'\n').trimEnd(),actual=String(r.stdout||'').replace(/\r\n/g,'\n').trimEnd();
    if(r.state!=='finished'||actual!==expected)errors.push((item.id||item.scenario)+': '+JSON.stringify({state:r.state,expected,actual,error:r.error||r.compileError||r.stderr}));
    if((i+1)%25===0)console.log('已验证案例 '+(i+1)+'/'+examples.length);
  }
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('真实 Java 验证通过：'+exercises.length+' 个练习参考答案'+(process.argv.includes('--all')?'，'+examples.length+' 个示例':'')+'。');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
