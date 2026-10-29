// 个人学习站：静态资源、Java 本地运行、公开测试。
const http=require('http'),fs=require('fs'),path=require('path');
const os=require('os'),crypto=require('crypto'),{execFile}=require('child_process');
const {execute}=require('./runner');
const ROOT=path.resolve(__dirname),PORT=process.env.PORT||8766;
const LAN=process.argv.includes('--lan'), LAN_TOKEN=LAN?crypto.randomBytes(16).toString('hex'):null;
const localAddresses=new Set(['localhost','127.0.0.1','::1']);
Object.values(os.networkInterfaces()).flat().filter(Boolean).forEach(i=>localAddresses.add(i.address.toLowerCase()));
function localPeer(req){return ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress);}
function validHost(req){try{return localAddresses.has(new URL('http://'+req.headers.host).hostname.replace(/^\[|\]$/g,'').toLowerCase());}catch{return false;}}
function available(cmd){return new Promise(resolve=>execFile(cmd,['-version'],{timeout:5000,windowsHide:true},err=>resolve(!err)));}
const jdkStatus=Promise.all([available('java'),available('javac')]).then(([java,javac])=>({java,javac}));
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.png':'image/png','.ico':'image/x-icon'};
function json(res,value,status=200){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));}
const server=http.createServer(async(req,res)=>{
  if(!validHost(req))return json(res,{error:'无效的访问地址。'},403);
  let url;
  try {url=decodeURIComponent((req.url||'/').split('?')[0]);}catch {res.writeHead(400);return res.end('Bad Request');}
  if(req.method==='GET'&&url==='/api/status')return json(res,{service:true,lan:LAN,requiresToken:LAN&&!localPeer(req),jdk:await jdkStatus});
  if(req.method==='POST'&&(url==='/run'||url==='/test')) {
    try {if(!req.headers.origin||new URL(req.headers.origin).host!==req.headers.host||!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||''))return json(res,{error:'请从学习网站页面发起运行。'},403);}catch{return json(res,{error:'请求来源无效。'},403);}
    if(!localPeer(req)&&(!LAN||req.headers['x-learning-token']!==LAN_TOKEN))return json(res,{error:'请输入启动窗口显示的局域网运行访问码。',code:'lan_auth'},403);
    let body='';
    try {
      for await(const part of req) {body+=part;if(Buffer.byteLength(body)>300*1024)return json(res,{error:'代码过长。'},413);}
      const data=JSON.parse(body);
      if(url==='/test'&&typeof data.exerciseId!=='string')return json(res,{error:'缺少练习编号。'},400);
      return json(res,await execute(data.code,url==='/test'?data.exerciseId:null));
    }catch(error){return json(res,{error:'请求格式错误：'+error.message},400);}
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
  if(url==='/')url='/index.html';
  const file=path.resolve(ROOT,'.'+url),relative=path.relative(ROOT,file);
  if(relative.startsWith('..')||path.isAbsolute(relative)||relative.split(path.sep).some(p=>p.startsWith('.'))){res.writeHead(403);return res.end('Forbidden');}
  fs.readFile(file,(error,data)=>{
    if(error){res.writeHead(404);return res.end('404 Not Found');}
    res.writeHead(200,{'Content-Type':MIME[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(req.method==='HEAD'?undefined:data);
  });
});
if(require.main===module) {
  server.on('error',error=>console.error(error.code==='EADDRINUSE'?'端口 '+PORT+' 已被占用，请关闭旧的学习网站服务后重新启动。':error.message));
  server.listen(PORT,LAN?'0.0.0.0':'127.0.0.1',()=>{
    console.log('Java 学习网站已启动：http://localhost:'+PORT+'/');
    if(LAN){console.log('局域网访问已开启，仅用于可信网络。运行访问码：'+LAN_TOKEN);Object.values(os.networkInterfaces()).flat().filter(i=>i&&i.family==='IPv4'&&!i.internal).forEach(i=>console.log('手机地址：http://'+i.address+':'+PORT+'/'));}
    else console.log('仅本机访问。需要手机连接时运行 node server.js --lan。');
    console.log('运行代码和公开测试需要本机安装 JDK；关闭本窗口会停止服务。');
  });
}
module.exports=server;
