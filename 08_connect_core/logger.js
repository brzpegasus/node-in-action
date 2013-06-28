var connect = require('connect'),
    url = require('url'),
    fs = require('fs');

// Define a custom token
connect.logger.token('query-string', function (req, res) {
  return url.parse(req.url).query;
});

// Stream logging to a file
var log = fs.createWriteStream('logger.log', { flags: 'a' });

var app = connect()
    .use(connect.favicon())
    .use(connect.logger(':method :url :query-string'))
    .use(connect.logger('dev'))
    .use(connect.logger({
      format: ':method :url',
      stream: log
    }))
    .use(function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Hello World!");
    })
    .listen(3000);
