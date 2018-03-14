const mongoose = require('mongoose');
//nice - mongoose is inherently async.

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};
