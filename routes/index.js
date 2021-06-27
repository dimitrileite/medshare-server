var express = require("express");
var router = express.Router();
var verify = require('../validations/verifyToken');

/* GET home page with Verify Token by JWT */
router.get("/", verify, function(req, res, next) {
/*   res.render("index", {
    title: "MedShare's Server ExpressJS"    
  }); */
  res.send(req.user);
});

module.exports = router;
