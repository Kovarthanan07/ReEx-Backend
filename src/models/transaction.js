const mongoose = require("mongoose");
const validator = require("validator");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      required: true,
      type: Number,
    },

    status: {
      type: String,
      default: "Pending",
      required: true,
      enum: ["Pending", "Rejected", "Approved"],
    },

    category: {
      type: String,
      required: true,
      enum: ["Travel", "Food", "Hotel", "Other"],
    },

    description: {
      type: String,
    },

    transactionDate: {
      type: Date,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["Own Cash", "Card Provided"],
    },

    managerIncharge: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    receiptImage: {
      type: Buffer,
      required: true,
    },

    transactionBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.virtual("transactionId", {
  ref: "CashReimbursement",
  localField: "_id",
  foreignField: "transactionId",
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
