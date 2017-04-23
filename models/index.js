const db = require('../db');
const Applicant = require('./Applicant');
const Portfolio = require('./Portfolio');
const User = require('./User');

module.exports = {
  Applicant: new Applicant(db),
  Portfolio: new Portfolio(db),
  User: new User(db),
};
