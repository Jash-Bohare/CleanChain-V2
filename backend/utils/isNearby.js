// Convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Haversine formula to get distance in meters
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Radius of Earth in meters

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Returns true if distance is within threshold (default 10000 meters)
function isNearby(userLat, userLng, spotLat, spotLng, threshold = 10000) {
  const distance = calculateDistance(userLat, userLng, spotLat, spotLng);
  return distance <= threshold;
}

module.exports = {
  isNearby,
  calculateDistance,
};
