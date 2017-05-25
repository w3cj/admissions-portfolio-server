const express = require('express');
const { Applicant } = require('../models');
const authUtils = require('../auth/utils');

const router = express.Router();

router.get('/', authUtils.loggedIn, (req, res, next) => {
  Applicant
    .getAll()
    .then(applicants => res.json(applicants))
    .catch(next);
});

router.get('/archived', authUtils.loggedIn, (req, res, next) => {
  Applicant
    .getAllArchived()
    .then(applicants => res.json(applicants))
    .catch(next);
});

router.get('/:applicant_id', (req, res, next) => {
  Applicant
    .getOne(req.params.applicant_id)
    .then(applicant => res.json(applicant))
    .catch(next);
});

router.post('/:applicant_id/archive', (req, res, next) => {
  Applicant
    .archive(req.params.applicant_id)
    .then(result => res.json(result))
    .catch(next);
});

router.post('/', authUtils.loggedIn, (req, res, next) => {
  Applicant
    .create(req.body)
    .then(applicant => res.json(applicant))
    .catch(next);
});

module.exports = router;
