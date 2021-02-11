const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.userId,
      req.body.password
    );
    // const token = await user.generateAuthToken();
    // res.send({ user, token });
    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
