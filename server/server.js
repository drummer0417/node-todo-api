const express = require('express')
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

  var todo = new Todo({
    'text': req.body.text,
    'completed': req.body.completed,
    'completed': req.body.completed
  });

  todo.save().then((doc) => {
    // console.log(JSON.stringify(todo, undefined, 2));
    res.send(doc);
  }, (error) => {
    // console.log(`Error saving document: \n${error}`);
    res.status(400).send(error)
  });
});

app.get('/todos', (req, res) => {
  Todo.find({})
    .then((todos) => {
      // console.log(`Todo\'s: ${JSON.stringify(todos, undefined, 2)}`);
      res.send({
        todos
      });
    }, (error) => {
      console.log(`Error getting ToDo\'s\n${error}`);
      res.send('Unable to get ToDo\'s')
    })
    .catch((error) => {
      console.log(`Catching error getting ToDo\'s\n${error}`);
      res.send('Unable to get ToDo\'s')
    });
})

app.get('/todos/:id', (req, res) => {

  var id = req.params.id;
  // console.log(`**************** params:\n${JSON.stringify(id, undefined, 2)}`);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid id stecified");
  }
  User.findById(id).then((user) => {
    if(user) {
      // res.send(`User: ${JSON.stringify(user, undefined, 2)}`);
      res.send({ user });
    } else {
      res.status(404).send('User not found!');
    }
  }, (error) => {
    res.status(400).send(`User not found!, Error!\n${error}`);
  });

});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

module.exports = { app };
