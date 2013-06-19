var connect = require('connect');

// Regular cookies:
// curl http://localhost:3000/ -H 'Cookie: foo=bar, bar=baz'

// JSON cookies:
// curl http://localhost:3000/ -H 'Cookie: foo=bar, bar=j:{"foo":"bar"}'
var app = connect()
  .use(connect.cookieParser("A secret string for signing and unsigning cookies"))
  .use(function (req, res) {
    console.log(req.cookies);
    console.log(req.signedCookies);

    // Outgoing cookies:
    // curl http://localhost:3000/ --head
    res.setHeader('Set-Cookie', 'foo=bar');
    res.setHeader('Set-Cookie', 'tobi=ferret; Expires=Tue, 08 Jun 2021 10:18:14 GMT');
    res.end("hello");

  }).listen(3000);
