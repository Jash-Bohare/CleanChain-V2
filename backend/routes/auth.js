const express = require("express");
const router = express.Router();
const { db } = require("../firebase/config");

// === ROUTE 1: Wallet Login ===
router.post("/wallet-login", async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) return res.status(400).json({ error: "Missing wallet address" });

  const userRef = db.collection("users").doc(walletAddress);
  const doc = await userRef.get();

  if (!doc.exists) {
    // New user → create profile
    await userRef.set({
      walletAddress,
      tokens: 0,
      joinedAt: new Date().toISOString(),
    });

    return res.status(200).json({ isNewUser: true, userData: { walletAddress } });
  } else {
    return res.status(200).json({ isNewUser: false, userData: doc.data() });
  }
});

// === ROUTE 2: Update Profile ===
router.patch("/update-profile", async (req, res) => {
  const { walletAddress, username, email } = req.body;

  if (!walletAddress || !username) {
    return res.status(400).json({ error: "Missing walletAddress or username" });
  }

  try {
    const userRef = db.collection("users").doc(walletAddress);

    await userRef.set(
      {
        username,
        email: email || null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true } // 🔥 Important: creates or updates fields without overwriting
    );

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
