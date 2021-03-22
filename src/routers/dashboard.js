const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = new express.Router();

router.get("/dashboard", [auth.authUser, auth.isEmployee], async (req, res) => {
  try {
    const name = req.user.name;
    await req.user.populate("transactionMade").execPopulate();

    res.send({ name });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
