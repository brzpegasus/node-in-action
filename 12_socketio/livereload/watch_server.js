/*
 * Express and Socket.IO server that triggers "reload"
 * and "stylesheet" events when files change
 */
var fs = require('fs'),
    url = require('url'),
    http = require('http'),
    path = require('path'),
    express = require('express');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.set('log level', 1);

var root = __dirname;

app.get('/', function (req, res) {
  res.sendfile(root + '/index.html');
});

app.use(express.static(root));

// Keep a list of active files being watched
var watchers = {};
createWatcher('/index.html', 'reload');
createWatcher('/styles.css', 'stylesheet');

function createWatcher(file, event) {
  var absolute = path.join(root, file);

  if (watchers[absolute]) {
    return;
  }

  // Begin watching the file
  fs.watchFile(absolute, function (curr, prev) {
    if (curr.mtime !== prev.mtime) {
      io.sockets.emit(event, file);
    }
  });

  watchers[absolute] = true;
}

server.listen(8080);
