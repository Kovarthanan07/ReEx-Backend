const express = require("express");
const auth = require("../middleware/auth");
const CashReimbursement = require("../models/cashReimbursement");
const router = new express.Router();

router.patch(
  "/cashReimbursement/:id",
  [auth.authUser, auth.isManager],
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["status", "reimbursementAccount"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
      const cashReimbursement = await CashReimbursement.findOne({
        _id: req.params.id,
        reimbursementBy: req.user._id,
      });

      if (!cashReimbursement) {
        return res.status(404).send();
      }

      updates.forEach(
        (update) => (cashReimbursement[update] = req.body[update])
      );
      await cashReimbursement.save();
      res.send(cashReimbursement);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

module.exports = router;
