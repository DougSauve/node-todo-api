const {User} = require('../models/user')

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) return Promise.reject(); //this sends us straight to the catch block.

    req.user = user;
    req.token = token;
    next();

  }).catch((e) => res.status(401).send());
};

module.exports.authenticate = authenticate;
