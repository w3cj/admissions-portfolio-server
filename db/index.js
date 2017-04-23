const url = process.env.MONGODB_URI || 'localhost/admissions-portfolio';
const db = require('monk')(url);

module.exports = db;
