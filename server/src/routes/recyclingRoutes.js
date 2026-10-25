const express = require('express');
const router = express.Router();
const { getRecyclingCentres } = require('../controllers/recyclingController');

router.get('/', getRecyclingCentres);

module.exports = router;
