var cp = require('child_process');

cp.exec('node --version', { timeout: 15000 }, function (err, stdout, stderr) {
  if (err) throw err;
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
});

// Buffer a command's output and have Node automatically escape the arguments
cp.execFile('ls', ['-l', process.cwd()], function (err, stdout, stderr) {
  if (err) throw err;
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
});
