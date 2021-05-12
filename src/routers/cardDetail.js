const express = require('express');
const auth = require('../middleware/auth');
const CardDetail = require('../models/cardDetail');
const router = new express.Router();

router.get('/cardBalance/:id', [auth.authUser], async (req, res) => {
  try {
    const cardDetail = await CardDetail.findOne({ holder: req.params.id });
    res.send(cardDetail);
  } catch (error) {
    res.status(400).send();
  }
});

router.patch(
  '/subAmount/:id',
  [auth.authUser, auth.isManager],
  async (req, res) => {
    try {
      const amount = req.body.amount;
      const cardDetail = await CardDetail.findOne({
        holder: req.params.id,
      });

      if (!cardDetail) {
        return res.status(404).send();
      }

      cardDetail.balanceAmount = parseInt(cardDetail.balanceAmount) - amount;
      await cardDetail.save();
      res.send(cardDetail);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.patch(
  '/addAmount/:id',
  [auth.authUser, auth.isManager],
  async (req, res) => {
    try {
      const amount = req.body.amount;
      const cardDetail = await CardDetail.findOne({
        holder: req.params.id,
      });

      if (!cardDetail) {
        return res.status(404).send();
      }

      cardDetail.balanceAmount = parseInt(cardDetail.balanceAmount) + amount;
      await cardDetail.save();
      res.send(cardDetail);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

module.exports = router;
