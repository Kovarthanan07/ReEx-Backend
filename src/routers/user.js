const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const CardDetail = require('../models/cardDetail');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/users', [auth.authUser, auth.isAdmin], async (req, res) => {
  const user = new User(req.body);
  console.log(user.role);
  if (user.role === 'employee') {
    const cardDetail = new CardDetail({
      holder: user._id,
    });
    await cardDetail.save();
  }
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/logout', [auth.authUser], async (req, res) => {
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

router.post('/users/logoutAll', [auth.authUser], async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/users/me', [auth.authUser], async (req, res) => {
  res.send(req.user);
});

router.get('/getallemployee', [auth.authUser], async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });
    res.send(employees);
  } catch (error) {
    res.status(400).send();
  }
});

router.get('/getallmanager', [auth.authUser], async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' });
    res.send(managers);
  } catch (error) {
    res.status(400).send();
  }
});

router.get('/getalladmin', [auth.authUser], async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.send(admins);
  } catch (error) {
    res.status(400).send();
  }
});

router.get(
  '/user/:userId',
  [auth.authUser, auth.isAdminOrManager],
  async (req, res) => {
    try {
      const user = await User.find({ userId: req.params.userId });
      res.send(user);
    } catch (error) {
      res.status(400).send();
    }
  }
);

router.get('/getallusers', [auth.authUser], async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (error) {
    res.status(400).send();
  }
});

router.patch('/users/me', [auth.authUser], async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'name',
    'email',
    'password',
    'dateOfBirth',
    'mobileNumber',
    'gender',
    'profilePictureUrl',
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/me', [auth.authUser, auth.isAdmin], async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete('/users/:id', [auth.authUser, auth.isAdmin], async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
    });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/login', async (req, res) => {
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

router.post(
  '/users/me/profilePicture',
  auth.authUser,
  async (req, res) => {
    req.user.profilePictureUrl = req.body.profilePictureUrl;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete('/users/me/profilePicture', auth.authUser, async (req, res) => {
  req.user.profilePictureUrl = undefined;
  await req.user.save();
  res.send();
});

router.get('/users/:id/profilePicture', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.profilePictureUrl) {
      throw new Error();
    }
    res.send(user.profilePictureUrl);
  } catch (error) {
    res.status(400).send();
  }
});

router.patch(
  '/userUpdate/:id',
  [auth.authUser, auth.isAdmin],
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['role', 'userId', 'password'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
      const user = await User.findOne({
        _id: req.params.id,
      });

      if (!user) {
        return res.status(404).send();
      }

      updates.forEach((update) => (user[update] = req.body[update]));
      await user.save();
      res.send(user);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

module.exports = router;
