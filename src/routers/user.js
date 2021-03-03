const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/users", [auth.authUser, auth.isAdmin], async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/logout", [auth.authUser], async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", [auth.authUser], async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", [auth.authUser], async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", [auth.authUser], async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "email",
    "password",
    "dateOfBirth",
    "mobileNumber",
    "gender",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", [auth.authUser, auth.isAdmin], async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.userId,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

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
  "/users/me/profilePicture",
  auth.authUser,
  upload.single("profilePicture"),
  async (req, res) => {
    req.user.profilePicture = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/profilePicture", auth.authUser, async (req, res) => {
  req.user.profilePicture = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/profilePicture", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.profilePicture) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.profilePicture);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
