var connect = require('connect');

// JSON data:
// curl -d '{"username":"tobi"}' -H "Content-Type: application/json" http://localhost:3000

// Regular form data
// curl -d username=tobi http://localhost:3000

// Multi-part form data
// curl -F image=@photo.png -F username=tobi http://localhost:3000
var app = connect()
  .use(connect.bodyParser())
  .use(function (req, res) {
    console.log(req.body);
    console.log(req.files);

    // do stuff to register the user
    res.end("Registered new user: " + req.body.username);
  }).listen(3000);
