const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123!';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     hashedPw = hash;
//     console.log(`hash: ${hash}`)
//
//   })
// })
var hashedpw = '$2a$10$Pgx4drIqN6wcQC/SZ1CXoeD12PqN.kmpludpvdHbARYOVWVZlFNeC'

bcrypt.compare(password, hashedpw, (err, res) => {
  console.log(`hash equals password is ${res}`);
})

// var data = {
//   id: 35
// }
//
// var token = jwt.sign(data, "key123");
// var decodedToken = jwt.verify(token, "key123");
//
// console.log(
//   `data  : ${JSON.stringify(data, undefined, 2)}\ndecoded: ${JSON.stringify(decodedToken, undefined, 2)}\nToken: ${token}`
// );

// var message = "My name is Hans van Meurs";
// var hash = SHA256(message);
//
// console.log(`message: ${message}\nhash: ${hash}`);

// var data = {
//   id: 5
// }
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'someSecretDataString').toString()
// }
// resultHash = SHA256(JSON.stringify(data) + 'iDontKnowTheSecretString').toString();
//
// if (token.hash === resultHash) {
//   console.log('data was not changed');
// } else {
//   console.log('data was changed. Don\'t trust');
//   console.log(`origHash  : ${token.hash}\nresultHash: ${resultHash}`);;
// }
