const express = require('express');
const { Portfolio } = require('../models');
const authUtils = require('../auth/utils');

const router = express.Router();

router.get('/', authUtils.loggedIn, (req, res, next) => {
  Portfolio
    .getAll()
    .then(portfolios => res.json(portfolios))
    .catch(next);
});

router.get('/:portfolio_id', (req, res, next) => {
  Portfolio
    .getOne(req.params.portfolio_id)
    .then(portfolio => res.json(portfolio))
    .catch(next);
});

router.post('/:applicant_id', authUtils.loggedIn, (req, res, next) => {
  req.body.applicant_id = req.params.applicant_id;

  Portfolio
    .create(req.body)
    .then(portfolio => res.json(portfolio))
    .catch(next);
});

router.post('/:portfolio_id/standard/:standard_id/:option/start', (req, res, next) => {
  Portfolio
    .startStandard(req.params.portfolio_id, req.params.standard_id, req.params.option)
    .then(portfolio => res.json(portfolio))
    .catch(next);
});

router.post('/:portfolio_id/standard/:standard_id/save', (req, res, next) => {
  Portfolio
    .saveStandard(
      req.params.portfolio_id,
      req.params.standard_id,
      req.body)
    .then(portfolio => res.json(portfolio))
    .catch(next);
});

router.post('/:portfolio_id/standard/:standard_id/submit', (req, res, next) => {
  Portfolio
    .submitStandard(
      req.params.portfolio_id,
      req.params.standard_id,
      req.body)
    .then(portfolio => res.json(portfolio))
    .catch(next);
});

module.exports = router;
