const MongoClient = require('mongodb').MongoClient;

var port = '27017';
var host = 'localhost';

MongoClient.connect(`mongodb://${host}:${port}/MySecondDB`, (err, db) => {
  if (err) {
    console.log('Error connecting to the MongoDB server!');
  } else {
    console.log('You are now connected');
    db.collection('Customers').insertOne({
        name: 'Joris',
        location: "HTC",
        lief: true
      })
      .then((result) => {
        console.log(JSON.stringify(result.ops, undefined, 2));
      }, (err) => {
        console.log('Error inserting todo');
      });
  }
  db.close();
})
