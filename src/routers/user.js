const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/users', [auth.authUser, auth.isAdmin], async (req, res) => {
  const user = new User(req.body);
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

router.get('/getallusers', [auth.authUser], async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
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

// const upload = multer({
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error('Please upload an image'));
//     }

//     cb(undefined, true);
//   },
// });

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
    // res.set('Content-Type', 'image/jpg');
    res.send(user.profilePictureUrl);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
