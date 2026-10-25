const { getStorage } = require('../data/storage');

// @desc    Get all items with filtering and search
// @route   GET /api/items
const getItems = async (req, res) => {
  try {
    const { category, condition, status, search, donor, recipient } = req.query;
    const storage = getStorage();
    const items = await storage.getItems({
      category,
      condition,
      status,
      search,
      donor,
      recipient,
    });
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
const getItemById = async (req, res) => {
  try {
    const storage = getStorage();
    const item = await storage.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item listing not found.' });
    }
    return res.json({ success: true, data: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a donation listing
// @route   POST /api/items
const createItem = async (req, res) => {
  try {
    const { title, category, description, condition, imageUrl, location, contactPreference } = req.body;

    if (!title || !category || !description || !condition || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (title, category, description, condition, location).',
      });
    }

    const storage = getStorage();
    const item = await storage.createItem({
      title: title.trim(),
      category,
      description: description.trim(),
      condition,
      imageUrl: imageUrl ? imageUrl.trim() : '',
      location: location.trim(),
      contactPreference: contactPreference || 'In-app Requests Only',
      donor: req.user.id,
      donorName: req.user.name,
      donorEmail: req.user.email,
    });

    return res.status(201).json({
      success: true,
      message: 'Donation listing published successfully! Thank you for fostering sustainability.',
      data: item,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a donation listing
// @route   PUT /api/items/:id
const updateItem = async (req, res) => {
  try {
    const storage = getStorage();
    const item = await storage.getItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    // Ownership or admin check
    const isOwner = item.donor.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing.' });
    }

    const updated = await storage.updateItem(req.params.id, req.body);
    return res.json({
      success: true,
      message: 'Listing updated successfully!',
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a donation listing
// @route   DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const storage = getStorage();
    const item = await storage.getItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    const isOwner = item.donor.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing.' });
    }

    await storage.deleteItem(req.params.id);
    return res.json({
      success: true,
      message: 'Listing removed successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Request an item
// @route   POST /api/items/:id/request
const requestItem = async (req, res) => {
  try {
    const { message } = req.body;
    const storage = getStorage();
    const item = await storage.getItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item listing not found.' });
    }

    if (item.donor.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request your own donation listing.' });
    }

    if (item.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'This item has already been rehomed.' });
    }

    // Check duplicate request
    const existingRequests = await storage.getItemRequests({
      item: item._id,
      requester: req.user.id,
    });

    if (existingRequests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a request for this item.',
      });
    }

    const newRequest = await storage.createItemRequest({
      item: item._id,
      itemTitle: item.title,
      requester: req.user.id,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      donor: item.donor,
      message: message || 'I would like to request this item and can arrange pickup at your convenience.',
    });

    // Optionally mark item status as Requested if currently Available
    if (item.status === 'Available') {
      await storage.updateItem(item._id, { status: 'Requested' });
    }

    return res.status(201).json({
      success: true,
      message: 'Item request submitted successfully to the donor!',
      data: newRequest,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get user's item requests (as requester or as donor)
// @route   GET /api/items/requests/my
const getMyRequests = async (req, res) => {
  try {
    const storage = getStorage();
    const asRequester = await storage.getItemRequests({ requester: req.user.id });
    const asDonor = await storage.getItemRequests({ donor: req.user.id });
    return res.json({
      success: true,
      asRequester,
      asDonor,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Donor responds to request (Accept / Reject / Complete)
// @route   PUT /api/items/requests/:requestId/respond
const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted', 'Rejected', 'Completed'
    if (!['Accepted', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status response.' });
    }

    const storage = getStorage();
    const itemReq = await storage.getItemRequestById(req.params.requestId);

    if (!itemReq) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    // Only donor can respond
    if (itemReq.donor.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the donor can respond to this request.' });
    }

    const updatedReq = await storage.updateItemRequest(req.params.requestId, { status });

    // Update item status based on response
    if (status === 'Accepted') {
      await storage.updateItem(itemReq.item, {
        status: 'Requested',
        recipient: itemReq.requester,
        recipientName: itemReq.requesterName,
      });
    } else if (status === 'Completed') {
      await storage.updateItem(itemReq.item, {
        status: 'Completed',
        recipient: itemReq.requester,
        recipientName: itemReq.requesterName,
        completedAt: new Date().toISOString(),
      });
    } else if (status === 'Rejected') {
      // Check if there are other pending requests; if not, revert item to Available
      const otherPending = await storage.getItemRequests({ item: itemReq.item });
      const hasOtherAccepted = otherPending.some(r => r._id.toString() !== itemReq._id.toString() && r.status === 'Accepted');
      if (!hasOtherAccepted) {
        await storage.updateItem(itemReq.item, { status: 'Available', recipient: null, recipientName: null });
      }
    }

    return res.json({
      success: true,
      message: `Request has been marked as ${status}.`,
      data: updatedReq,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  requestItem,
  getMyRequests,
  respondToRequest,
};
