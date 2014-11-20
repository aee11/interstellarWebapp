var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Dreifð endurtekning', user: req.user });
});

module.exports = router;
