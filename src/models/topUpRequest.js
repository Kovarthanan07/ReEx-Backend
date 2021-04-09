const mongoose = require('mongoose');
const validator = require('validator');

const topUpRequestSchema = new mongoose.Schema(
  {
    amount: {
      required: true,
      type: Number,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      default: 'Pending',
      required: true,
      enum: ['Pending', 'Rejected', 'Approved'],
    },

    requestTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    requestBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const TopUpRequest = mongoose.model('TopUpRequest', topUpRequestSchema);

module.exports = TopUpRequest;
