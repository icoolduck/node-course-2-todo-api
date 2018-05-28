//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("5b0c298fc8cdd1e41eb88dcf")
  // }, {
  //   $set: {
  //     completed: true
  //    }
  // }, {
  //     returnOriginal: false
  //   }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("5b0c12ea82d07f0c60a06ea4")
  }, {
    $set: {
      name: 'Quek Kar Tung'
    },
    $inc: {
      age: 1
    }
  }, {
      returnOriginal: false
    }).then((result) => {
    console.log(result);
  });

  // db.close();
});
