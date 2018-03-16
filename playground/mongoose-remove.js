const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require ('../server/models/user');
//
// Todo.remove({_id: sdfsdfsdfsdf}).then((result) => {
//   console.log(result);
// }};

Todo.findOneAndRemove({_id: '5aabd9c6a01094f61d63c967'}).then((todo) => {
  console.log(todo);
});
// Todo.findByIdAndRemove({id}) //both get the doc back. Remove doesn't.

Todo.findByIdAndRemove('5aabd9c6a01094f61d63c967').then((todo) => {
  console.log(todo);
});
