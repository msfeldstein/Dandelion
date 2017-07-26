const glslify = require('glslify')
module.exports = glslify`
uniform float time;
#pragma glslify: curl = require(glsl-curl-noise)
void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 p = texture2D( texturePosition, uv );
  vec4 v = texture2D( textureVelocity, uv );
  p.xyz += v.xyz * step(v.w, time);
  gl_FragColor = p;
}
`