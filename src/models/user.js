const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true,
  },

  role: {
    type: String,
    required: true,
    trim: true,
  },

  gender: {
    type: String,
    required: true,
    trim: true,
  },

  dateOfBirth: {
    type: String,
    required: true,
  },

  mobileNumber: {
    type: String,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
  },

  userId: {
    type: String,
    required: true,
  },
});

module.exports = User;
