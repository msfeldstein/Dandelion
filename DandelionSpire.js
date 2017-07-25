const POOF_LENGTH = 1
const POOF_TAIL_LENGTH = 2
const POOF_SECTIONS = 12

module.exports = function() {
  const poofMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  })

  const poofVerts = [
    0, 0, 0,
    0, POOF_TAIL_LENGTH, 0
  ]
  for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / POOF_SECTIONS) {
    poofVerts.push(0, POOF_TAIL_LENGTH, 0)
    poofVerts.push(
      POOF_LENGTH * Math.cos(i),
      POOF_TAIL_LENGTH + .4 + .1 * Math.random(),
      POOF_LENGTH * Math.sin(i))
  }
  const vertices = new Float32Array(poofVerts)
  const poofGeo = new THREE.BufferGeometry()
  poofGeo.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
  const poof = new THREE.LineSegments(poofGeo, poofMaterial)
  poof.vertexCount = POOF_SECTIONS + 1 // for the stem
  return poof
}