var express = require("express");
var router = express.Router();
var { ethers } = require("ethers");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var verify = require('../validations/verifyToken');

var User = require("../models/User");

var { registerValidation } = require("../validations/register");
var { loginValidation } = require("../validations/login");

//*****DO THE FOLLOWING AFTER CREATING THE ACCOUNT*********** */
//Store the info (address,privateKey, address2, privateKey2) for the accounts  in your .env file
//Add test network (rinkeby) value to account1 at https://faucet.rinkeby.io/
//*********************************************************** */



const network = "rinkeby";

const provider = new ethers.providers.InfuraProvider(network, {
  projectId: process.env.projectId,
  projectSecret: process.env.projectSecret
});

/* GET new Account Public Key */
router.get("/", function (req, res, next) {
  try {
    const rawAccount = ethers.Wallet.createRandom();
    const account = { address: rawAccount.address, privateKey: rawAccount.privateKey };
    res.json(account);
  } catch (err) {
    res.json({ message: err });
  }
});

/* GET User info */
router.get("/:id", verify, async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

/* GET Account Balance: It gives rawBalance in Hex and formatted balance in Ether */
router.get("/balance/:address", async function (req, res, next) {
  try {
    const rawBalance = await provider.getBalance(req.params.address);
    const balance = ethers.utils.formatEther(rawBalance);
    const result = { balance: rawBalance, balanceInEther: balance };
    res.json(result);
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

  const rawAccount = ethers.Wallet.createRandom();  
  const keystore = await rawAccount.encrypt(req.body.password);

  // Quicker less secure
  /* const keystore = rawAccount.encrypt(password, {
    scrypt: {
      // The number must be a power of 2 (default: 131072)
      N: 64
    }, progressCallback
  }); */

  const user = new User({
    /* flbpepgk */
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    birthdate: req.body.birthdate,
    phone: req.body.phone,
    email: req.body.email,
    password: hashedPassword,
    gender: req.body.gender,
    keystore: keystore
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser._id);
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
  //res.json(user._id);
  
});

/* UPDATE user */
router.patch("/:id", verify, async function (req, res, next) {
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

/* DELETE provider. */
router.delete("/:id", async function (req, res, next) {
  try {
    const removedProvider = await Provider.remove({ _id: req.params.id });
    res.json(removedProvider);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
