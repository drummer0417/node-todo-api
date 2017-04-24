var express = require('express0');
var bodyParser = require('body-parser');

var {
    mongoose
} = require('./db/mongoose');
var User = require('./db/User');
var Todo = require('./db/Todo');

var port = process.env.PORT || 3000;


var app = express();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
