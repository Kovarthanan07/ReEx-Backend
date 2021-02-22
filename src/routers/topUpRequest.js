const express = require("express");
const auth = require("../middleware/auth");
const TopUpRequest = require("../models/topUpRequest");
const router = new express.Router();

router.post(
  "/topUpRequest",
  [auth.authUser, auth.isEmployee],
  async (req, res) => {
    const topUpRequest = new TopUpRequest({
      ...req.body,
      requestBy: req.user._id,
    });

    try {
      await topUpRequest.save();
      res.status(201).send(topUpRequest);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.patch(
  "/topUpRequest/:id",
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
      const topUpRequest = await TopUpRequest.findOne({
        _id: req.params.id,
        requestTo: req.user._id,
      });

      if (!topUpRequest) {
        return res.status(404).send();
      }

      updates.forEach((update) => (topUpRequest[update] = req.body[update]));
      await topUpRequest.save();
      res.send(topUpRequest);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get(
  "/topUpRequestSended",
  [auth.authUser, auth.isEmployee],
  async (req, res) => {
    try {
      await req.user.populate("topUpRequestSended").execPopulate();
      res.send(req.user.topUpRequestSended);
    } catch (e) {
      res.status(500).send();
    }
  }
);

router.get(
  "/topUpRequestReceived",
  [auth.authUser, auth.isManager],
  async (req, res) => {
    try {
      await req.user.populate("topUpRequestReceived").execPopulate();
      res.send(req.user.topUpRequestReceived);
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
