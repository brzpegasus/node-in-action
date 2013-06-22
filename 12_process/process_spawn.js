var cp = require('child_process'),
    fs = require('fs');

// spawn() returns a ChildProcess object with three built-in streams:
// stdin, stdout, and stderr
var child = cp.spawn('ls', ['-l']);

child.stdout.pipe(fs.createWriteStream('ls-result.txt'));
child.on('exit', function (code, signal) {
  console.log("Child process is exiting:", code, "(", signal, ")");
});
