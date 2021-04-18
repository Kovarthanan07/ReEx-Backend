const mongoose = require('mongoose');
const validator = require('validator');

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      required: true,
      type: Number,
    },

    status: {
      type: String,
      default: 'Pending',
      required: true,
      enum: ['Pending', 'Rejected', 'Approved'],
    },

    category: {
      type: String,
      required: true,
      enum: ['Travel', 'Food', 'Hotel', 'Other'],
    },

    description: {
      type: String,
    },

    transactionDate: {
      type: Date,
      // required: true,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'Card'],
    },

    managerIncharge: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    receiptUrl: {
      type: String,
      required: true,
    },

    transactionBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.virtual('transactionId', {
  ref: 'CashReimbursement',
  localField: '_id',
  foreignField: 'transactionId',
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
