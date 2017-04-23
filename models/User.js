const Joi = require('joi');
const uuidV4 = require('uuid/v4');

const schema = Joi.object().keys({
  google_id: Joi.string().required(),
  display_name: Joi.string(),
  email: Joi.string().email().required(),
  update_token: Joi.string().required(),
});

/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
class User {
  constructor(db) {
    this.users = db.get('users');
    this.users.index('google_id', { unique: true });
    this.users.index('email', { unique: true });
  }
  findOrCreateSetToken(user) {
    delete user._id;
    user.update_token = uuidV4();
    const result = Joi.validate(user, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    return this.users.findOneAndUpdate({
      google_id: user.google_id,
    }, user, {
      upsert: true,
    });
  }
  findOne(google_id) {
    return this.users.findOne({
      google_id,
    });
  }
}

module.exports = User;
