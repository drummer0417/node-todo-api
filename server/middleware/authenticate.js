const bcrypt = require('bcryptjs')

const { User } = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
      if (!user) {
        return Promise.reject('User not found') // processing stops and end up in .catch
      }
      // if user with given token found... add user and token to req and continue by calling next
      req.user = user;
      req.token = token;
      next();
    })
    .catch((error) => {
      res.status(401).send(error);
    })
};

module.exports = { authenticate };
