const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const auth = require('./auth');
const api = require('./api');
const authUtils = require('./auth/utils');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
app.use(authUtils.checkTokenSetUser);

app.get('/', (req, res) => {
  res.json({
    title: 'Admissions Portfolio API',
  });
});

app.use('/auth', auth);
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint-disable */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
    stack: req.app.get('env') === 'development' ? err.stack : {},
  });
});
/* eslint-enable */

module.exports = app;
