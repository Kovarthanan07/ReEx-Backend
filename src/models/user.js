const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  role: {
    type: String,
    required: true,
    trim: true,
    enum: ["employee", "manager", "admin"],
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
    unique: true,
  },

  email: {
    type: String,
    unique: true,
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
    unique: true,
    required: true,
  },

  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.statics.findByCredentials = async (userId, password) => {
  const user = await User.findOne({ userId });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
