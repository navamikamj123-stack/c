const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  targetType: {
    type: String,
    enum: ['Item', 'CommunityRequest', 'User'],
    default: 'Item',
  },
  targetId: {
    type: String,
    required: true,
  },
  targetTitle: {
    type: String,
    required: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporterName: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: [true, 'Please explain the reason for this report'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Dismissed'],
    default: 'Pending',
  },
  resolutionNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);
