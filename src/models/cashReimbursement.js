const mongoose = require("mongoose");
const validator = require("validator");

const cashReimbursementSchema = new mongoose.Schema(
  {
    amount: {
      required: true,
      type: Number,
    },

    status: {
      type: String,
      default: "Pending",
      required: true,
      enum: ["Pending", "Done", "Cancelled"],
    },

    reimbursementBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    reimbursementAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankDetail",
    },

    reimbursementTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Transaction",
    },
  },
  {
    timestamps: true,
  }
);

const CashReimbursement = mongoose.model(
  "CashReimbursement",
  cashReimbursementSchema
);

module.exports = CashReimbursement;
