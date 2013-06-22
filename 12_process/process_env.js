var debug;

// Invoke with either
// $ node debug-mode.js
// or
// $ DEBUG=1 node debug-mode.js

if (process.env.DEBUG) {
  debug = function (data) {
    console.error(data);
  }
} else {
  debug = function () {};
}

debug("This is a debug call");
console.log("Hello World!");
debug("This is another debug call");
