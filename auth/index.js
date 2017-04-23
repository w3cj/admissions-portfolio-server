const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const Strategy = require('./google');
const { getTokenFromHeader, verifyJWT } = require('./utils');
const { User } = require('../models');

passport.serializeUser((user, done) => {
  console.log('serializing user', user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('deserializing user', user);
  done(null, user);
});

passport.use(Strategy);

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Admissions Portfolio Auth',
  });
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
(req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) {
      return res.redirect(`${process.env.CLIENT_URL}error?error=${err}`);
    }

    return jwt.sign(user, user.update_token, {},
      (signError, token) => {
        if (signError) return next(signError);
        return res.redirect(process.env.CLIENT_URL + token);
      });
  })(req, res, next);
});

router.post('/exchange', (req, res, next) => {
  const exchangeToken = getTokenFromHeader(req);
  if (exchangeToken && exchangeToken.split('.').length === 3) {
    try {
      const encodedUser = exchangeToken.split('.')[1];
      const decodedUser = new Buffer(encodedUser, 'base64').toString('ascii');
      const tokenUser = JSON.parse(decodedUser);
      console.log('token user', tokenUser);

      User
        .findOne(tokenUser.google_id)
        .then((user) => {
          console.log('db user', tokenUser);
          if (user) {
            verifyJWT(exchangeToken, user.update_token)
            .then(() => User
                .findOrCreateSetToken(user)
                .then((updatedUser) => {
                  jwt.sign(updatedUser, process.env.TOKEN_SECRET, {},
                    (signError, token) => {
                      if (signError) return next(signError);
                      return res.json({
                        token,
                      });
                    });
                })).catch(error => next(error));
          } else {
            next(new Error('Invalid token'));
          }
        });
    } catch (e) {
      next(new Error('Invalid token'));
    }
  } else {
    next(new Error('Invalid token'));
  }
});

module.exports = router;
