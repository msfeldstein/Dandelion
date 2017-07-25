const POOF_STEM_RANDOM_ORIENT = 0.5;

const ICO_DETAIL = 3

const DandelionHead = require('./DandelionHead')

function rand(min, max) {
  return min + (max - min) * Math.random()
}

const Dandelion = function() {
  const stemHeight = 20;
  const stem = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(.6, .6, 20, 8),
    new THREE.MeshPhongMaterial({
      color: 0x219653,
      shading: THREE.FlatShading
    })
  )
  stem.position.y = stemHeight / 2
  const head = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.4, 1),
    new THREE.MeshPhongMaterial({
      color: 0xc2a91C,
      shininess:0,
      shading: THREE.FlatShading
    })
  )
  const spawnGeo = new THREE.IcosahedronGeometry(2.4, ICO_DETAIL)

  const tmpV = new THREE.Vector3()
  const poofs = []
  spawnGeo.vertices.forEach(function(v) {
    const poofStemLength = 3
    const poofColor = new THREE.Color().setHSL(45 / 255, .6, 0.8 + Math.random() * .2)
    const poof = DandelionHead(poofStemLength)
    tmpV.copy(v)
    tmpV.x += rand(-POOF_STEM_RANDOM_ORIENT, POOF_STEM_RANDOM_ORIENT)
    tmpV.y += rand(-POOF_STEM_RANDOM_ORIENT, POOF_STEM_RANDOM_ORIENT)
    tmpV.z += rand(-POOF_STEM_RANDOM_ORIENT, POOF_STEM_RANDOM_ORIENT)
    poof.lookAt(tmpV)
    poof.rotateX(Math.PI / 2)
    poof.position.copy(v)
    
    poof.name = 'Poof'
    window.poof = poof;
    head.add(poof)
    poofs.push(poof)
  })
  head.position.y = 10
  stem.add(head)
  stem.nextPoofIndex = 0;
  stem.sendAPoof = function() {
    let nextPoof = poofs[stem.nextPoofIndex++]
    if (!nextPoof) return
    THREE.SceneUtils.detach(nextPoof, nextPoof.parent, scene)
    nextPoof.blow()
    
    nextPoof = poofs[stem.nextPoofIndex++]
    if (!nextPoof) return
    THREE.SceneUtils.detach(nextPoof, nextPoof.parent, scene)
    nextPoof.blow()
    
    
  }
  stem.sendAllPoofs = function() {
    setInterval(stem.sendAPoof, 16)
  }
  window.stem = stem
  return stem
}

module.exports = Dandelion