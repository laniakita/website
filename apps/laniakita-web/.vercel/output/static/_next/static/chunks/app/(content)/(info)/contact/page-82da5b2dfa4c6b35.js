(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[998,760,476,28,550],{9215:function(e,t,n){Promise.resolve().then(n.bind(n,9017)),Promise.resolve().then(n.bind(n,4699)),Promise.resolve().then(n.bind(n,4497)),Promise.resolve().then(n.bind(n,258)),Promise.resolve().then(n.bind(n,2862)),Promise.resolve().then(n.t.bind(n,5658,23)),Promise.resolve().then(n.t.bind(n,5469,23)),Promise.resolve().then(n.t.bind(n,5327,23))},9017:function(e,t,n){"use strict";n.d(t,{HeroBlur2:function(){return c}});var r=n(7573),o=n(5880);function c(e){let t=e.featured_image;return(0,r.jsx)("picture",{className:"relative m-0 flex size-full max-w-5xl items-center justify-center p-0",children:(0,r.jsx)(o.default,{src:t.src,alt:t.altText,placeholder:"blur",blurDataURL:t.base64,height:t.height,width:t.width,sizes:"(max-width: 500px) 100vw, (max-width: 1024px) 80vw",style:{objectFit:"contain"},className:"overflow-hidden"})})}},4699:function(e,t,n){"use strict";n.d(t,{default:function(){return s}});var r=n(7573),o=n(7653),c=n(5880);function s(e){let{src:t,alt:n,blur:s,height:i,width:l}=e,[a,u]=(0,o.useState)(!1);return(0,r.jsxs)(r.Fragment,{children:[!0===a&&(0,r.jsx)("button",{type:"button",className:"fixed inset-x-0 top-0 z-[2] m-0 flex size-full h-screen cursor-zoom-out items-center justify-center  bg-ctp-midnight/20 p-0 backdrop-blur-md md:px-10",onClick:()=>{u(!1)},children:(0,r.jsx)(c.default,{priority:!1,src:t,alt:n,placeholder:"blur",blurDataURL:s,height:i,width:l,sizes:"100vw",className:"max-h-[80vh] object-contain"})}),(0,r.jsx)("button",{onClick:()=>{u(!0)},type:"button",className:"relative m-0 block size-full cursor-zoom-in p-0",children:(0,r.jsx)(c.default,{priority:!1,src:t,alt:n,placeholder:"blur",blurDataURL:s,height:i,width:l,sizes:"100vw",className:"m-0 object-contain p-0"})})]})}},4497:function(e,t,n){"use strict";n.d(t,{default:function(){return c}});var r=n(7573),o=n(7495);function c(e){let{date:t}=e,n=(0,o.WU)(t,"MMMM do, y");return(0,r.jsx)("time",{children:n})}},258:function(e,t,n){"use strict";n.d(t,{default:function(){return c}});var r=n(7573),o=n(7653);function c(){let[e,t]=(0,o.useState)(0),n=()=>{var e;let n=document.getElementById("content"),r=document.documentElement;t((r.scrollTop||document.body.scrollTop)/((null!==(e=null==n?void 0:n.scrollHeight)&&void 0!==e?e:document.body.scrollTop)-r.clientHeight)*100)};return(0,o.useEffect)(()=>(window.addEventListener("scroll",n),()=>{window.removeEventListener("scroll",n)})),(0,r.jsx)("div",{style:{width:"".concat(e,"%")},className:"h-1 ".concat(e>=50?"bg-ctp-pink":"bg-ctp-mauve"," simple-color-trans")})}},2862:function(e,t,n){"use strict";n.d(t,{default:function(){return s}});var r=n(7573),o=n(7754),c=n(7653);function s(){let e=(0,o.usePathname)(),[t,n]=(0,c.useState)(!1),[s,i]=(0,c.useState)(!1),l=()=>"".concat("https://laniakita.com").concat(e),a=(0,c.useRef)(null),u=(0,c.useCallback)(e=>{a.current.contains(e.target)||n(!1)},[]);return(0,c.useEffect)(()=>(document.addEventListener("click",u),()=>{document.removeEventListener("click",u)}),[u]),(0,r.jsxs)("div",{ref:a,className:"relative flex flex-col items-center justify-center",children:[(0,r.jsx)("span",{className:"".concat(t?"pointer-events-auto opacity-100":"pointer-events-none opacity-0"," absolute -bottom-4 z-[1] size-0 border-[1rem] border-x-transparent border-b-ctp-surface0 border-t-transparent")}),(0,r.jsx)("div",{className:"".concat(t?"pointer-events-auto opacity-100":"pointer-events-none opacity-0"," absolute -bottom-16 z-[2] min-w-fit whitespace-nowrap rounded-md border border-ctp-surface0 bg-ctp-base p-1 font-mono shadow-lg dark:shadow-ctp-pink/30"),children:(0,r.jsx)("ul",{children:(0,r.jsx)("li",{children:(0,r.jsxs)("button",{onClick:()=>{navigator.clipboard.writeText(l()),i(!0),setTimeout(()=>{i(!1)},2e3)},type:"button",className:"color-trans-quick flex flex-row items-center gap-2 rounded border border-ctp-surface0 px-4 py-2 hover:bg-ctp-pink hover:text-ctp-base",children:[(0,r.jsx)("span",{className:"icon-[ph--link] text-xl"}),(0,r.jsx)("span",{children:s?"copied!":"copy link"})]})})})}),(0,r.jsxs)("button",{onClick:()=>{t?n(!1):n(!0)},type:"button",className:"color-trans-quick flex flex-row items-center justify-center gap-2 rounded-full border border-ctp-mauve bg-ctp-mauve/10 px-8 py-2 font-mono font-black hover:border-ctp-flamingo hover:bg-ctp-pink hover:text-ctp-base",children:[(0,r.jsx)("span",{className:"icon-[ph--upload-bold] text-2xl"}),(0,r.jsx)("span",{children:"share"})]})]})}},1521:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return o}});let r=e=>e.startsWith("/")?e.slice(1):e;function o(e){let{src:t,width:n,quality:o}=e;return"/cdn-cgi/image/".concat(["width=".concat(n),"quality=".concat(null!=o?o:75),"format=auto"].join(","),"/").concat(r(t))}}},function(e){e.O(0,[469,685,495,327,293,434,744],function(){return e(e.s=9215)}),_N_E=e.O()}]);