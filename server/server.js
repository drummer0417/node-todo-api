var express = require('express');
var bodyParser = require('body-parser');

var {
    mongoose
} = require('./db/mongoose');
var {
    User
} = require('./models/user');
var {
    Todo
} = require('./models/todo');

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

    var todo = new Todo({
        'text': req.body.text,
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
            console.log(`Todo\'s: ${JSON.stringify(todos, undefined, 2)}`);
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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

module.exports = {
    app
};
