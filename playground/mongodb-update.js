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

        db.collection('Todos').findOneAndUpdate({
            '_id': new ObjectID('58fcfe73c44110c85cfb781c')
        }, {
            $set: {
                'prio': 'High'
            },
            $inc: {
                'numberOfUpdates': 1
            },

            $currentDate: {
                date: true,
                "cancellation.date": {
                    $type: "timestamp"
                }
            },
        }, {
            'returnOriginal': false
        }).then((result) => {
            console.log(`Updtade!!!!!!\n${JSON.stringify(result, undefined, 2)}`);
        }, (err) => {
            console.log('Error!!!!!!');
        })
    }
    db.close();
})
