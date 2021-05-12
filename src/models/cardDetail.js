const mongoose = require('mongoose');

const cardDetailSchema = new mongoose.Schema(
  {
    balanceAmount: {
      type: Number,
      default: 10000,
      required: true,
    },

    holder: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const CardDetail = mongoose.model('CardDetail', cardDetailSchema);

module.exports = CardDetail;
