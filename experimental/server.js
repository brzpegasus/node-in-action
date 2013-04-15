var http = require('http');
var fs = require('fs');

//http.createServer(function(req, res) {
    // Send plain text
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    // res.end('Hello World');

    // Stream image data to the client
    //res.writeHead(200, {'Content-Type': 'image/png'});
    //fs.createReadStream('./resources/wow-drake.jpg').pipe(res);

//}).listen(3000);
//console.log('Server running at http://localhost:3000/');

// Alternative
// var server = http.createServer();
// server.on('request', function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello World');
// });
// server.listen(3000);

var server = http.createServer(function(req, res) {
    var url = 'http://google.com';
    var body = '<p>Redirecting to <a href="' + url + '">' + url + '</a></p>';
    res.setHeader('Location', url);
    res.setHeader('Content-Length', body.length);
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 302;
    res.end(body);
});

server.listen(3000, '127.0.0.1');
