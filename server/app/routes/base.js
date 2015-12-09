var express = require('express');
var router = express.Router();

/**
 * A basic ping endpoint for server health checks.
 */
router.get('/ping', function (req, res, next) {
  res.json({serverTime: new Date()});
});

module.exports = router;
