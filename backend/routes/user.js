const express = require('express');
const router = express.Router();
const { db } = require('../firebase/config');

// Get claimed and cleaned locations for a user
router.get('/:userId/locations', async (req, res) => {
  const userId = req.params.userId;

  try {
    const snapshot = await db.collection('locations').where('claimedBy', '==', userId).get();
    const userLocations = [];
    snapshot.forEach(doc => {
      userLocations.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ locations: userLocations });
  } catch (error) {
    console.error('Error fetching user locations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
