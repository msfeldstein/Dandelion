const glslify = require('glslify')
module.exports = glslify`
#pragma glslify: curl = require(glsl-curl-noise)

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 v = texture2D( textureVelocity, uv );
  vec4 p = texture2D( texturePosition, uv);
  v.xyz += curl(p.xyz / 20.0) / 300.0 * (2.0 * v.w + 0.2);
  gl_FragColor = v;
}
`