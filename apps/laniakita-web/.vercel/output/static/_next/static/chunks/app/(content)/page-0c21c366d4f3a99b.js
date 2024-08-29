(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[419],{9125:function(n,e,i){Promise.resolve().then(i.bind(i,3002)),Promise.resolve().then(i.t.bind(i,5469,23))},3002:function(n,e,i){"use strict";i.d(e,{default:function(){return u}});var o=i(7573),t=i(7653),r=i(8226),s=i(2390),c=i(4864),a=i(7947),l=i(2552),v=i(1648);function d(n){let{children:e,...i}=n,r=(0,t.useRef)(null);return(0,o.jsx)("div",{ref:r,className:"relative size-full",children:(0,o.jsxs)(t.Suspense,{children:[(0,o.jsxs)(v.Xz,{eventSource:r,orthographic:!0,style:{height:"100%",width:"100%",position:"absolute",top:0,left:0,right:0,bottom:0,overflow:"hidden",pointerEvents:"none"},...i,children:[(0,o.jsx)(a.i,{makeDefault:!0,manual:!0,left:-.5,right:.5,top:.5,bottom:-.5,near:-1e3,far:1e3,position:[0,0,1]}),e,(0,o.jsx)(l.q,{all:!0})]}),(0,o.jsx)(c.eL,{})]})})}let x=(0,r.g)({u_time:0},"".concat("#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"),"".concat("#ifdef GL_ES\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform float u_time;\nuniform vec3 color;\nvarying vec2 vUv;\n\n// simplex noise in glsl: from Ian McEwan, Ashima Arts simplex noise function in GLSL:\n// https://github.com/ashima/webgl-noise \n//\n// Some useful functions\nvec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\nvec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\nvec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }\n// simplex noise\nfloat snoise(vec2 v) {\n\n    // Precompute values for skewed triangular grid\n    const vec4 C = vec4(0.211324865405187,\n                        // (3.0-sqrt(3.0))/6.0\n                        0.366025403784439,\n                        // 0.5*(sqrt(3.0)-1.0)\n                        -0.577350269189626,\n                        // -1.0 + 2.0 * C.x\n                        0.024390243902439);\n                        // 1.0 / 41.0\n\n    // First corner (x0)\n    vec2 i  = floor(v + dot(v, C.yy));\n    vec2 x0 = v - i + dot(i, C.xx);\n\n    // Other two corners (x1, x2)\n    vec2 i1 = vec2(0.0);\n    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);\n    vec2 x1 = x0.xy + C.xx - i1;\n    vec2 x2 = x0.xy + C.zz;\n\n    // Do some permutations to avoid\n    // truncation effects in permutation\n    i = mod289(i);\n    vec3 p = permute(\n            permute(i.y + vec3(0.0, i1.y, 1.0))\n                + i.x + vec3(0.0, i1.x, 1.0 ));\n\n    vec3 m = max(0.5 - vec3(\n                        dot(x0,x0),\n                        dot(x1,x1),\n                        dot(x2,x2)\n                        ), 0.0);\n\n    m = m*m*m*m ;\n \n    // Gradients:\n    //  41 pts uniformly over a line, mapped onto a diamond\n    //  The ring size 17*17 = 289 is close to a multiple\n    //      of 41 (41*7 = 287)\n\n    vec3 x = 2.0 * fract(p * C.www ) - 1.0;\n    vec3 h = abs(x) - 0.5;\n    vec3 ox = floor(x + 0.5);\n    vec3 a0 = x - ox;\n\n    // Normalise gradients implicitly by scaling m\n    // Approximation of: m *= inversesqrt(a0*a0 + h*h);\n    m *=  1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);\n\n    // Compute final noise value at P\n    vec3 g = vec3(0.0);\n    g.x  = a0.x  * x0.x  + h.x  * x0.y;\n    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);\n    return 130.0 * dot(m, g);\n}\n// end of simplex-noise\n\nvoid main() {\n  vec2 st = vUv;\n  vec2 grid = vec2(st * 20.0);\n  \n  float point = 0.0;\n  \n  float mod1 = cos(distance(vec2(u_time),grid));\n  float mod2 = distance(grid,vec2((u_time)));\n  float mod3 = distance(grid,vec2(3.14));\n  float mod4 = distance(vec2(mod3), st);\n\n  vec2 speed = vec2(mod2)*0.13;\n\n  point += snoise(grid+speed)*0.214+0.31;\n  \n\n  float rand = snoise(grid*vec2(cos(u_time*0.15),sin(u_time*0.1))*0.1)*3.14-0.25;\n  speed = vec2(cos(rand), sin(rand));\n  point += snoise(grid+speed)*.14+.3;\n  \n  float finalMod1 = distance(vec2(fract(point)),(st*0.55));\n  float finalMod2 = fract(point);\n\n  vec3 color = vec3(smoothstep(0.5,0.9,finalMod1));\n\n  gl_FragColor = vec4(color, 1.0);\n}\n"));function u(){return(0,o.jsx)(d,{children:(0,o.jsx)(m,{})})}function m(){let n=(0,t.useRef)(),e=(0,t.useRef)(null),{viewport:i}=(0,s.A)(),r=i.width/i.height;return(0,s.C)((i,o)=>{var t,s,c,a;n.current.u_time+=o,1>r?(null===(t=e.current)||void 0===t||t.scale.setX(1/r),null===(s=e.current)||void 0===s||s.scale.setY(1)):(null===(c=e.current)||void 0===c||c.scale.setX(1),null===(a=e.current)||void 0===a||a.scale.setY(r/1))}),(0,o.jsxs)("mesh",{ref:e,children:[(0,o.jsx)("planeGeometry",{args:[1,1]}),(0,o.jsx)("noiseShaderMaterial",{ref:n},x.key)]})}(0,s.e)({NoiseShaderMaterial:x})}},function(n){n.O(0,[124,469,366,293,434,744],function(){return n(n.s=9125)}),_N_E=n.O()}]);