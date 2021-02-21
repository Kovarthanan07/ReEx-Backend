const express = require("express");
const auth = require("../middleware/auth");
const News = require("../models/news");
const router = new express.Router();

router.post("/news", [auth.authUser, auth.isAdmin], async (req, res) => {
  const news = new News({
    ...req.body,
    postedBy: req.user._id,
  });

  try {
    await news.save();
    res.status(201).send(news);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/news/:id", [auth.authUser, auth.isAdmin], async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "viewers",
    "title",
    "news",
    "startDisplayOn",
    "endDisplayOn",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const news = await News.findOne({
      _id: req.params.id,
      postedBy: req.user._id,
    });

    if (!news) {
      return res.status(404).send();
    }

    updates.forEach((update) => (news[update] = req.body[update]));
    await news.save();
    res.send(news);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/news/:id", [auth.authUser, auth.isAdmin], async (req, res) => {
  try {
    const news = await News.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user._id,
    });

    if (!news) {
      res.status(404).send();
    }

    res.send(news);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/news", [auth.authUser], async (req, res) => {
  try {
    const role = req.user.role;

    if (role === "manager") {
      const wholeNews = await News.find({
        viewers: { $in: ["manager"] },
      });
      res.send(wholeNews);
    }

    if (role === "employee") {
      const wholeNews = await News.find({
        viewers: { $in: ["employee"] },
      });
      res.send(wholeNews);
    }

    if (role === "admin") {
      const wholeNews = await News.find({
        viewers: { $in: ["admin"] },
      });
      res.send(wholeNews);
    }
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
