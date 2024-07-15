const express = require('express');
const { createLink } = require('../Controllers/linkController');

const router = express.Router();

router.post('/create', createLink);

module.exports = router;
