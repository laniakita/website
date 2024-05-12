# version 300 es

precision mediump float;
uniform float u_time;
uniform vec3 color;
in vec2 vUv;
vec4 fragColor;

void main() {
  fragColor = vec4(vUv.x,vUv.y,sin(u_time),1.0);
}
