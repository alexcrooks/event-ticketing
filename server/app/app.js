var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var config = require('./config');

/**
 * Initialize the database.
 */
app.use(require('./lib/database')(config.database));

/**
 * Set up CORS configuration.
 *
 * TODO: Make this secure, this currently has _no_ CORS restrictions.
 */
app.use(cors());

/**
 * Parse incoming requests as JSON.
 */
app.use(bodyParser.json({type: 'application/json'}));

/**
 * Fake user for use in API
 *
 * TODO (stub for future implementation)
 */
app.use(function (req, res, next) {
  req.user = {id: 1};
  next();
});

/**
 * On error, log it and return a suitable status code.
 */
app.use(function (err, req, res, next) {
  if (err) {
    logger.error(err);
    return res.sendStatus(err.statusCode || 500);
  }
  next();
});

/**
 * Routes
 */
app.use(require('./routes/base'));
app.use(require('./routes/event'));

process.on('SIGINT', function () {
  process.exit(0);
});

exports = module.exports = app;
