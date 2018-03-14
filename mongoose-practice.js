const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Animals');

const Animal = mongoose.model('Animal', {
  kind: {
    type: String,
  },
  size: {
    type: String,
  },
  hungry: {
    type: Boolean
  }
});

const Dog = new Animal({
  kind: 'Dog',
  size: 'Big',
  hungry: true
});

Dog.save().then((docs) => {
  console.log('Animal saved:', docs);
}, (e) => {
  console.log("error:", e);
});
