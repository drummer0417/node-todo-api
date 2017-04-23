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

        // // delete many
        // db.collection('Todos').deleteMany({
        //     text: "Bier drinken"
        // }).then((result) => {
        //     console.log(`#deleted todos: ${JSON.stringify(result, undefined, 2)}\n`)
        //     // console.log('\n\n');
        // }, (err) => {
        //     console.log('Error finding todos', err);
        // })

        // // delete one
        // db.collection('Todos').deleteOne({
        //     text: "Bier drinken"
        // }).then((result) => {
        //     console.log(`#deleted todos: ${JSON.stringify(result, undefined, 2)}\n`)
        //     // console.log('\n\n');
        // }, (err) => {
        //     console.log('Error finding todos', err);
        // })

        // delete one
        db.collection('Todos').findOneAndDelete({
            text: "Bier drinken"
        }).then((result) => {
            console.log(result)
            // console.log('\n\n');
        }, (err) => {
            console.log('Error finding todos', err);
        })
    }

    db.close();
})
