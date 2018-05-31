const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {     // adding instance method that limits
  var user = this;                            // what is sent back
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);  // picking off items to be returned.
};

UserSchema.methods.generateAuthToken = function () {   // adding instance method
  var user = this;                                    // cannot use arrow function withn 'this'
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  //user.tokens.push({access, token});      // user array
  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};


UserSchema.statics.findByToken = function (token) {     //model method, not instance method
  var User = this;                                      // needed for model methods
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({      // find associated user
    '_id': decoded._id,
    'tokens.token': token,   // find user by matching token
    'tokens.access': 'auth'
  });
};


var User = mongoose.model('User', UserSchema);

module.exports = {User}
