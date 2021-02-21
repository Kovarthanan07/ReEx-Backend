const mongoose = require("mongoose");
const validator = require("validator");

const topUpRequestSchema = new mongoose.Schema(
  {
    amount: {
      required: true,
      type: Number,
    },

    status: {
      type: String,
      default: "Not Approved",
      required: true,
      enum: ["Not Approved", "Approved"],
    },

    requestTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    requestBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const TopUpRequest = mongoose.model("TopUpRequest", topUpRequestSchema);

module.exports = TopUpRequest;
