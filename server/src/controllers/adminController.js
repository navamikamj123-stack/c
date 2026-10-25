const { getStorage } = require('../data/storage');

// @desc    Get Admin Overview Statistics
// @route   GET /api/admin/overview
const getAdminOverview = async (req, res) => {
  try {
    const storage = getStorage();
    const users = await storage.getAllUsers();
    const items = await storage.getItems();
    const requests = await storage.getItemRequests();
    const communityReqs = await storage.getCommunityRequests();
    const reports = await storage.getReports();

    const completed = items.filter(i => i.status === 'Completed').length;
    const pendingReports = reports.filter(r => r.status === 'Pending').length;

    return res.json({
      success: true,
      data: {
        totalUsers: users.length,
        totalListings: items.length,
        activeListings: items.filter(i => i.status === 'Available').length,
        completedExchanges: completed,
        totalCommunityRequests: communityReqs.length,
        openCommunityRequests: communityReqs.filter(r => r.status === 'Open').length,
        totalItemRequests: requests.length,
        pendingReports,
        totalReports: reports.length,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const storage = getStorage();
    const users = await storage.getAllUsers();
    return res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all reports (admin only)
// @route   GET /api/admin/reports
const getReports = async (req, res) => {
  try {
    const { status } = req.query;
    const storage = getStorage();
    const reports = await storage.getReports({ status });
    return res.json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a content report (authenticated user)
// @route   POST /api/reports
const createReport = async (req, res) => {
  try {
    const { targetType, targetId, targetTitle, reason } = req.body;
    if (!targetId || !targetTitle || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide target ID, title, and the reason for the report.',
      });
    }

    const storage = getStorage();
    const report = await storage.createReport({
      targetType: targetType || 'Item',
      targetId,
      targetTitle,
      reporter: req.user.id,
      reporterName: req.user.name,
      reason: reason.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Report submitted for administrator review. Thank you for keeping our community safe.',
      data: report,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Resolve report (admin only)
// @route   PUT /api/admin/reports/:id
const resolveReport = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const storage = getStorage();
    const updated = await storage.updateReport(req.params.id, {
      status: status || 'Reviewed',
      resolutionNotes: resolutionNotes || '',
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    return res.json({ success: true, message: 'Report updated.', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Admin deletes an inappropriate listing
// @route   DELETE /api/admin/items/:id
const adminDeleteItem = async (req, res) => {
  try {
    const storage = getStorage();
    const success = await storage.deleteItem(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Item listing not found.' });
    }
    return res.json({ success: true, message: 'Inappropriate listing removed by admin.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAdminOverview,
  getAllUsers,
  getReports,
  createReport,
  resolveReport,
  adminDeleteItem,
};
