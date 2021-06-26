var express = require("express");
var router = express.Router();
var User = require("../models/User");


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
router.get('/family/:lastname', async function(req, res, next){
  var lastname = req.params.lastname;
  try {
    const familyUsers = await User.find({ lastname: lastname}).exec();    
    res.json(familyUsers);
  } catch (err) {
    res.json({ message: err });
  }
});

/* GET user by address */
router.get('/address/:address', async function(req, res, next){
  var address = req.params.address;
  try {
    const user = await User.findOne({ address: address}).exec();    
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

/* POST new User */
router.post("/register", async function (req, res, next) {
  const user = new User({
    address : req.body.address,
    firstname : req.body.firstname, 
    lastname : req.body.lastname,
    birthdate : req.body.birthdate,
    phone : req.body.phone,
    email : req.body.email,
    password : req.body.password,
    publickey : req.body.publickey,
    privatekey : req.body.privatekey,
    balance : req.body.balance,    
  });
  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});


/* UPDATE user */
router.patch("/update/:id", async function(req, res, next) {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          address: req.body.address,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          birthdate: req.body.birthdate,
          phone: req.body.phone,
          email: req.body.email,
          password: req.body.password,
          publickey: req.body.publickey,
          privatekey: req.body.privatekey,
          balance: req.body.balance
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
