const glslify = require('glslify')
module.exports = glslify`
#pragma glslify: curl = require(glsl-curl-noise)

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 p = texture2D( texturePosition, uv );
  p.xyz += curl(p.xyz / 10.0) / 10.0 + ;
  gl_FragColor = p;
}
`