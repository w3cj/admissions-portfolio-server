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
    return this.applicants.find({ archived: { $ne: true } });
  }
  getAllArchived() {
    return this.applicants.find({ archived: { $eq: true } })
  }
  getOne(id) {
    return this.applicants.findOne({
      _id: monk.id(id),
    });
  }
  create(applicant) {
    return verifyInsert(this.applicants, applicant, schema);
  }
  archive(id) {
    return this.applicants.findOneAndUpdate({
      _id: monk.id(id),
    }, {
      $set: {
        archived: true,
      },
    });
  }
}

module.exports = Applicant;
