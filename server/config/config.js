var env = process.env.NODE_ENV || 'development';
var httpPort = process.env.PORT || 3000;
var mongoPort = '27017';

if(env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
    console.log(`property:  ${key}: ${envConfig[key]}`);
  })

}

// if(env === 'development') {
//   process.env.MONGODB_URI = `
//           mongodb: //localhost:${mongoPort}/TodoApp`
// } else if(env === 'test') {
//   process.env.MONGODB_URI = `mongodb://localhost:${mongoPort}/TodoAppTest`
// }
console.log('\n*****************************************************');
console.log(`env: ${env}\nMONGODB_URI: ${process.env.MONGODB_URI}`);
console.log('*****************************************************');

module.exports = { httpPort };
