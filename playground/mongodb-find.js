const {MongoClient, ObjectID} = require('mongodb');

var user = {name:"doug", age: 29};
var {name} = user;
console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
      return console.log(`unable to connect to MongoDB server: ${err}`);
    }
    console.log('Connected to MongoDB server.')

    const db = client.db('TodoApp');

    db.collection('Users')
    .find()
    .toArray()
    .then((docs) => {
      console.log("Todos:");
      console.log(JSON.stringify(docs, undefined, 2));

    }, (err) => {
      console.log("NO DICE MAN", err);
    });



//    client.close();
});
