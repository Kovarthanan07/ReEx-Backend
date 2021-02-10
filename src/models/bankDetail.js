const mongoose = require("mongoose");
const validator = require("validator");

const BankDetail = mongoose.model("BankDetail", {
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
});

module.exports = BankDetail;
