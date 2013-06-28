var connect = require('connect');

var users = {
  tobi: 'foo',
  loki: 'bar',
  jane: 'baz'
};

var app = connect()
  .use(connect.basicAuth(function (user, pass) {
    return users[user] === pass;
  }))
  .use(function (req, res) {
    res.end("Authenticated");
  }).listen(3000);
