const express = require('express');
const path = require('path');
const ShareableLink = require('../Models/link');

const router = express.Router();

router.get('/share/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const link = await ShareableLink.findOne({ where: { token } });

    if (!link || link.expiresAt < new Date()) {
      return res.status(404).send('Link not found or expired');
    }

    res.sendFile(path.resolve(link.filePath));
  } catch (error) {
    console.error('Error serving shared file:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;