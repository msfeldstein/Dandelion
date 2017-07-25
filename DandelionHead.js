const POOF_LENGTH = 1
const POOF_STEM_LENGTH = 1
module.exports = function(stemLength) {
  const poofMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  })

  let poofVerts = [
    0, 0, 0,
    0, stemLength, 0
  ]
  for (let i = 0; i < Math.PI * 2; i += Math.PI / 8) {
    poofVerts.push(0, stemLength, 0)
    poofVerts.push(
      POOF_LENGTH * Math.cos(i),
      stemLength + .4 + .1 * Math.random(),
      POOF_LENGTH * Math.sin(i))
  }
  const vertices = new Float32Array(poofVerts)
  const poofGeo = new THREE.BufferGeometry()
  poofGeo.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
  const poof = new THREE.LineSegments(poofGeo, poofMaterial)
  
  poof.blow = function() {
    function animate() {
      requestAnimationFrame(animate)
      poof.position.x += 0.51
      poof.rotation.x += 0.01
      poof.rotation.y += 0.012
    }
    animate()
  }
  
  return poof
}