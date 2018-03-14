const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT || 4200;

const app = express();

//enables us to send json to express
app.use(bodyParser.json());

//CRUD - REST API components

//post -create
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  });

  todo.save().then((doc)=> {
    res.send(doc);
  }, (e) => {
    res.status(418).send(e);
  });
});

app.post('/users', (req, res) => {
  const user = new User({
    email: req.body.email
  });

  user.save().then((info) => {
    res.send(info);
  }, (e) => {
    res.status(418).send(e);
  });
});

//get -read
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(418).send(e);
  });
});



app.listen(port, () => {
  console.log(`App is up at ${port}.`);
});

module.exports = {
  app
};
