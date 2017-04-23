// const MongoClient = require('mongodb').MongoClient;
// the line below does the same as the one above, it uses 'destructuring'
//const {MongoClient} = require('mongodb')

// now you can easily get more vars from mongodb like so:
const {
    MongoClient,
    ObjectID
} = require('mongodb');

// // now create a new ObjectID
// var obj = new ObjectID();
// console.log('ObjectID: ', obj);

var port = '27017';
var host = 'localhost';

MongoClient.connect(`mongodb://${host}:${port}/TodoApp`, (err, db) => {
    if (err) {
        console.log('Error connecting to the MongoDB server!');
    } else {
        console.log('You are now connected');
        console.log('33333');
        //  find by _ID
        db.collection('Todos').find({
            _id: new ObjectID("58fc4b877cae1b23d0df6a0b")
        }).toArray().then((docs) => {
            console.log(`List of todos:\n${JSON.stringify(docs, undefined, 2)}`);
        }, (err) => {
            console.log('Error finding todos', err);
        })
        //

        // count # completed
        db.collection('Todos').find({
            completed: true
        }).count().then((count) => {
            console.log(`# completed todos: ${count}\n`)
            // console.log('\n\n');
        }, (err) => {
            console.log('Error finding todos', err);
        })
    }

    // find users with name Hans van Meurs
    db.collection('Users').find({
        name: "Hans van Meurs"
    }).toArray().then((docs) => {
        console.log(`List of all user with namee equals "Hans van Meurs": ${JSON.stringify(docs, undefined, 2)}`);
    }, (err) => {
        console.log('Error retrieving users with name "Hans van "');
    });









    db.close();
})
