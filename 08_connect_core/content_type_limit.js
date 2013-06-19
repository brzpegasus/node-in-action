var connect = require('connect');

function type(type, fun) {
  return function (req, res, next) {
    var ct = req.headers['content-type'] || '';
    if (ct.indexOf(type) != 0) {
      return next();
    }
    fun(req, res, next);
  }
}

var app = connect()
  .use(type('application/x-www-form-urlencoded', connect.limit('64kb')))
  .use(type('application/json', connect.limit('32kb')))
  .use(type('image', connect.limit('2mb')))
  .use(type('video', connect.limit('300mb')))
  .use(connect.bodyParser())
  .use(function (req, res) {
    res.setHeader('Content-Type', 'plain/text');
    res.end("done");
  }).listen(3000);
