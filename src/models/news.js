const mongoose = require("mongoose");
const validator = require("validator");

const newsSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },

    startDisplayOn: {
      type: Date,
      default: Date.now,
      required: true,
    },

    endDisplayOn: {
      type: Date,
      required: true,
    },

    viewers: [
      {
        type: String,
        default: ["employee", "manager", "admin"],
      },
    ],

    news: {
      type: String,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", newsSchema);

module.exports = News;
