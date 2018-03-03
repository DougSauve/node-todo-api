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

    //deleteMany, deleteOne, findOneAndDelete - lets you return the values.
    // db.collection('Todos').deleteMany({completed: true}).then((result) => {
    //   console.log(result);
    //})

    //deleteOne only deletes the first one.
    // db.collection('Todos').deleteOne({text: "walk the dog"}).then((result) => {
    //   console.log(result);
    //})

    var getID = () => {
      return new Promise((resolve, reject) => {

         db.collection('Users')
        .find()
        .toArray()
        .then((result) => {
          resolve(result[2]._id);//new ObjectID(result[2]._id));
        });
      });
    };

    getID().then((res) => {
        db.collection('Users')
        .findOneAndDelete({_id: res}).then((result) => {
          console.log(result);
        })
    })

    // db.collection('Todos').
    // find({text: "walk the dog"})
    // .toArray()
    // .then((result) => {
    //   IDToDelete = new ObjectID(result[0]._id);
    //   console.log("The target is ", IDToDelete);
    // });

//
    // db.collection('Todos').
    // findOneAndDelete({_id: IDToDelete}).then((result) => {
    //   console.log(result);
    // });


    //client.close();
});
