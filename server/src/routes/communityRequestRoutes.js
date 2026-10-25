const express = require('express');
const router = express.Router();
const {
  getCommunityRequests,
  getCommunityRequestById,
  createCommunityRequest,
  offerItem,
  updateStatus,
  deleteCommunityRequest,
} = require('../controllers/communityRequestController');
const { protect } = require('../middleware/auth');

router.get('/', getCommunityRequests);
router.get('/:id', getCommunityRequestById);
router.post('/', protect, createCommunityRequest);
router.post('/:id/offer', protect, offerItem);
router.put('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteCommunityRequest);

module.exports = router;
