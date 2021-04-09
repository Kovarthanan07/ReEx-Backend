const express = require('express');
const auth = require('../middleware/auth');
const Reports = require('../models/report');
const router = new express.Router();

router.post('/report', [auth.authUser], async (req, res) => {
  const reports = new Reports({
    ...req.body,
    sender: req.user._id,
  });

  try {
    await reports.save();
    res.status(201).send(reports);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/report/:id', [auth.authUser], async (req, res) => {
  try {
    const report = await Reports.findOne({
      _id: req.params.id,
    });

    if (!report) {
      return res.status(404).send();
    }

    report.replies = report.replies.concat(req.body);

    await report.save();
    res.send(report);
  } catch (e) {
    res.status(400).send(e);
  }

  try {
    await reports.save();
    res.status(201).send(reports);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/report/:id', [auth.authUser], async (req, res) => {
  try {
    const report = await Reports.findOneAndDelete({
      _id: req.params.id,
      sender: req.user._id,
    });

    if (!report) {
      res.status(404).send();
    }

    res.send(report);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/reportSender', [auth.authUser], async (req, res) => {
  try {
    await req.user.populate('reportsSender').execPopulate();
    res.send(req.user.reportsSender);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/reportReceiver', [auth.authUser], async (req, res) => {
  try {
    await req.user.populate('reportsReceiver').execPopulate();
    res.send(req.user.reportsReceiver);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
