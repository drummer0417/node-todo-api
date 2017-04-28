const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

var todoId = "58ffb30df8cc6d2e38e78db2";
var userId = '59019d0e41bf3f252c5dbabd';

// Todo.find({ '_id': todoId }).then((todo) => {
//   console.log('\nTodos:', todo);
// });
//
//
// var text = "My very first ToDo 2";
//
// Todo.findOne({ text: text }).then((todo) => {
//   console.log(`\nTodo find by text: ${ todo }`);
// });

if(ObjectID.isValid(todoId)) {
  Todo.findById(todoId)
    .then((todo) => {
      if(!todo) {
        return console.log('Id not found!');
      }
      console.log(`\nTodo findById: \n${ todo }`);
    })
    .catch((error) => {
      console.log(error);
    })
} else {
  console.log('Id is invalid', id);
}



if(!ObjectID.isValid(userId)) {
  console.log('Invalid userId!!!!!!!!!!!!!');
}

User.findById(userId).
then((user) => {
    console.log(`User: ${user}`);
  })
  .catch((error) => {
    console.log(error);
  })
