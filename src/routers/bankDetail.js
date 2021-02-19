const express = require("express");
const auth = require("../middleware/auth");
const BankDetail = require("../models/bankDetail");
const router = new express.Router();

router.post(
  "/bankDetail",
  [auth.authUser, auth.isEmployeeOrManager],
  async (req, res) => {
    const bankDetail = new BankDetail({
      ...req.body,
      owner: req.user._id,
    });

    try {
      await bankDetail.save();
      res.status(201).send(bankDetail);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get("/bankDetail", [auth.authUser], async (req, res) => {
  try {
    await req.user.populate("bankDetails").execPopulate();
    res.send(req.user.bankDetails);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/bankDetail/:id", [auth.authUser], async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["bank", "branch", "accountNumber"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const bankDetail = await BankDetail.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!bankDetail) {
      return res.status(404).send();
    }

    updates.forEach((update) => (bankDetail[update] = req.body[update]));
    await bankDetail.save();
    res.send(bankDetail);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/bankDetail/:id", [auth.authUser], async (req, res) => {
  try {
    const bankDetail = await BankDetail.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!bankDetail) {
      res.status(404).send();
    }

    res.send(bankDetail);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
