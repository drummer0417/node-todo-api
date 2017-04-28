var mongoose = require('mongoose');

var port = '27017';
var host = 'localhost';

// tell mongoose to use the nodejs build in promise (instead of some third party knaap)
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || `mongodb://${host}:${port}/TodoApp`);

module.exports = {
  mongoose: mongoose
};

// or just  module.exports = {mongoose};
