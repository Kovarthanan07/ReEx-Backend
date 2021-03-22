const express = require("express");
const router = new express.Router();

router.get("/", async (req, res) => {
  res.send("backend working successfully ...");
});

module.exports = router;
