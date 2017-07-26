const Dandelion = require('./Dandelion')
const OrbitControls = require('three-orbitcontrols')
document.body.style.margin = 0
window.THREE = require('three')
window.scene = new THREE.Scene()
window.renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.extensions.get( "OES_texture_float" )
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100)
camera.position.z = 30
camera.position.x = 20
camera.position.y = 10
new OrbitControls(camera)
camera.lookAt(new THREE.Vector3())
const flower = new Dandelion()
// scene.add(flower)
flower.position.y = -10

scene.add(new THREE.AmbientLight(0xacacac))
const light = new THREE.DirectionalLight(0xdcdcdc)
light.position.set(10, 10, 10)
scene.add(light)

const InstancedDandelion = require('./InstancedDandelion')
scene.add(InstancedDandelion(renderer))


const axis = new THREE.AxisHelper(3)
scene.add(axis)
axis.geometry.depthTest = false

function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
render()