var express = require("express");
var router = express.Router();
var Provider = require("../models/Provider");

/* GET providers listing. */
router.get("/", async function(req, res, next) {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (err) {
    res.json({ message: err });
  }
});

/* GET provider. */
router.get("/:id", async function(req, res, next) {
  try {
    const provider = await Provider.findById(req.params.id);
    res.json(provider);
  } catch (err) {
    res.json({ message: err });
  }
});


/* POST new Provider. */
router.post("/", async function(req, res, next) {
  const provider = new Provider({
    name: req.body.name,
    specialty: req.body.specialty,
    description: req.body.description
  });
  try {
    const savedProvider = await provider.save();
    res.json(savedProvider);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
