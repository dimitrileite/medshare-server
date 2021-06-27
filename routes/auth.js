var express = require("express");
var router = express.Router();
var User = require("../models/User");
var bcrypt = require("bcryptjs");
var { registerValidation } = require("../validations/register");
var { loginValidation } = require("../validations/login");
var jwt = require('jsonwebtoken');

/* POST Register new User */
router.post("/register", async function (req, res, next) {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

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
    balance: req.body.balance
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

module.exports = router;
