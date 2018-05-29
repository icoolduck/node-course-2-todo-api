var env = process.env.NODE_ENV || 'development';        // added for test database
//console.log('env ******', env);
if (env === 'development'){   // added for test database
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}else if (env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
