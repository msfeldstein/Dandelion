const glslify = require('glslify')
module.exports = glslify`
#pragma glslify: curl = require(glsl-curl-noise)
uniform float time;
void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 v = texture2D( textureVelocity, uv );
  vec4 p = texture2D( texturePosition, uv);
  vec4 newV = vec4(v);
  newV.xyz += curl(p.xyz / 20.0) / 300.0 * (2.0 * p.w + 0.2);
  gl_FragColor = newV * step(v.w, time) + v * (1.0 - step(v.w, time));
}
`