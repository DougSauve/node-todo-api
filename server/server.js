require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;

const app = express();

//enables us to send json to express
app.use(bodyParser.json());

//CRUD - REST API components

//post -create
app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  });

  todo.save().then((doc)=> {
    res.send(doc);
  }, (e) => {
    res.status(418).send(e);
  });
});

//get -read
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(418).send(e);
  });
});

//get by id - using params
app.get('/todos/:id', authenticate, (req,res) => {
  const id = req.params.id;

  //validate the id
  if (!ObjectID.isValid(id)) return res.status(406).send();
  Todo.findOne({_id: id, _creator: req.user._id}).then((todo) => {
    //return 404 if there is no matching todo: find doesn't complain about returning an empty array
    if(!todo) return res.status(404).send();
    res.send({todo});
  })
  .catch((e) => res.status(400).send());
});

//delete
app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  //validate the id - return 406 Unacceptable if it isn't valid
  if (!ObjectID.isValid(id)) return res.status(406).send();
  Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then((todo) => {
    //if the document is valid but not there, return 404 not found
    if (!todo) return res.status(404).send();
    //found it, no issues
    res.send({todo});
    //if the request doesn't work for whatever reason
  })
  .catch((e) => res.status(400).send());
});

//delete all
app.delete('/todos', (req, res) => {
  Todo.remove({}).then(() => {
    res.send('Database cleared');
  }).catch((e) => res.status(400).send());
});

//patch -update
app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) return res.status(406).send();

  if (_.isBoolean(body.completed) && body.completed) {//why check if it's a boolean? Can the user access this and give it somethig weird? Then I guess if they do that we're just saying they didn't completed it, not send a 406...?
    body.completedAt = new Date().getTime(); //# of milliseconds since 1970.
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    },{
      $set: body
    },
    {
      new: true
    }).then((todo) => {
    if (!todo) return res.status(404).send();
    res.send({todo});
  }).catch((e) => res.status(400).send());
});


//POST users (sign up)
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  const user = new User(body);     ///CURRENT ISSUE: unique emails are not being enforced! Why not?

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  })
  .catch((e) => res.status(400).send(e));
});

app.get('/users', (req, res) => {
  User.find().then((users) => {
    if (!users) return res.status(404).send();
    res.send(users);
  }).catch((e) => res.send(400));
});
//delete all
app.delete('/users', (req, res) => {
  User.remove({}).then(() => {
    res.send('Database cleared');
  }).catch((e) => res.status(400).send());
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//POST /users/login {email, password(in text) } //find user that matches email and hashed password.
app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => res.status(400).send());
});

app.listen(port, () => {
  console.log(`App is up at ${port}.`);
});

//log out
app.delete('/users/me/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.send();
  }), (e) => {
    res.status(400).send();
  };
});

module.exports = {
  app
};
