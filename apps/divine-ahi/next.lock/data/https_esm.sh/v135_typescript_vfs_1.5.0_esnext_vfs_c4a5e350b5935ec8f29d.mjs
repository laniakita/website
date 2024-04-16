/* esm.sh - esbuild bundle(@typescript/vfs@1.5.0) esnext production */
import __Process$ from "/v135/node_process.js";
var __rResolve$ = p => p;
import * as __0$ from "/v135/path-browserify@1.0.1/esnext/path-browserify.mjs";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({},m);switch(n){case"path":return e(__0$);default:throw new Error("module \""+n+"\" not found");}};
var E=Object.defineProperty;var V=Object.getOwnPropertyDescriptor;var q=Object.getOwnPropertyNames;var W=Object.prototype.hasOwnProperty;var O=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var A=(e,t)=>()=>(e&&(t=e(e=0)),t);var _=(e,t)=>{for(var r in t)E(e,r,{get:t[r],enumerable:!0})},U=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of q(t))!W.call(e,l)&&l!==r&&E(e,l,{get:()=>t[l],enumerable:!(n=V(t,l))||n.enumerable});return e};var B=e=>U(E({},"__esModule",{value:!0}),e);var L={};_(L,{default:()=>K});var K,k=A(()=>{K={}});function C(){return C=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},C.apply(this,arguments)}var N=!1;try{N=typeof localStorage<"u"}catch{}var R=typeof __Process$<"u",z=N&&localStorage.getItem("DEBUG")||R&&__Process$.env.DEBUG,M=z?console.log:function(e){return""};function Q(e,t,r,n,l){n===void 0&&(n={});var u=C({},T(r),n),a=Y(e,t,u,r,l),o=a.languageServiceHost,i=a.updateFile,s=r.createLanguageService(o),c=s.getCompilerOptionsDiagnostics();if(c.length){var g=H(e,n,r);throw new Error(r.formatDiagnostics(c,g.compilerHost))}return{name:"vfs",sys:e,languageService:s,getSourceFile:function(f){var d;return(d=s.getProgram())==null?void 0:d.getSourceFile(f)},createFile:function(f,d){i(r.createSourceFile(f,d,u.target,!1))},updateFile:function(f,d,v){var h=s.getProgram().getSourceFile(f);if(!h)throw new Error("Did not find a source file for "+f);var b=h.text,F=v??r.createTextSpan(0,b.length),m=b.slice(0,F.start)+d+b.slice(F.start+F.length),S=r.updateSourceFile(h,m,{span:F,newLength:d.length});i(S)}}}var G=function(t,r){var n=t.target||r.ScriptTarget.ES5,l=t.lib||[],u=["lib.d.ts","lib.decorators.d.ts","lib.decorators.legacy.d.ts","lib.dom.d.ts","lib.dom.iterable.d.ts","lib.webworker.d.ts","lib.webworker.importscripts.d.ts","lib.webworker.iterable.d.ts","lib.scripthost.d.ts","lib.es5.d.ts","lib.es6.d.ts","lib.es2015.collection.d.ts","lib.es2015.core.d.ts","lib.es2015.d.ts","lib.es2015.generator.d.ts","lib.es2015.iterable.d.ts","lib.es2015.promise.d.ts","lib.es2015.proxy.d.ts","lib.es2015.reflect.d.ts","lib.es2015.symbol.d.ts","lib.es2015.symbol.wellknown.d.ts","lib.es2016.array.include.d.ts","lib.es2016.d.ts","lib.es2016.full.d.ts","lib.es2017.d.ts","lib.es2017.date.d.ts","lib.es2017.full.d.ts","lib.es2017.intl.d.ts","lib.es2017.object.d.ts","lib.es2017.sharedmemory.d.ts","lib.es2017.string.d.ts","lib.es2017.typedarrays.d.ts","lib.es2018.asyncgenerator.d.ts","lib.es2018.asynciterable.d.ts","lib.es2018.d.ts","lib.es2018.full.d.ts","lib.es2018.intl.d.ts","lib.es2018.promise.d.ts","lib.es2018.regexp.d.ts","lib.es2019.array.d.ts","lib.es2019.d.ts","lib.es2019.full.d.ts","lib.es2019.intl.d.ts","lib.es2019.object.d.ts","lib.es2019.string.d.ts","lib.es2019.symbol.d.ts","lib.es2020.bigint.d.ts","lib.es2020.d.ts","lib.es2020.date.d.ts","lib.es2020.full.d.ts","lib.es2020.intl.d.ts","lib.es2020.number.d.ts","lib.es2020.promise.d.ts","lib.es2020.sharedmemory.d.ts","lib.es2020.string.d.ts","lib.es2020.symbol.wellknown.d.ts","lib.es2021.d.ts","lib.es2021.full.d.ts","lib.es2021.intl.d.ts","lib.es2021.promise.d.ts","lib.es2021.string.d.ts","lib.es2021.weakref.d.ts","lib.es2022.array.d.ts","lib.es2022.d.ts","lib.es2022.error.d.ts","lib.es2022.full.d.ts","lib.es2022.intl.d.ts","lib.es2022.object.d.ts","lib.es2022.regexp.d.ts","lib.es2022.sharedmemory.d.ts","lib.es2022.string.d.ts","lib.es2023.array.d.ts","lib.es2023.collection.d.ts","lib.es2023.d.ts","lib.es2023.full.d.ts","lib.esnext.array.d.ts","lib.esnext.asynciterable.d.ts","lib.esnext.bigint.d.ts","lib.esnext.d.ts","lib.esnext.decorators.d.ts","lib.esnext.disposable.d.ts","lib.esnext.full.d.ts","lib.esnext.intl.d.ts","lib.esnext.promise.d.ts","lib.esnext.string.d.ts","lib.esnext.symbol.d.ts","lib.esnext.weakref.d.ts"],a=r.ScriptTarget[n],o=u.filter(function(f){return f.startsWith("lib."+a.toLowerCase())}),i=u.indexOf(o.pop()),s=function(d){return d&&d.length?d.reduce(function(v,h){return h>v?h:v}):void 0},c=l.map(function(f){var d=u.filter(function(h){return h.startsWith("lib."+f.toLowerCase())});if(d.length===0)return 0;var v=u.indexOf(d.pop());return v}),g=s(c)||0,p=Math.max(i,g);return u.slice(0,p+1)},X=function(t,r,n){var l=P(),u=I(),a=function(g){var p=n||l.dirname(__rResolve$("typescript"));return u.readFileSync(l.join(p,g),"utf8")},o=u.readdirSync(n||l.dirname(__rResolve$("typescript"))),i=o.filter(function(c){return c.startsWith("lib.")&&c.endsWith(".d.ts")}),s=new Map;return i.forEach(function(c){s.set("/"+c,a(c))}),s},J=function(t,r){var n=P(),l=I(),u=function o(i){var s=[],c=l.readdirSync(i);return c.forEach(function(g){g=n.join(i,g);var p=l.statSync(g);p&&p.isDirectory()?s=s.concat(o(g)):s.push(g)}),s},a=u(r);a.forEach(function(o){var i="/node_modules/@types"+o.replace(r,""),s=l.readFileSync(o,"utf8"),c=[".ts",".tsx"];c.includes(n.extname(i))&&t.set(i,s)})},Z=function(t){return J(t,"node_modules/@types")},ee=function(t,r,n,l,u,a,o){var i=a||fetch,s=new Map,c=G(t,l),g="https://typescript.azureedge.net/cdn/"+r+"/typescript/lib/";function p(b){return u?u.compressToUTF16(b):b}function f(b){return u?u.decompressFromUTF16(b):b}function d(){return Promise.all(c.map(function(b){return i(g+b).then(function(F){return F.text()})})).then(function(b){b.forEach(function(F,m){return s.set("/"+c[m],F)})}).catch(function(){})}function v(){var b=o||localStorage,F=Object.keys(b);return F.forEach(function(m){m.startsWith("ts-lib-")&&!m.startsWith("ts-lib-"+r)&&b.removeItem(m)}),Promise.all(c.map(function(m){var S="ts-lib-"+r+"-"+m,D=b.getItem(S);return D?Promise.resolve(f(D)):i(g+m).then(function(w){return w.text()}).then(function(w){return b.setItem(S,p(w)),w}).catch(function(){})})).then(function(m){m.forEach(function(S,D){if(S){var w="/"+c[D];s.set(w,S)}})})}var h=n?v:d;return h().then(function(){return s})};function x(e){throw new Error("Method '"+e+"' is not implemented.")}function y(e,t){return function(){for(var r=arguments.length,n=new Array(r),l=0;l<r;l++)n[l]=arguments[l];var u=t.apply(void 0,n),a=typeof u=="string"?u.slice(0,80)+"...":u;return M.apply(void 0,["> "+e].concat(n)),M("< "+a),u}}var T=function(t){return C({},t.getDefaultCompilerOptions(),{jsx:t.JsxEmit.React,strict:!0,esModuleInterop:!0,module:t.ModuleKind.ESNext,suppressOutputPathCheck:!0,skipLibCheck:!0,skipDefaultLibCheck:!0,moduleResolution:t.ModuleResolutionKind.NodeJs})},j=function(t){return t.replace("/","/lib.").toLowerCase()};function te(e){return{args:[],createDirectory:function(){return x("createDirectory")},directoryExists:y("directoryExists",function(t){return Array.from(e.keys()).some(function(r){return r.startsWith(t)})}),exit:function(){return x("exit")},fileExists:y("fileExists",function(t){return e.has(t)||e.has(j(t))}),getCurrentDirectory:function(){return"/"},getDirectories:function(){return[]},getExecutingFilePath:function(){return x("getExecutingFilePath")},readDirectory:y("readDirectory",function(t){return t==="/"?Array.from(e.keys()):[]}),readFile:y("readFile",function(t){return e.get(t)||e.get(j(t))}),resolvePath:function(r){return r},newLine:`
`,useCaseSensitiveFileNames:!0,write:function(){return x("write")},writeFile:function(r,n){e.set(r,n)}}}function re(e,t,r,n){var l=t+"/vfs",u=P(),a=r.sys,o=n??u.dirname(__rResolve$("typescript"));return{name:"fs-vfs",root:l,args:[],createDirectory:function(){return x("createDirectory")},directoryExists:y("directoryExists",function(i){return Array.from(e.keys()).some(function(s){return s.startsWith(i)})||a.directoryExists(i)}),exit:a.exit,fileExists:y("fileExists",function(i){if(e.has(i))return!0;if(i.includes("tsconfig.json")||i.includes("tsconfig.json"))return!1;if(i.startsWith("/lib")){var s=o+"/"+i.replace("/","");return a.fileExists(s)}return a.fileExists(i)}),getCurrentDirectory:function(){return l},getDirectories:a.getDirectories,getExecutingFilePath:function(){return x("getExecutingFilePath")},readDirectory:y("readDirectory",function(){return(arguments.length<=0?void 0:arguments[0])==="/"?Array.from(e.keys()):a.readDirectory.apply(a,arguments)}),readFile:y("readFile",function(i){if(e.has(i))return e.get(i);if(i.startsWith("/lib")){var s=o+"/"+i.replace("/",""),c=a.readFile(s);if(!c){var g=a.readDirectory(o);throw new Error("TSVFS: A request was made for "+s+" but there wasn't a file found in the file map. You likely have a mismatch in the compiler options for the CDN download vs the compiler program. Existing Libs: "+g+".")}return c}return a.readFile(i)}),resolvePath:function(s){return e.has(s)?s:a.resolvePath(s)},newLine:`
`,useCaseSensitiveFileNames:!0,write:function(){return x("write")},writeFile:function(s,c){e.set(s,c)}}}function H(e,t,r){var n=new Map,l=function(o){return n.set(o.fileName,o),o},u={compilerHost:C({},e,{getCanonicalFileName:function(o){return o},getDefaultLibFileName:function(){return"/"+r.getDefaultLibFileName(t)},getDirectories:function(){return[]},getNewLine:function(){return e.newLine},getSourceFile:function(o){return n.get(o)||l(r.createSourceFile(o,e.readFile(o),t.target||T(r).target,!1))},useCaseSensitiveFileNames:function(){return e.useCaseSensitiveFileNames}}),updateFile:function(o){var i=n.has(o.fileName);return e.writeFile(o.fileName,o.text),n.set(o.fileName,o),i}};return u}function Y(e,t,r,n,l){var u=[].concat(t),a=H(e,r,n),o=a.compilerHost,i=a.updateFile,s=new Map,c=0,g=C({},o,{getProjectVersion:function(){return c.toString()},getCompilationSettings:function(){return r},getCustomTransformers:function(){return l},getScriptFileNames:function(){return u.slice()},getScriptSnapshot:function(d){var v=e.readFile(d);if(v)return n.ScriptSnapshot.fromString(v)},getScriptVersion:function(d){return s.get(d)||"0"},writeFile:e.writeFile}),p={languageServiceHost:g,updateFile:function(d){c++,s.set(d.fileName,c.toString()),u.includes(d.fileName)||u.push(d.fileName),i(d)}};return p}var P=function(){return O("path")},I=function(){return k(),B(L)};export{J as addAllFilesFromFolder,Z as addFilesForTypesIntoFolder,ee as createDefaultMapFromCDN,X as createDefaultMapFromNodeModules,re as createFSBackedSystem,te as createSystem,H as createVirtualCompilerHost,Y as createVirtualLanguageServiceHost,Q as createVirtualTypeScriptEnvironment,G as knownLibFilesForCompilerOptions};
//# sourceMappingURL=vfs.mjs.map