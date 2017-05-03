var { User } = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
      if (!user) {
        return Promise.reject('User not found') // processing stops and end up in .catch
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch((error) => {
      res.status(401).send(error);
    })
};

module.exports = { authenticate };
