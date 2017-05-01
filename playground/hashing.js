const { SHA256 } = require('crypto-js');

// var message = "My name is Hans van Meurs";
// var hash = SHA256(message);
//
// console.log(`message: ${message}\nhash: ${hash}`);

var data = {
  id: 4
}

var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'someSecretDataString').toString()
}

console.log(`token: ${JSON.stringify(token, undefined, 2)}`);
