const express = require("express");
const BankDetail = require("../models/bankDetail");

const router = express.Router();

router.post("/bankDetail", async (req, res) => {
  const bankDetail = new BankDetail(req.body);
  try {
    await bankDetail.save();
    res.status(201).send(bankDetail);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
