const express = require('express')
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const jwt = require('jsonwebtoken');


const { httpPort } = require('./config/config');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');
const { authenticate, verifyPassWord } = require('./middleware/authenticate');
const { mongoose } = require('./db/mongoose');

var app = express();

app.use(bodyParser.json());

//
// Add a new todo
//
app.post('/todos', authenticate, (req, res) => {

  var todo = new Todo({
    'text': req.body.text,
    '_creator': req.user._id
  });

  todo.save().then((doc) => {
    // console.log(JSON.stringify(todo, undefined, 2));
    res.send(doc);
  }, (error) => {
    // console.log(`Error saving document: \n${error}`);
    res.status(400).send(error)
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ '_creator': req.user._id })
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

app.get('/todos/:id', authenticate, (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid id stecified");
  }

  Todo.findOne({ '_id': id, '_creator': req.user._id }).then((todo) => {
    if(todo) {
      // res.send(`User: ${JSON.stringify(user, undefined, 2)}`);
      res.send({ todo });
    } else {
      res.status(404).send('Todo not found!');
    }
  }, (error) => {
    res.status(400).send(`Todo not found!, Error!\n${error}`);
  });

});

app.delete('/todos/:id', authenticate, (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    // console.log(`Invalid id: "${id}"`);
    return res.status(404).send('invalid id');
  }
  Todo.findOneAndRemove({ '_id': id, '_creator': req.user._id })
    .then((todo) => {
      if(todo) {

        res.send({ todo });
      } else {
        console.log('not found');
        res.status(404).send('Todo not found');
      }
    }, (error) => {
      res.status(400).send(error);
    })
    .catch((error) => {
      res.status(400).send(`Error: \n${error}`);
    })
})

app.patch('/todos/:id', authenticate, (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  var body = _.pick(req.body, ['completed', 'text']);

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findOneAndUpdate({ '_id': id, '_creator': req.user._id }, { $set: body }, { new: true })
    .then((todo) => {
      if(todo) {
        res.send({ todo });
      } else {
        res.status(404).send('Todo not found...');
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.post('/users', (req, res) => {

  var body = _.pick(req.body, ['email', 'password']);

  var user = new User(body);
  user.save().then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header({ 'x-auth': token }).send({ user });
    })
    .catch((error) => {
      // console.log('*****************************', error);
      res.status(400).send(error);
    })
});

//
// login user with email and password
//
app.post('/users/login', (req, res) => {

  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header({ 'x-auth': token }).send({ user });
      })
    })
    .catch(() => {
      res.status(401).send(`login failed`);
    })
})

//
// Get the authenticated user
//
app.get('/users/me', authenticate, (req, res) => {
  res
    .send(req.user);

});

//
// Logoff users
//
app.delete('/users/me/token', authenticate, (req, resp) => {
  // console.log(JSON.stringify(req.user));
  req.user.removeToken(req.token)
    .then(() => {
      resp.send();
    })
    .catch(() => {
      resp(401);
    });
})

// })


// app.get('/users/:id', (req, res) => {
//
//   var id = req.params.id;
//
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send("Invalid id stecified");
//   }
//
//   User.findById(id).then((user) => {
//     if (user) {
//       // res.send(`User: ${JSON.stringify(user, undefined, 2)}`);
//       res.send({ user });
//     } else {
//       res.status(404).send('User not found!');
//     }
//   }, (error) => {
//     res.status(400).send(`User not found!, Error!\n${error}`);
//   });
//
// });


app.listen(httpPort, () => {
  console.log(`Server started on port ${httpPort}`);
})

module.exports = { app };
