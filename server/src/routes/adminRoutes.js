const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAllUsers,
  getReports,
  resolveReport,
  adminDeleteItem,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.get('/reports', getReports);
router.put('/reports/:id', resolveReport);
router.delete('/items/:id', adminDeleteItem);

module.exports = router;
