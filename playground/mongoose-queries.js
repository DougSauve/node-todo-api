const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require ('../server/models/user');

const id = '5aa9724bffd1a88415fa0a01';

const id2 = '5aa9943597b734b31ceffd06';

//validate the Id.
// if(!ObjectID.isValid(id)) {
//   console.log('Id not valid.');
// }

// Todo.find({//returns array of objects
//     _id: id
// }).then((todos) => {
//   console.log('Todos:', todos);
// });
// Todo.findOne({//returns object
//   _id: id
// }).then((todo) => {
//   console.log('Todo:', todo);
// });
// Todo.findById(id).then((todo) => {
//   if(!todo) return console.log('Id not found.');
//
//   console.log('TodoById:', todo);
// }).catch((e) => console.log(e));

User.findById(id2).then((user) => {
  if (!user) return console.log('User not found.');
  console.log(user);
}).catch((e) => {console.log('Error:', 'Cast Error.')});
