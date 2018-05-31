var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;       //update user in request header
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();    // next() not called to stop process if auth failed.
  });
};

module.exports = {authenticate};
