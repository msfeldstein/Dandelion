const glslify = require('glslify')

const fragmentShader = `
precision highp float;
uniform float time;
void main() {
	gl_FragColor = vec4(1.0, 1.0, 1.0, 0.3);
}
`

const vertexShader = glslify`
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float texDimension;

uniform sampler2D offsetLookup;
attribute float idx;
attribute vec3 position;
attribute vec3 euler;
attribute vec4 quat;

#pragma glslify: rotate_vertex_position = require(./rotate_around_quaternion)
#pragma glslify: curl = require(glsl-curl-noise)
void main(){
	vec3 rotated = rotate_vertex_position(position, quat);
	vec2 uv = vec2(
		mod(idx, texDimension) / texDimension,
		floor(idx / texDimension) / texDimension
	);
	vec3 offset = texture2D(offsetLookup, uv).xyz;
	vec4 absPos = vec4(rotated + offset, 1.0);
	absPos.xyz += curl(vec3(offset.xy, time / 20000.0)) / 3.0;
	gl_Position = projectionMatrix * modelViewMatrix * absPos;
}
`

module.exports = {
  fragmentShader,
  vertexShader
}