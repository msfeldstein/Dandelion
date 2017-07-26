function rand(min, max) {
  return min + (max - min) * Math.random()
}

module.exports = function(vec, amt) {
  vec.x += rand(-amt, amt)
  vec.y += rand(-amt, amt)
  vec.z += rand(-amt, amt)
}