const DandelionSpire = require('./DandelionSpire')
const Stem = require('./Stem')
const Shader = require('./DandelionParticleShader')
const randomizeVec = require('./util/randomizeVec')
require('three-instanced-mesh')(THREE)
const GPUComputationRenderer = require('./GPUComputationRenderer')
const POOF_STEM_RANDOM_ORIENT = 1;

const windPositionFrag = require('./WindPositionFragmentShader')
const NewtonFragmentShader = require('./NewtonFragmentShader')
const WindVelocityFragmentShader = require('./WindVelocityFragmentShader')

module.exports = function(renderer) {
  const container = new THREE.Object3D()
  
  const stem = Stem()
  stem.position.set(-2, -21, 0)
  container.add(stem)
  
  const head = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.4, 1),
    new THREE.MeshPhongMaterial({color: 0xc2a91C})
  )
  container.add(head)
  
  const spireMesh = DandelionSpire()
  const spawnGeo = new THREE.IcosahedronGeometry(3.4, 3);
  
  var geometry = new THREE.InstancedBufferGeometry()
  geometry.maxInstancedCount = spawnGeo.vertices.length;
  
  // Mesh vertex positions
  var vertexArray = new Float32Array(spireMesh.geometry.attributes.position.length)
  var vertices = new THREE.BufferAttribute(vertexArray, 3, 1)
  vertices.copyArray(spireMesh.geometry.attributes.position.array)
  geometry.addAttribute('position', vertices)
  

  var indicesArray = new Float32Array(geometry.maxInstancedCount)
  
  for (var i = 0; i < spawnGeo.vertices.length; i++) {
    indicesArray[i] = i;
  }
  var indices = new THREE.InstancedBufferAttribute(indicesArray, 1, 1)
  geometry.addAttribute('idx', indices)
  
  
  var positionComputer = new GPUComputationRenderer( 32, 32, renderer );
  var posTex = positionComputer.createTexture();
  var velTex = positionComputer.createTexture();
  var posArray = posTex.image.data;
  var velArray = velTex.image.data;
  var offsetArray = new Float32Array(32 * 32 * 4)
  for (var i = 0; i < spawnGeo.vertices.length; i++) {
    const spawnVert = spawnGeo.vertices[i]
    offsetArray[i * 4] = spawnVert.x
    offsetArray[i * 4 + 1] = spawnVert.y
    offsetArray[i * 4 + 2] = spawnVert.z
    offsetArray[i * 4 + 3] = Math.random() // mass
    velArray[i * 4] = 0;
    velArray[i * 4 + 1] = 0;
    velArray[i * 4 + 2] = -.4;
    velArray[i * 4 + 3] = i;
  }
  posArray.set(offsetArray)
  const posVar = positionComputer.addVariable("texturePosition", NewtonFragmentShader, posTex)
  const velVar = positionComputer.addVariable("textureVelocity", WindVelocityFragmentShader, velTex)
  posVar.material.uniforms.time = {value: 0.0}
  velVar.material.uniforms.time = {value: 0.0}
  positionComputer.setVariableDependencies(posVar, [posVar, velVar])
  positionComputer.setVariableDependencies(velVar, [posVar, velVar])
  var error = positionComputer.init();
  if ( error !== null ) {
    console.error( error );
  }
  var lookAtArray = new Float32Array(geometry.maxInstancedCount * 4)

  const tmpV = new THREE.Vector3()
  for (var i = 0; i < spawnGeo.vertices.length; i++) {
    const v = spawnGeo.vertices[i]
    const helper = new THREE.Object3D()
    tmpV.copy(v)
    randomizeVec(tmpV, POOF_STEM_RANDOM_ORIENT)
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
      offsetLookup: {type: 't', value: posTex},
      velocityLookup: {type: 't', value: null},
      time: {type: 'f', value: 0},
      texDimension: {type: 'f', value: 32}
    }
  })
    
  const start = Date.now()
  function animate() {
    requestAnimationFrame(animate)
    velVar.material.uniforms.time.value = (Date.now() - start)
    posVar.material.uniforms.time.value = (Date.now() - start)
    positionComputer.compute()
    
    material.uniforms.offsetLookup.value = positionComputer.getCurrentRenderTarget(posVar).texture
    material.uniforms.time.value = Date.now() - start
  }

  requestAnimationFrame(animate)
  const lineMesh = new THREE.LineSegments(geometry, material);
  container.add(lineMesh)
  
  return container
  
}