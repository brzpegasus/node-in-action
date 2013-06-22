// Exit event fires after the event loop has already stopped
process.on('exit', function (code) {
  console.log('Exiting...');
});

process.on('uncaughtException', function (err) {
  console.error("Got uncaught exception: ", err.message);
  process.exit(1);
});

throw new Error("an uncaught exception");
