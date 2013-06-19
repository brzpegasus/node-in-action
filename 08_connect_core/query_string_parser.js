var connect = require('connect');

var app = connect()
  .use(connect.query())
  .use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.query));
  }).listen(3000);
