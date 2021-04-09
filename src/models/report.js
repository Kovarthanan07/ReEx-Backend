const mongoose = require('mongoose');
const validator = require('validator');

const reportSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },

    message: {
      type: String,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    replies: [
      {
        reply: {
          type: String,
        },

        repliedOn: {
          type: Date,
          default: Date.now,
          required: true,
        },

        sender: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },

        receiver: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Reports = mongoose.model('Reports', reportSchema);

module.exports = Reports;
