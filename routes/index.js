var express = require("express");
var router = express.Router();

/* GET home page with Verify Token by JWT */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "MedShare's Server ExpressJS"
  });
});

module.exports = router;
