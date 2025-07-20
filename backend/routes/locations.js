const express = require("express");
const router = express.Router();
const { db } = require("../firebase/config");
const { isNearby, calculateDistance } = require("../utils/isNearby");
const sendClaimNotification = require("../utils/sendEmail");

// GET /locations → returns all locations
router.get("/locations", async (req, res) => {
  try {
    const snapshot = await db.collection("locations").get();
    const locations = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      const base = {
        id: doc.id,
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        rewardTokens: data.rewardTokens,
        beforePhotoUrl: data.beforePhotoUrl,
      };

      if (data.cleaned === true) {
        locations.push({
          ...base,
          status: "cleaned",
          cleanedBy: data.cleanedBy || null,
          afterPhotoUrl: data.afterPhotoUrl || null,
        });
      } else if (data.claimedBy) {
        locations.push({
          ...base,
          status: "claimed",
          claimedBy: data.claimedBy,
        });
      } else {
        locations.push({
          ...base,
          status: "unclaimed",
        });
      }
    });

    res.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// POST /claim-location
router.post("/claim-location", async (req, res) => {
  const { walletAddress, locationId, userLat, userLng } = req.body;

  try {
    const locationRef = db.collection("locations").doc(locationId);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      return res.status(404).json({ status: "not found" });
    }

    const location = locationDoc.data();

    // Already cleaned
    if (location.cleaned === true) {
      if (location.cleanedBy === walletAddress) {
        return res.status(409).json({ status: "already cleaned by you" });
      } else {
        return res.status(409).json({ status: "already cleaned" });
      }
    }

    // Already claimed
    if (location.claimedBy) {
      if (location.claimedBy === walletAddress) {
        return res.status(409).json({ status: "already claimed by you" });
      } else {
        return res.status(409).json({ status: "already claimed" });
      }
    }

    // Distance check
    const distance = calculateDistance(userLat, userLng, location.lat, location.lng);
    if (distance > 10000) {
      return res.status(403).json({
        status: "too far",
        distance: parseFloat(distance.toFixed(2)),
      });
    }

    // Claim location
    await locationRef.update({
      claimedBy: walletAddress,
      claimedAt: new Date().toISOString(),
    });

    // Fetch user info from Firestore
    const userSnap = await db.collection("users").doc(walletAddress).get();
    const userData = userSnap.exists ? userSnap.data() : {};
    const userEmail = userData.email || null;
    const userName = userData.name || userData.username || null;

    // Send email if email is available
    if (userEmail) {
      await sendClaimNotification(userEmail, userName, location.name);
    }

    return res.status(200).json({ status: "claimed" });

  } catch (err) {
    console.error("Error in claim-location:", err);
    return res.status(500).json({ error: "Claim failed", details: err });
  }
});

// GET /locations/:id
router.get("/locations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const locationRef = db.collection("locations").doc(id);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      return res.status(404).json({ error: "Location not found" });
    }

    const data = locationDoc.data();

    const locationData = {
      id: locationDoc.id,
      name: data.name,
      lat: data.lat,
      lng: data.lng,
      rewardTokens: data.rewardTokens,
      beforePhotoUrl: data.beforePhotoUrl,
      afterPhotoUrl: data.afterPhotoUrl || null,
      claimedBy: data.claimedBy || null,
      cleanedBy: data.cleanedBy || null,
      claimedAt: data.claimedAt || null,
      cleaned: data.cleaned || false,
    };

    res.status(200).json(locationData);
  } catch (err) {
    console.error("Error fetching single location:", err);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

// GET /test-distance
router.get("/test-distance", (req, res) => {
  const { lat1, lng1, lat2, lng2 } = req.query;

  if (!lat1 || !lng1 || !lat2 || !lng2) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const lat1Num = parseFloat(lat1);
  const lng1Num = parseFloat(lng1);
  const lat2Num = parseFloat(lat2);
  const lng2Num = parseFloat(lng2);

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000;

  const dLat = toRad(lat2Num - lat1Num);
  const dLng = toRad(lng2Num - lng1Num);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1Num)) *
    Math.cos(toRad(lat2Num)) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  res.status(200).json({
    point1: { lat: lat1Num, lng: lng1Num },
    point2: { lat: lat2Num, lng: lng2Num },
    distanceInMeters: Math.round(distance),
    isNearby: distance <= 10000,
  });
});

module.exports = router;
