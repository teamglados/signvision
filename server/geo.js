// Returns radians from degrees
const radians = d => (d * Math.PI / 180);

// Returns degrees from radians
const degrees = r => (r * 180 / Math.PI);

// Returns the haversine distance in km between two coords
const distance = (lat1, lng1, lat2, lng2) => {

  // Get deltas
  const dLat = radians(lat2-lat1);
  const dLon = radians(lng2-lng1);

  // Convert to radians
  lat1 = radians(lat1);
  lat2 = radians(lat2);

  const a = (Math.sin(dLat/2) * Math.sin(dLat/2) +
            (Math.sin(dLon/2) * Math.sin(dLon/2) *
             Math.cos(lat1) * Math.cos(lat2)));

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Export all
module.exports = {
  radians,
  degress,
  distance,
}
