const Joi = require('joi');

function verifyInsert(collection, data, schema) {
  const result = Joi.validate(data, schema);
  if (result.error) {
    return Promise.reject(result.error);
  }
  return collection.insert(data);
}

module.exports = {
  verifyInsert,
};
