var connect = require('connect');

// Multiple error-handling middleware components
var api = connect()
  .use(users)
  .use(pets)
  .use(errorHandler);

var app = connect()
  .use(hello)
  .use('/api', api)
  .use(errorPage)
  .listen(3000);

function hello(req, res, next) {
  if (req.url.match(/^\/hello/)) {
    res.end('Hello World\n');
  } else if (req.url.match(/^\/yo/)) {
    next(new Error('yo? try /hello'));
  } else {
    next();
  }
}

// A users component that searches for a user in db
// and throws a notFound error when that fails
var db = {
  users: [
    { name: 'tobi' },
    { name: 'loki' },
    { name: 'jane' }
  ]
};

function users(req, res, next) {
  var match = req.url.match(/^\/user\/(.+)/);
  if (match) {
    var name = match[1];
    var user = db.users.map(function(user) {
      return user.name;
    }).indexOf(name) > -1 ? name : null;
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
    } else {
      var err = new Error('User not found');
      err.notFound = true;
      next(err);
    }
  } else {
    next();
  }
}

function pets(req, res, next) {
  if (req.url.match(/^\/pet\/(.+)/)) {
    foo(); // intentionally left undefined
  } else {
    next();
  }
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.setHeader('Content-Type', 'application/json');
  if (err.notFound) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: err.message }));
  } else {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

function errorPage(err, req, res, next) {
  res.setHeader('Content-Type', 'plain/text');
  res.statusCode = 404;
  res.end(err.message);
}
