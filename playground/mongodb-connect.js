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
    //todos, users - 2 collections in this db.


    db.collection('Todos').insertOne({
      name: "Doug",
      age: 28,
      location: "MN"
    }, (err, result) => {
      if (err) {
        return console.log ('unable to insert to Todo.', err)
      }

      console.log(JSON.stringify(result.ops, undefined, 2)); //ops stores all of the docs that were inserted.

    });

    //Users: name, age, location.

    // db.collection('Users').insertOne({
    //   name: "Doug",
    //   age: 25,
    //   location: "Minnesota"
    // }, (err, result) => {
    //   if (err) console.log(err);
    //
    //   console.log(JSON.stringify(result.ops, undefined, 2));
    //   console.log(result.ops[0]._id.getTimestamp());
    // })


    client.close();
});
