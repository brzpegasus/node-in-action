var connect = require('connect');

var app = connect()
  .use(connect.favicon())
  .use(connect.cookieParser('keyboard cat'))
  .use(connect.session({
    cookie: {
      maxAge: 3600000 * 24
    }
  }))
  .use(function (req, res, next) {
    var sess = req.session;
    if (sess.views) {
      res.setHeader('Content-Type', 'text/html');
      res.write('<p>views: ' + sess.views + '</p>');
      res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
      res.write('<p>httpOnly: ' + sess.cookie.httpOnly + '</p>');
      res.write('<p>path: ' + sess.cookie.path + '</p>');
      res.write('<p>domain: ' + sess.cookie.domain + '</p>');
      res.write('<p>secure: ' + sess.cookie.secure + '</p>');
      res.end();
      sess.views++;
    } else {
      sess.views = 1;
      res.end("Welcome to the session demo. Refresh!");
    }
  });

app.listen(3000);
