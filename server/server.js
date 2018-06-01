require('./config/config');

const _ = require('lodash');           // added for patch
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');  // added for authentication

var app = express();
const port = process.env.PORT;    // amended

app.use(bodyParser.json());

// app.post('/todos', (req, res) => {
//   var todo = new Todo({
//     text: req.body.text
//   })

app.post('/todos', authenticate, (req, res) => {   //making it private
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});


// app.get('/todos', (req, res) => {
//   Todo.find().then((todos) => {
//     res.send({todos});
//   }, (e) => {
//     res.status(400).send(e);
//   })
// });

app.get('/todos', authenticate, (req, res) => {     // private
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});


// app.get('/todos/:id', (req, res) => {
//   var id = req.params.id;
//
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }
//
//   Todo.findById(id).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }
//
//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});


// delete added
// app.delete('/todos/:id', (req, res) => {
//   var id = req.params.id;
//
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }
//
//   Todo.findByIdAndRemove(id).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }
//
//     res.send({todo});     // amemded to include {}
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// added for Patch
// app.patch('/todos/:id', (req, res) => {
//   var id = req.params.id;
//   var body = _.pick(req.body, ['text', 'completed']);    //where updatable stored
//
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }
//
//   if (_.isBoolean(body.completed) && body.completed) {    // is a boolean & is true
//     body.completedAt = new Date().getTime();      // set date of completion - JS time format
//   } else {
//     body.completed = false;
//     body.completedAt = null;
//   }
//
//    // body is key_value pair set by operator $set.
//   Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }
//
//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   })
// });

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});


// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);   //x-auth is a custom header
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//Added for authentication
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

//Added for logging out
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
