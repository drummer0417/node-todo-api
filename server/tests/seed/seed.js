const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const userThreeID = new ObjectID();
const user4ID = new ObjectID();
const user5ID = new ObjectID();
const user6ID = new ObjectID();

const todosArray = [
  { _id: new ObjectID(), text: "The first todo u1", completed: false, _creator: userOneID },
  { _id: new ObjectID(), text: "The second todo u1", completed: false, _creator: userOneID },
  { _id: new ObjectID(), text: "The 3rd todo u2", completed: true, _creator: userTwoID },
  { _id: new ObjectID(), text: "The last todo u2", completed: true, _creator: userTwoID }
];


const usersArray = [{
  _id: userOneID,
  email: 'userOne@now.com',
  password: 'password!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneID, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoID,
  email: 'userTwo@now.com',
  password: 'password!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoID, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userThreeID,
  email: 'userThree@now.com',
  password: 'password!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userThreeID, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}, {
  email: 'user4@now.com',
  password: 'pasrd!'
}, {
  email: 'user5@now.com',
  password: 'password!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: user5ID, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: user6ID,
  email: 'user6@now.com',
  password: 'password!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: user6ID, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}]

// Add todos to DB
var populateTodos = ((done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todosArray);
    })
    .then(() => {
      done();
    });
});

// Add user 0 and 1 to DB, user 2 isn't
var populateUsers = ((done) => {

  User.remove({}).then(() => {
    var userOne = new User(usersArray[0]).save();
    var userTwo = new User(usersArray[1]).save();
    var userSix = new User(usersArray[5]).save();

    return Promise.all([userOne, userTwo, userSix]);

  }).then(() => done());
});

module.exports = { todosArray, usersArray, populateTodos, populateUsers }
