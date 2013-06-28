var fs = require('fs');

/* Simple data read */

fs.readFile('./resources/sample.json', function(err, data) {
    console.log(data);
});

/* Data streaming */

var stream = fs.createReadStream('./resources/sample.json');
// Data event is fired when a new chunk of data is ready
stream.on('data', function(chunk) {
    console.log(chunk);
});
// End event is fired when all chunks have been loaded
stream.on('end', function() {
    console.log('Done streaming data.');
});