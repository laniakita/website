var p=Object.defineProperty;var u=(r,e,n)=>e in r?p(r,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[e]=n;var t=(r,e,n)=>(u(r,typeof e!="symbol"?e+"":e,n),n);import{EventEmitter as a}from"./node_events.js";function c(r){const e=performance.now(),n=Math.floor(e/1e3),i=Math.floor(e*1e6-n*1e9);if(!r)return[n,i];const[s,d]=r;return[n-s,i-d]}c.bigint=function(){const[r,e]=c();return BigInt(r)*1000000000n+BigInt(e)};class l extends a{constructor(){super();t(this,"title","browser");t(this,"browser",!0);t(this,"env",{});t(this,"argv",[]);t(this,"pid",0);t(this,"arch","unknown");t(this,"platform","browser");t(this,"version","");t(this,"versions",{});t(this,"emitWarning",()=>{throw new Error("process.emitWarning is not supported")});t(this,"binding",()=>{throw new Error("process.binding is not supported")});t(this,"cwd",()=>{throw new Error("process.cwd is not supported")});t(this,"chdir",n=>{throw new Error("process.chdir is not supported")});t(this,"umask",()=>18);t(this,"nextTick",(n,...i)=>queueMicrotask(()=>n(...i)));t(this,"hrtime",c)}}const o=new l;if(typeof Deno<"u"){o.name="deno",o.browser=!1,o.pid=Deno.pid,o.cwd=()=>Deno.cwd(),o.chdir=e=>Deno.chdir(e),o.arch=Deno.build.arch,o.platform=Deno.build.os,o.version="v18.12.1",o.versions={node:"18.12.1",uv:"1.43.0",zlib:"1.2.11",brotli:"1.0.9",ares:"1.18.1",modules:"108",nghttp2:"1.47.0",napi:"8",llhttp:"6.0.10",openssl:"3.0.7+quic",cldr:"41.0",icu:"71.1",tz:"2022b",unicode:"14.0",ngtcp2:"0.8.1",nghttp3:"0.7.0",...Deno.version},o.env=new Proxy({},{get(e,n){return Deno.env.get(String(n))},ownKeys:()=>Reflect.ownKeys(Deno.env.toObject()),getOwnPropertyDescriptor:(e,n)=>{const i=Deno.env.toObject();if(n in Deno.env.toObject()){const s={enumerable:!0,configurable:!0};return typeof n=="string"&&(s.value=i[n]),s}},set(e,n,i){return Deno.env.set(String(n),String(i)),i}});const r=["","",...Deno.args];Object.defineProperty(r,"0",{get:Deno.execPath}),Object.defineProperty(r,"1",{get:()=>Deno.mainModule.startsWith("file:")?new URL(Deno.mainModule).pathname:join(Deno.cwd(),"$deno$node.js")}),o.argv=r}else{let r="/";o.cwd=()=>r,o.chdir=e=>r=e}var f=o;export{f as default};
