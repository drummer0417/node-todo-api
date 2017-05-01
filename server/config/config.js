var env = process.env.NODE_ENV || 'development';
var httpPort = process.env.PORT || 3000;
var mongoPort = '27017';

if (env === 'development') {
  process.env.MONGODB_URI = `mongodb://localhost:${mongoPort}/TodoApp`
} else if (env === 'test') {
  process.env.MONGODB_URI = `mongodb://localhost:${mongoPort}/TodoAppTest`
}
console.log(
  `*****************\nenv: ${env}\nMONGODB_URI: ${process.env.MONGODB_URI}\n*****************`
);

module.exports = { httpPort };
