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

// MongoClient.connect(`mongodb://${host}:${port}/TodoApp`, (err, db) => {
//     if (err) {
//         console.log('Error connecting to the MongoDB server!');
//     } else {
//         console.log('You are now connected');
//         db.collection('Todos').insertOne({
//             text: 'Naar oma',
//             complete: false,
//             date: '20170423'
//         }, (err, result) => {
//             if (err) {
//                 console.log('Error inserting todo');
//             } else {
//                 console.log(JSON.stringify(result.ops, undefined, 2));
//             }
//         });
//
//         db.close();
//
// })


MongoClient.connect(`mongodb://${host}:${port}/TodoApp`, (err, db) => {
    if (err) {
        console.log('Error connecting to the MongoDB server!');
    } else {
        console.log('You are now connected');
        // db.collection('Users').insertOne({
        //     name: "Hans van Meurs",
        //     age: "55",
        //     location: "Fransebaan 511, Eindhoven"
        // }, (err, result) => {
        //     if (err) {
        //         console.log('Error inserting document in Users collection');
        //     } else {
        //         console.log(result.ops[0]._id.getTimestamp());
        //     }
        // });
    }
    db.close();
})
