const mongoose = require("mongoose");
const validator = require("validator");

const News = mongoose.model("News", {
  title: {
    required: true,
    type: String,
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
