const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
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

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, "secretPassPhrase");

    console.log(`decoded: ${JSON.stringify(decoded, undefined, 2)}`);
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': decoded.access
    })
  } catch (e) {

  } finally {

  }
}

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
