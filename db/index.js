const url = process.env.MONGO_URI || 'localhost/admissions-portfolio';
const db = require('monk')(url);

module.exports = db;
