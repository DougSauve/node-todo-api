const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT || 4200;

const todo1 = new Todo({
  text: "eat bob",
  completed: true
})

todo1.save().then((doc)=>{
  console.log(doc);
}, (e) => {
  console.log(e);
});

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



app.listen(port, () => {
  console.log(`App is up at ${port}.`);
});
