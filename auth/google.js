const GoogleStrategy = require('passport-google-oauth2').Strategy;

require('dotenv').config();

const { User } = require('../models');

const Strategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, cb) => {
  console.log(profile);
  if (profile.email && profile.email.match(/@galvanize.com/g)) {
    User.findOrCreateSetToken({
      google_id: profile.id,
      email: profile.email,
      display_name: profile.displayName,
    }).then((user) => {
      cb(null, user);
    }).catch((error) => {
      cb(error);
    });
  } else {
    cb(new Error('You must be a member of the Galvanize Organization.'));
  }
});

module.exports = Strategy;
