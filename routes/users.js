var express = require("express");
var router = express.Router();
var User = require("../models/User");
var bcrypt = require("bcryptjs");
var { registerValidation } = require("../validations/register");
var { loginValidation } = require("../validations/login");
var jwt = require('jsonwebtoken');


/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

/* GET family users */
router.get('/family/:lastname', async function (req, res, next) {

  try {
    const familyUsers = await User.find({ lastname: { $regex: req.params.lastname, $options: 'i' } }).limit(5)
      .catch(next);
    res.json(familyUsers);
  } catch (err) {
    res.json({ message: err });
  }
});

/* GET user by address */
router.get('/address/:address', async function (req, res, next) {
  var address = req.params.address;
  try {
    const user = await User.findOne({ address: address }).exec();
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

/* GET user */
router.get("/:id", async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

/* POST Register new User */
router.post("/register", async function (req, res, next) {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    /* flbpepgk */
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    birthdate: req.body.birthdate,
    phone: req.body.phone,
    email: req.body.email,
    password: hashedPassword,
    gender: req.body.gender,
    keystore: req.body.keystore
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

/* POST Login User */
router.post("/login", async (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  var user = await User.findOne({ email: req.body.email });
  if (!user) {
    user = await User.findOne({ phone: req.body.phone });
  }
  if (!user) return res.status(400).send("Data provided was not found on our database.");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send("Password is invalid. You have 2 more trials.");

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);

});

/* UPDATE user */
router.patch("/:id", async function (req, res, next) {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          birthdate: req.body.birthdate,
          phone: req.body.phone,
          email: req.body.email,
          password: hashedPassword,
          gender: req.body.gender,
          keystore: req.body.keystore
        }
      }
    );
    res.json(updatedUser);
  } catch (err) {
    res.json({ message: err });
  }
});


/* DELETE user. */
router.delete("/:id", async function (req, res, next) {
  try {
    const removedUser = await User.remove({ _id: req.params.id });
    res.json(removedUser);
  } catch (err) {
    res.json({ message: err });
  }
});


module.exports = router;
