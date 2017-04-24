var mongoose = require('mongoose');

var port = '27017';
var host = 'localhost';

// tell mongoose to use the nodejs build in promise (instead of some third party knaap)
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${host}:${port}/TodoApp`);

// create mongoose mode
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    }
})

// var newTodo = new Todo({
//     text: "Some other todo"
// });
//
// newTodo.save().then((doc) => {
//     console.log(`todo saved:\n${JSON.stringify(doc, undefined, 2)}`);
// }, (err) => {
//     console.log(`error saving document:\n${JSON.stringify(newTodo, undefined, 2)}\n${err}`);
// })

var user = new User({
    email: 'joris van den broek'
})
user.save().then((doc) => {
    console.log(`new user added:\n${JSON.stringify(doc, undefined, 2)}`);
}, (error) => {
    console.log(`error adding new user:\n${JSON.stringify(user, undefined, 2)}\nError: ${error}`);
})
