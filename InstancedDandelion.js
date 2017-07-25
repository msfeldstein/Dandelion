const DandelionSpire = require('./DandelionSpire')
const Shader = require('./DandelionParticleShader')
require('three-instanced-mesh')(THREE)
function rand(min, max) {
  return min + (max - min) * Math.random()
}
const POOF_STEM_RANDOM_ORIENT = 1;


module.exports = function() {
  const head = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.4, 1),
    new THREE.MeshPhongMaterial({color: 0xc2a91C})
  )
  
  const spireMesh = DandelionSpire()
  const spawnGeo = new THREE.IcosahedronGeometry(3.4, 3);
    
  var geometry = new THREE.InstancedBufferGeometry()
  var vertexArray = new Float32Array(spireMesh.geometry.attributes.position.length)
  var vertices = new THREE.BufferAttribute(vertexArray, 3, 1)
  vertices.copyArray(spireMesh.geometry.attributes.position.array)
  geometry.addAttribute('position', vertices)
  geometry.maxInstancedCount = spawnGeo.vertices.length;
  
  var offsetArray = new Float32Array(geometry.maxInstancedCount * 3)
  var offsets = new THREE.InstancedBufferAttribute(offsetArray, 3, 1, false)
  for (var i = 0; i < spawnGeo.vertices.length; i++) {
    const spawnVert = spawnGeo.vertices[i]
    offsets.setXYZ(i, spawnVert.x, spawnVert.y, spawnVert.z)
  }
  geometry.addAttribute('offset', offsets)
  
  var lookAtArray = new Float32Array(geometry.maxInstancedCount * 4)

  const tmpV = new THREE.Vector3()
  for (var i = 0; i < spawnGeo.vertices.length; i++) {
    const v = spawnGeo.vertices[i]
    const helper = new THREE.Object3D()
    tmpV.copy(v)
    tmpV.x += rand(-POOF_STEM_RANDOM_ORIENT, POOF_STEM_RANDOM_ORIENT)
    tmpV.y += rand(-POOF_STEM_RANDOM_ORIENT, POOF_STEM_RANDOM_ORIENT)
    tmpV.z += rand(-POOF_STEM_RANDOM_ORIENT, POOF_STEM_RANDOM_ORIENT)
    helper.lookAt(tmpV)
    
    helper.rotateX(Math.PI / 2)
    helper.position.copy(v)
    helper.updateMatrixWorld()
    lookAtArray[i * 4 + 0] = helper.quaternion.x
    lookAtArray[i * 4 + 1] = helper.quaternion.y
    lookAtArray[i * 4 + 2] = helper.quaternion.z
    lookAtArray[i * 4 + 3] = helper.quaternion.w
  }
  
  var lookAts = new THREE.InstancedBufferAttribute(lookAtArray, 4, 1, true)
  geometry.addAttribute('quat', lookAts)
  
  var material = new THREE.RawShaderMaterial({
    vertexShader: Shader.vertexShader,
    fragmentShader: Shader.fragmentShader,
    transparent: true,
    uniforms: {
      time: {type: 'f', value: 0}
    }
  })
    
  const start = Date.now()
  function animate() {
    requestAnimationFrame(animate)
    material.uniforms.time.value = Date.now() - start
  }
  requestAnimationFrame(animate)
  const lineMesh = new THREE.LineSegments(geometry, material);
  head.add(lineMesh)
  return head
  
}