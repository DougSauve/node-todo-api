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

    // db.collection('Todos')
    // .findOneAndUpdate({
    //   _id: new ObjectID("5a9863456e7bbd14cc111428")
    // },{
    //   $set: {
    //     completed: true
    //   }
    // },{
    //   returnOriginal: false
    // })
    // .then((res) => {
    //   console.log(res);
    // });

    db.collection('Users')
    .findOneAndUpdate({
      _id: new ObjectID("5a98495c51956e624f42e19d")
    }, {
      $set: {
        name: "Doug"
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    })
    .then((res) => {
      console.log(res);
    });

//this needs to go in a Promise.
    //client.close();
});
