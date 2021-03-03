const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    type: Date,
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

  profilePicture: {
    type: Buffer,
  },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("bankDetails", {
  ref: "BankDetail",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("news", {
  ref: "News",
  localField: "_id",
  foreignField: "postedBy",
});

userSchema.virtual("topUpRequestSended", {
  ref: "TopUpRequest",
  localField: "_id",
  foreignField: "requestBy",
});

userSchema.virtual("topUpRequestReceived", {
  ref: "TopUpRequest",
  localField: "_id",
  foreignField: "requestTo",
});

userSchema.virtual("transactionIncharge", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "managerIncharge",
});

userSchema.virtual("transactionMade", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "transactionBy",
});

userSchema.virtual("reimbursementBy", {
  ref: "CashReimbursement",
  localField: "_id",
  foreignField: "reimbursementBy",
});

userSchema.virtual("reimbursementTo", {
  ref: "CashReimbursement",
  localField: "_id",
  foreignField: "reimbursementTo",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thenans");
  user.tokens = user.tokens.concat({ token });
  user.save();
  return token;
};

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
