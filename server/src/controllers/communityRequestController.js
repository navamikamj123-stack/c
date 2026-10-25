const { getStorage } = require('../data/storage');

// @desc    Get all community requests with filter/search
// @route   GET /api/community-requests
const getCommunityRequests = async (req, res) => {
  try {
    const { category, status, search, requester } = req.query;
    const storage = getStorage();
    const requests = await storage.getCommunityRequests({ category, status, search, requester });
    return res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single community request by ID
// @route   GET /api/community-requests/:id
const getCommunityRequestById = async (req, res) => {
  try {
    const storage = getStorage();
    const request = await storage.getCommunityRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Community request not found.' });
    }
    return res.json({ success: true, data: request });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new community request
// @route   POST /api/community-requests
const createCommunityRequest = async (req, res) => {
  try {
    const { title, category, description, location, imageUrl, urgency } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, description, and location.',
      });
    }

    const storage = getStorage();
    const commReq = await storage.createCommunityRequest({
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      imageUrl: imageUrl ? imageUrl.trim() : '',
      urgency: urgency || 'Medium',
      requester: req.user.id,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
    });

    return res.status(201).json({
      success: true,
      message: 'Community need posted successfully! Neighbors will be notified.',
      data: commReq,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Offer an item to fulfill a community request
// @route   POST /api/community-requests/:id/offer
const offerItem = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please write a brief offer message or pickup suggestion.' });
    }

    const storage = getStorage();
    const commReq = await storage.getCommunityRequestById(req.params.id);
    if (!commReq) {
      return res.status(404).json({ success: false, message: 'Community request not found.' });
    }

    const updated = await storage.addOfferToCommunityRequest(req.params.id, {
      donorId: req.user.id,
      donorName: req.user.name,
      donorEmail: req.user.email,
      message: message.trim(),
    });

    return res.json({
      success: true,
      message: 'Your generous offer has been sent to the requester!',
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Mark community request as fulfilled or update status
// @route   PUT /api/community-requests/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const storage = getStorage();
    const commReq = await storage.getCommunityRequestById(req.params.id);

    if (!commReq) {
      return res.status(404).json({ success: false, message: 'Community request not found.' });
    }

    const isOwner = commReq.requester.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to change status.' });
    }

    const updated = await storage.updateCommunityRequest(req.params.id, { status });
    return res.json({
      success: true,
      message: `Request marked as ${status}!`,
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete community request
// @route   DELETE /api/community-requests/:id
const deleteCommunityRequest = async (req, res) => {
  try {
    const storage = getStorage();
    const commReq = await storage.getCommunityRequestById(req.params.id);

    if (!commReq) {
      return res.status(404).json({ success: false, message: 'Community request not found.' });
    }

    const isOwner = commReq.requester.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this request.' });
    }

    await storage.deleteCommunityRequest(req.params.id);
    return res.json({ success: true, message: 'Community request deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCommunityRequests,
  getCommunityRequestById,
  createCommunityRequest,
  offerItem,
  updateStatus,
  deleteCommunityRequest,
};
