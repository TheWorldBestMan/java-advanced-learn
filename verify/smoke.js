const assert = require('assert/strict'), {spawn} = require('child_process'), os = require('os');
const path = require('path');
const root = path.resolve(__dirname, '..');
async function start(port, lan) {
  const proc = spawn(process.execPath, [path.join(root,'server.js'), ...(lan ? ['--lan'] : [])], {cwd:root, env:{...process.env, PORT:String(port)}, windowsHide:true});
  let output=''; proc.stdout.on('data', x => output += x); proc.stderr.on('data', x => output += x);
  for (let i=0;i<100;i++) { try { const r=await fetch(`http://127.0.0.1:${port}/api/status`); if(r.ok)return {proc,getOutput:()=>output}; } catch {} await new Promise(r=>setTimeout(r,100)); }
  proc.kill(); throw new Error('服务未启动: '+output);
}
async function main() {
  const port=18766, local=await start(port,false), base=`http://127.0.0.1:${port}`;
  try {
    let res=await fetch(base+'/api/status'); let info=await res.json(); assert.equal(info.service,true); assert.equal(info.lan,false); assert.equal(info.jdk.java,true); assert.equal(info.jdk.javac,true);
    res=await fetch(base+'/run',{method:'POST',headers:{'Content-Type':'application/json','Origin':base},body:JSON.stringify({code:'public class Hello { public static void main(String[] args) { System.out.println("hello"); } }'})});
    let run=await res.json(); assert.equal(run.state,'finished'); assert.equal(run.stdout.trim(),'hello');
    res=await fetch(base+'/run',{method:'POST',headers:{'Content-Type':'application/json','Origin':'http://example.com'},body:'{}'}); assert.equal(res.status,403);
    res=await fetch(base+'/run',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}); assert.equal(res.status,403);
    console.log('本机服务、JDK、实际 Java 运行及请求来源检查通过。');
  } finally {local.proc.kill();}
  const lan=await start(port+1,true);
  try {
    const address=Object.values(os.networkInterfaces()).flat().find(i=>i&&i.family==='IPv4'&&!i.internal);
    if (!address) { console.log('没有非回环 IPv4，跳过局域网访问码测试。'); return; }
    const origin=`http://${address.address}:${port+1}`, info=await (await fetch(origin+'/api/status')).json(); assert.equal(info.requiresToken,true);
    let res=await fetch(origin+'/run',{method:'POST',headers:{'Content-Type':'application/json','Origin':origin},body:JSON.stringify({code:'public class Hello { public static void main(String[] a) {} }'})});assert.equal(res.status,403);
    const token=(lan.getOutput().match(/运行访问码：([a-f0-9]+)/)||[])[1];assert.ok(token);
    res=await fetch(origin+'/run',{method:'POST',headers:{'Content-Type':'application/json','Origin':origin,'X-Learning-Token':token},body:JSON.stringify({code:'public class Hello { public static void main(String[] a) { System.out.print("ok"); } }'})});
    assert.equal((await res.json()).stdout,'ok'); console.log('局域网访问码拦截与授权运行通过。');
  } finally {lan.proc.kill();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
