const Joi = require('joi');
const monk = require('monk');

const { verifyInsert } = require('./utils');

const schema = Joi.object().keys({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
});

class Applicant {
  constructor(db) {
    this.applicants = db.get('applicants');
    this.applicants.index('email', { unique: true });
  }
  getAll() {
    return this.applicants.find({});
  }
  getOne(id) {
    return this.applicants.findOne({
      _id: monk.id(id),
    });
  }
  create(applicant) {
    return verifyInsert(this.applicants, applicant, schema);
  }
}

module.exports = Applicant;
