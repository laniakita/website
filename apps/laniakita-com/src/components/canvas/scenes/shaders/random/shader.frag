#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec3 color;
in vec2 vUv;

float random(vec2 _st) {
  return fract(sin(dot(_st.xy, vec2(100.9898, 100.233)))*42456.140123);

}

void main() {
  //pixels
  
  vec2 st = vUv;
  st *= 10.0;
  vec2 ipos = floor(st);
  vec2 fpos = fract(st);
  vec3 color = vec3(random(ipos));
  gl_FragColor = vec4(color, 1.0);

  // tv static
  //float rnd = random(vUv);
  //gl_FragColor = vec4(vec3(rnd),1.0);
}
