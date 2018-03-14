const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT || 4200;

const app = express();

//enables us to send json to express
app.use(bodyParser.json());

//post -create
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc)=> {
    res.send(doc);
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
