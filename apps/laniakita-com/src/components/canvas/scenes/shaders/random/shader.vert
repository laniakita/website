# version 300 es

out vec2 vUv;

void main() {
  vec2 uv = vUv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
