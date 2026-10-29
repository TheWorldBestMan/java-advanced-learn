const fs=require('fs'),vm=require('vm'),path=require('path'),{execute}=require('../runner');
const ctx={};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../content/topic-guides.js'),'utf8'),ctx);
(async()=>{
  const examples=ctx.TOPIC_GUIDES.flatMap(t=>t.examples||[]);
  for(const example of examples){
    const result=await execute(example.code,null);
    if(result.state!=='finished'||result.stdout.replace(/\r\n/g,'\n').trimEnd()!==example.output.trimEnd())throw Error(example.id+': '+JSON.stringify(result));
    console.log('通过：'+example.id);
  }
  console.log('专题 Java 示例通过：'+examples.length);
})().catch(e=>{console.error(e);process.exitCode=1;});
