const express = require("express");
const auth = require("../middleware/auth");
const Transaction = require("../models/transaction");
const CashReimbursement = require("../models/cashReimbursement");
const router = new express.Router();

router.post(
  "/transaction",
  [auth.authUser, auth.isEmployee],
  async (req, res) => {
    const transaction = new Transaction({
      ...req.body,
      transactionBy: req.user._id,
    });

    try {
      await transaction.save();
      if (transaction.paymentMethod === "Own Cash") {
        const cashReimbursement = new CashReimbursement({
          transactionId: transaction._id,
          amount: transaction.amount,
          ReimbursmentBy: transaction.managerIncharge,
          ReimbursmentTo: transaction.transactionBy,
        });
        await cashReimbursement.save();
      }
      res.status(201).send(transaction);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get(
  "/transactionMade",
  [auth.authUser, auth.isEmployee],
  async (req, res) => {
    try {
      await req.user.populate("transactionMade").execPopulate();
      res.send(req.user.transactionMade);
    } catch (e) {
      res.status(500).send();
    }
  }
);

router.get(
  "/transactionIncharge",
  [auth.authUser, auth.isManager],
  async (req, res) => {
    try {
      await req.user.populate("transactionIncharge").execPopulate();
      res.send(req.user.transactionIncharge);
    } catch (e) {
      res.status(500).send();
    }
  }
);

router.patch(
  "/transaction/:id",
  [auth.authUser, auth.isManager],
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["status"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        managerIncharge: req.user._id,
      });

      if (!transaction) {
        return res.status(404).send();
      }

      updates.forEach((update) => (transaction[update] = req.body[update]));
      await transaction.save();
      res.send(transaction);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

module.exports = router;
