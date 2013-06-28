var connect = require('connect');

var app = connect()
  .use(connect.compress({
    filter: function(req, res) {
      var type = res.getHeader('Content-Type') || '';
      return type.match(/text|javascript/);
    },
    level: 3,
    memLevel: 8
  }))
  .use(connect.directory('public', { icons: true, hidden: true }))
  .use(connect.static('public'))
  .listen(3000);
