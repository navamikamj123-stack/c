const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  requestItem,
  getMyRequests,
  respondToRequest,
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

router.get('/', getItems);
router.get('/requests/my', protect, getMyRequests);
router.get('/:id', getItemById);

router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

router.post('/:id/request', protect, requestItem);
router.put('/requests/:requestId/respond', protect, respondToRequest);

module.exports = router;
