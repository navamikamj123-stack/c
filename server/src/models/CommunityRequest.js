const mongoose = require('mongoose');

const communityRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide request title'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Books', 'Clothes', 'Electronics', 'Furniture', 'School Supplies', 'Other'],
  },
  description: {
    type: String,
    required: [true, 'Please provide description of what you need'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please provide approximate location or town'],
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requesterName: {
    type: String,
    required: true,
  },
  requesterEmail: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Open', 'Fulfilled', 'Closed'],
    default: 'Open',
  },
  offers: [
    {
      donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      donorName: String,
      donorEmail: String,
      message: String,
      offeredAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CommunityRequest', communityRequestSchema);
