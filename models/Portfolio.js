const Joi = require('joi');
const uuidV4 = require('uuid/v4');

const { verifyInsert } = require('./utils');

const schema = Joi.object().keys({
  applicant_id: Joi.string().required(),
  portfolio_id: Joi.string().required(),
  standards: Joi.object().required(),
  created: Joi.date().required(),
});

/* eslint-disable camelcase */
class Portfolio {
  constructor(db) {
    this.portfolios = db.get('portfolios');
    this.portfolios.index('applicant_id');
    this.portfolios.index('portfolio_id', { unique: true });
  }
  getAll() {
    return this.portfolios.find({});
  }
  getOne(portfolio_id) {
    return this.portfolios.findOne({
      portfolio_id,
    });
  }
  create(portfolio) {
    /* eslint-disable */
    portfolio.created = new Date();
    portfolio.portfolio_id = uuidV4();
    portfolio.standards = [0, 1, 2].reduce((standards, standard_id) => {
      standards[standard_id] = {
        standard_id,
        url: '',
        details: '',
        begin: false,
        submitted: false,
        option: -1,
        start_date: null,
        submit_date: null,
        update_date: null,
      };
      return standards;
    }, {});
    /* eslint-enable */
    return verifyInsert(this.portfolios, portfolio, schema);
  }
  startStandard(portfolio_id, standard_id, option) {
    return this.portfolios.update({
      portfolio_id,
    }, {
      $set: {
        update_date: new Date(),
        [`standards.${standard_id}.begin`]: true,
        [`standards.${standard_id}.option`]: Number(option),
        [`standards.${standard_id}.start_date`]: new Date(),
        [`standards.${standard_id}.update_date`]: new Date(),
      },
    });
  }
  saveStandard(portfolio_id, standard_id, submission) {
    return this.portfolios.update({
      portfolio_id,
    }, {
      $set: {
        update_date: new Date(),
        [`standards.${standard_id}.url`]: submission.url,
        [`standards.${standard_id}.details`]: submission.details,
        [`standards.${standard_id}.option`]: Number(submission.option),
        [`standards.${standard_id}.update_date`]: new Date(),
      },
    });
  }
  submitStandard(portfolio_id, standard_id, submission) {
    return this.portfolios.update({
      portfolio_id,
    }, {
      $set: {
        update_date: new Date(),
        [`standards.${standard_id}.url`]: submission.url,
        [`standards.${standard_id}.details`]: submission.details,
        [`standards.${standard_id}.option`]: Number(submission.option),
        [`standards.${standard_id}.submitted`]: true,
        [`standards.${standard_id}.submit_date`]: new Date(),
        [`standards.${standard_id}.update_date`]: new Date(),
      },
    });
  }
  updateStandardStatus(portfolio_id, standard_id, status_id) {
    const $set = {
      [`standards.${standard_id}.status_id`]: status_id,
      [`standards.${standard_id}.status_date`]: new Date(),
    };

    if (status_id == 0) {
      $set[`standards.${standard_id}.submitted`] = false;
      $set[`standards.${standard_id}.submit_date`] = null;
    }

    return this.portfolios.update({
      portfolio_id,
    }, {
      $set,
    });
  }
}

module.exports = Portfolio;
