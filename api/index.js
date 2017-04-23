const express = require('express');

const applicant = require('./applicant');
const portfolio = require('./portfolio');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Admissions Portfolio API V1',
  });
});

router.use('/applicant', applicant);
router.use('/portfolio', portfolio);

module.exports = router;
