var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login', { title: 'Login' });
});

router.put('/', function(req, res) {
  console.log(req.body.password);
});

module.exports = router;