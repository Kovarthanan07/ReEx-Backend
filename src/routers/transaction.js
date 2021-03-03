const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const Transaction = require("../models/transaction");
const CashReimbursement = require("../models/cashReimbursement");
const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/transaction",
  [auth.authUser, auth.isEmployee],
  upload.single("receiptImage"),
  async (req, res) => {
    const transaction = new Transaction({
      ...req.body,
      transactionBy: req.user._id,
      receiptImage: req.file.buffer,
    });

    try {
      if (transaction.paymentMethod === "Own Cash") {
        const cashReimbursement = new CashReimbursement({
          transactionId: transaction._id,
          amount: transaction.amount,
          reimbursementBy: transaction.managerIncharge,
          reimbursementTo: transaction.transactionBy,
        });
        await cashReimbursement.save();
      }
      await transaction.save();
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

// view Receipt

// router.get("/transaction/:id/receiptImage", async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id);
//     if (!transaction || !transaction.receiptImage) {
//       throw new Error();
//     }
//     res.set("Content-Type", "image/jpg");
//     res.send(transaction.receiptImage);
//   } catch (error) {
//     res.status(400).send();
//   }
// });

module.exports = router;
