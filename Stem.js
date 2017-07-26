module.exports = function() {
  var curve = new THREE.CubicBezierCurve(
  	new THREE.Vector3( 0, 0, 0 ),
  	new THREE.Vector3( 0, 7, 0 ),
  	new THREE.Vector3( 0, 13, 0 ),
  	new THREE.Vector3( 2, 20, 0 )
  );
  window.curve = curve
  console.log(curve)
  var path = new THREE.Path( curve.getPoints( 50 ) )
  var geometry = path.createPointsGeometry( 50 );
  var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
  
  // Create the final object to add to the scene
  var curveObject = new THREE.Line( geometry, material );
  
  var geo = new THREE.TubeGeometry(curve, 20, .2, 8, false)
  var mat = new THREE.MeshPhongMaterial({color: 0x3aed3c})
  var mesh = new THREE.Mesh(geo, mat)
  mesh.add(curveObject)
  return mesh
}