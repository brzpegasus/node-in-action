var connect = require('connect');
var logger = require('./middleware/logger');
var router = require('./middleware/router');

function restrict(req, res, next) {
  var authorization = req.headers.authorization;
  if (!authorization) return next(new Error('Unauthorized'));
  var parts = authorization.split(' ');
  var scheme = parts[0];
  var auth = new Buffer(parts[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  authenticateWithDatabase(user, pass, function(err) {
    if (err) return next(err);
    next();
  });
}

function authenticateWithDatabase(user, pass, fn) {
  if (!(user === 'tobi' && pass === 'ferret')) {
    fn(new Error('Invalid credentials'));
  } else {
    fn();
  }
}

function admin(req, res, next) {
  switch (req.url) {
    case '/':
      res.end('try /users');
      break;
    case '/users':
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(['tobi', 'loki', 'jane']));
      break;
  }
}

var routes = {
  GET: {
    '/users': function(req, res) {
      res.end('tobi, loki, jane');
    },
    '/user/:id': function(req, res, id) {
      res.end('user ' + id);
    }
  },
  DELETE: {
    '/user/:id': function(req, res, id) {
      res.end('deleted user ' + id);
    }
  }
};

connect()
  .use(logger(':method :url'))
  .use('/admin', restrict)
  .use('/admin', admin)
  .use(router(routes))
  .listen(3000);
