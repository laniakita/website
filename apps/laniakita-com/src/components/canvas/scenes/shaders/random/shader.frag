uniform float u_time;
uniform vec3 color;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(vUv.x,vUv.y,sin(u_time),1.0);
}
