const express = require('express');
const multer = require('multer');
const videoController = require('../Controllers/videoController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const verifyToken = require('../middlewares/auth');

router.post('/upload', upload.single('video'), authenticateToken, videoController.uploadVideo);

router.post('/trim/:id', authenticateToken, videoController.trimVideo);

router.post('/merge', authenticateToken, videoController.mergeVideos);

router.get('/', videoController.getVideos);

module.exports = router;

