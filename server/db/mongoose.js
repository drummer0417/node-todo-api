var mongoose = require('mongoose');

var host = 'localhost';
var port = '27017';

// tell mongoose to use the nodejs build in promise (instead of some third party knaap)
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose: mongoose
};

// or just  module.exports = {mongoose};
