const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an item title'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Books', 'Clothes', 'Electronics', 'Furniture', 'School Supplies', 'Other'],
  },
  description: {
    type: String,
    required: [true, 'Please provide an item description'],
    trim: true,
  },
  condition: {
    type: String,
    required: [true, 'Please select an item condition'],
    enum: ['New', 'Like New', 'Gently Used', 'Fair', 'Needs TLC'],
  },
  imageUrl: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    required: [true, 'Please specify pickup area or town'],
    trim: true,
  },
  contactPreference: {
    type: String,
    default: 'In-app Requests Only',
    enum: ['In-app Requests Only', 'Email Contact', 'In-app Chat or Call'],
  },
  status: {
    type: String,
    enum: ['Available', 'Requested', 'Completed', 'Cancelled'],
    default: 'Available',
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  donorName: {
    type: String,
    required: true,
  },
  donorEmail: {
    type: String,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  recipientName: {
    type: String,
    default: null,
  },
  estimatedWasteDivertedKg: {
    type: Number,
    default: 2.0,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', itemSchema);
