const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require ('../../models/user');
const jwt = require('jsonwebtoken');

const user1ID = new ObjectID();
const user2ID = new ObjectID();

const users = [{
    _id: user1ID,
    email: 'doug@gmail.com',
    password: 'password',
    tokens: {
      access: 'auth',
      token: jwt.sign({_id: user1ID, access: 'auth'}, 'boo').toString(),
    }
  },{
    _id: user2ID,
    email: 'doug2@gmail.com',
    password: 'password2',
}];

const todos = [{
  _id: new ObjectID(),
  text: 'hi mom'
},{
  _id: new ObjectID(),
  text: 'hi mom again',
  completed: true,
  completedAt: 3333333
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const user1 = new User(users[0]).save();
    const user2 = new User(users[1]).save(); //both return promises - need 'all.'

    return Promise.all([user1, user2]);
  }).then(() => done());
};

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers,
};
