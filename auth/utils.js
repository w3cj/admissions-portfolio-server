const jwt = require('jsonwebtoken');

require('dotenv').config();

function getTokenFromHeader(req) {
  const token = req.get('Authorization');
  if (token) {
    const tokenSplit = token.split(' ');
    return tokenSplit.length > 0 ? tokenSplit[1] : tokenSplit[0];
  } return false;
}

function verifyJWT(token, tokenSecret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, tokenSecret || process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
}

function checkTokenSetUser(req, res, next) {
  const token = getTokenFromHeader(req);

  if (token) {
    verifyJWT(token)
      .then((user) => {
        req.user = user;
        next();
      }).catch(() => next());
  } else {
    next();
  }
}

function loggedIn(req, res, next) {
  if (req.user) next();
  else {
    res.status(401);
    res.json({ message: 'UnAuthorized' });
  }
}

module.exports = {
  verifyJWT,
  loggedIn,
  checkTokenSetUser,
  getTokenFromHeader,
};
