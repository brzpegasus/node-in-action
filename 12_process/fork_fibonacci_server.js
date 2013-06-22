var http = require('http'),
    cp = require('child_process');

http.createServer(function (req, res) {
  // Perform the expensive, CPU-bound fibonacci calculation
  // in a separate Node process. Parent and child processes
  // can communicate using a special IPC channel.
  var child = cp.fork('fork_fibonacci_calc.js', [ req.url.substring(1) ]);
  child.on('message', function (m) {
    res.end(m.result + "\n");
  });
}).listen(8000);
