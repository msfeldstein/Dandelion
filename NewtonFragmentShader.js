const glslify = require('glslify')
module.exports = glslify`
void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 p = texture2D( texturePosition, uv );
  vec4 v = texture2D( textureVelocity, uv );
  gl_FragColor = p + v;
}
`