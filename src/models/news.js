const mongoose = require("mongoose");
const validator = require("validator");

const News = mongoose.model("News", {
  adminId: {
    required: true,
  },
  title: {
    required: true,
    type: String,
  },
  forWhom: {
    type: String,
    required: true,
  },
  postedOn: {
    type: Date.now(),
    required: true,
  },
  news: {
    type: String,
  },
});

module.exports = News;
