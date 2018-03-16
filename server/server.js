const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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


//get - using params
app.get('/todos/:id', (req,res) => {
  const id = req.params.id;

  //validate the id
  if (!ObjectID.isValid(id)) return res.status(406).send();
  Todo.findById(id).then((todo) => {
    //return 404 if there is no matching todo: find doesn't complain about returning an empty array
    if(!todo) return res.status(404).send();
    res.send({todo});
  })
  .catch((e) => res.status(400).send());
});

//delete
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  //validate the id - return 406 Unacceptable if it isn't valid
  if (!ObjectID.isValid(id)) return res.status(406).send();
  Todo.findByIdAndRemove(id).then((todo) => {
    //if the document is valid but not there, return 404 not found
    if (!todo) return res.status(404).send();
    //found it, no issues
    res.send('document removed', todo);
    //if the request doesn't work for whatever reason
  })
  .catch((e) => res.status(400).send());
});



app.listen(port, () => {
  console.log(`App is up at ${port}.`);
});

module.exports = {
  app
};
