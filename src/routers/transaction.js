const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const auth = require('../middleware/auth');
const Transaction = require('../models/transaction');
const CashReimbursement = require('../models/cashReimbursement');
const router = new express.Router();

router.post(
  '/transaction',
  [auth.authUser, auth.isEmployee],
  async (req, res) => {
    const transaction = new Transaction({
      managerIncharge: mongoose.Types.ObjectId(req.body.managerIncharge),
      category: req.body.category,
      paymentMethod: req.body.paymentMethod,
      amount: parseInt(req.body.amount),
      description: req.body.description,
      transactionDate: Date.parse(req.body.transactionDate),
      receiptUrl: req.body.receiptUrl,
      transactionBy: req.user._id,
    });

    try {
      if (transaction.paymentMethod === 'Cash') {
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
  '/transactionMade',
  [auth.authUser, auth.isEmployee],
  async (req, res) => {
    try {
      await req.user.populate('transactionMade').execPopulate();
      res.send(req.user.transactionMade);
    } catch (e) {
      res.status(500).send();
    }
  }
);

router.get(
  '/transactionIncharge',
  [auth.authUser, auth.isManager],
  async (req, res) => {
    try {
      await req.user.populate('transactionIncharge').execPopulate();
      res.send(req.user.transactionIncharge);
    } catch (e) {
      res.status(500).send();
    }
  }
);

router.get('/allTransactions', [auth.authUser], async (req, res) => {
  try {
    const allTransactions = await Transaction.find({});
    res.send(allTransactions);
  } catch (e) {
    res.status(500).send();
  }
});

router.get(
  '/transactionsBy/:userid',
  [auth.authUser, auth.isAdmin],
  async (req, res) => {
    try {
      const allTransactions = await Transaction.find({
        transactionBy: req.params.userid,
      });
      res.send(allTransactions);
    } catch (e) {
      res.status(500).send();
    }
  }
);

router.patch(
  '/transaction/:id',
  [auth.authUser, auth.isManager],
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['status'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
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
