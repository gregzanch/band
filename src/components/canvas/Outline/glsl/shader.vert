uniform float linewidth;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vec4 displacement =
      vec4(normalize(normalMatrix * normal) * linewidth, 0.0) + mvPosition;
  gl_Position = projectionMatrix * displacement;
}