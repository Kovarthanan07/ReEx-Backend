const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thenans");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const role = user.role;
    if (role !== "admin") {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).send({ error: "Admin is allowed ... " });
  }
};

const isManager = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const role = user.role;
    if (role !== "manager") {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).send({ error: "Manager is allowed ... " });
  }
};

const isEmployee = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const role = user.role;
    if (role !== "employee") {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).send({ error: "Employee is allowed ... " });
  }
};

const isEmployeeOrManager = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const role = user.role;
    if (role === "admin") {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).send({ error: "Employee or Manager is allowed ... " });
  }
};

const isAdminOrManager = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const role = user.role;
    if (role === "employee") {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).send({ error: "Admin or Manager is allowed ... " });
  }
};

const auth = {
  authUser,
  isAdmin,
  isManager,
  isEmployee,
  isEmployeeOrManager,
  isAdminOrManager,
};
module.exports = auth;
