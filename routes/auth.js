var express = require("express");
var router = express.Router();
var User = require("../models/User");
var bcrypt = require("bcryptjs");
var { registerValidation } = require('../validations/register')

/* POST Register new User */
router.post("/register", async function (req, res, next) {

  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send('Email already exists');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    address: req.body.address,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    birthdate: req.body.birthdate,
    phone: req.body.phone,
    email: req.body.email,
    password: hashedPassword,
    publickey: req.body.publickey,
    privatekey: req.body.privatekey,
    balance: req.body.balance,
  });
  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

/* POST Login User */
router.post("/login", async function (req, res, next) {
  const user = new User({
    address: req.body.address,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    birthdate: req.body.birthdate,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    publickey: req.body.publickey,
    privatekey: req.body.privatekey,
    balance: req.body.balance,
  });
  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
