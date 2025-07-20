const express = require('express');
const multer = require('multer');
const { db } = require('../firebase/config');
const path = require('path');

const router = express.Router();

// Serve uploads folder statically for public access
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configure Multer for storing files in 'uploads/' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// POST route to handle after-cleaning image upload
router.post('/:locationId', upload.single('afterImage'), async (req, res) => {
  const { locationId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileName = req.file.filename;

    // Construct full public URL
    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

    // Update Firestore with image URL and status
    await db.collection('locations').doc(locationId).update({
      afterPhotoUrl: publicUrl,
      afterImageUploaded: true,
      status: 'awaiting-verification'
    });

    res.status(200).json({
      message: 'Image uploaded and Firestore updated.',
      afterPhotoUrl: publicUrl
    });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Image upload failed.' });
  }
});

module.exports = router;
