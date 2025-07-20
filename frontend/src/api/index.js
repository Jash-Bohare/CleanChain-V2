export const walletLogin = async (walletAddress) => {
  const res = await fetch("http://localhost:5000/auth/wallet-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return await res.json();
};

// (Optional: use this in CompleteProfile.jsx)
export const updateUserProfile = async ({ walletAddress, username, email }) => {
  const res = await fetch("http://localhost:5000/auth/update-profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, username, email }),
  });
  return await res.json();
};

export const fetchLocations = async () => {
  const res = await fetch("http://localhost:5000/api/locations");
  if (!res.ok) throw new Error('Failed to fetch locations');
  return await res.json();
};

export const fetchLocationDetails = async (locationId) => {
  const res = await fetch(`http://localhost:5000/api/locations/${locationId}`);
  if (!res.ok) throw new Error('Failed to fetch location details');
  return await res.json();
};

export const claimLocation = async ({ walletAddress, locationId, userLat, userLng }) => {
  const res = await fetch("http://localhost:5000/api/claim-location", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, locationId, userLat, userLng }),
  });
  return await res.json();
};

export const testDistance = async ({ lat1, lng1, lat2, lng2 }) => {
  const params = new URLSearchParams({ lat1, lng1, lat2, lng2 });
  const res = await fetch(`http://localhost:5000/api/test-distance?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to test distance');
  return await res.json();
};
