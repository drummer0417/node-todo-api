const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{value} is not a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function() {
  return _.pick(this, ['email', '_id']);
}

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ '_id': user._id, access }, "secretPassPhrase");

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  });
};

UserSchema.statics.findByToken = function(token) {
  var User = this;

  try {
    var decoded = jwt.verify(token, "secretPassPhrase");

    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': decoded.access
    })
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   return reject('Authentication failed');
    // });
    // Below line does the same as 3 lines of code below
    return Promise.reject('Authentication failed');
  }
}

UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        })
      })
    })
    .catch((error) => {
      return Promise.reject();
      // retrun Promise.reject();
    })
}
//
// runs before saving the user
//
UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
})
var User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
