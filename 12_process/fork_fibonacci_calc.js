function fib(n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}

var input = parseInt(process.argv[2], 10);
// Report back to the parent process when the computation is done
process.send({ result: fib(input) });
