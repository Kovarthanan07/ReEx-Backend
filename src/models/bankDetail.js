const mongoose = require("mongoose");
const validator = require("validator");

const bankDetailSchema = new mongoose.Schema(
  {
    bank: {
      type: String,
      required: true,
    },

    branch: {
      required: true,
      type: String,
    },

    accountNumber: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

bankDetailSchema.virtual("reimbursementAccount", {
  ref: "CashReimbursement",
  localField: "_id",
  foreignField: "reimbursementAccount",
});

const BankDetail = mongoose.model("BankDetail", bankDetailSchema);

module.exports = BankDetail;
