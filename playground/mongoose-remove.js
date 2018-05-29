const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Removes everything
 // Todo.remove({}).then((result) => {
 //   console.log(result);
 // });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

// Todo.findOneAndRemove({_id: '57c4610dbb35fcbf6fda1154'}).then((todo) => {
//
// });

 Todo.findByIdAndRemove('5b0d0eea7bedf0b4d05e49b7').then((todo) => {
   console.log(todo);
 });
