var events = require('events'),
    util = require('util'),
    fs = require('fs'),
    watchDir = './watch',
    processedDir = './done';

function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

// Extend event emitter's functionality

// Equivalent to:
// Watcher.prototype = new events.EventEmitter();
util.inherits(Watcher, events.EventEmitter);

Watcher.prototype.watch = function() {
    var watcher = this;
    fs.readdir(this.watchDir, function(err, files) {
        if (err) throw err;

        for (var index in files) {
            watcher.emit('process', files[index]);
        }
    });
};

Watcher.prototype.start = function() {
    var watcher = this;
    fs.watchFile(watchDir, function() {
        watcher.watch();
    });
};

//---------- Driver --------------//

var watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function process(file) {
    var watchFile = this.watchDir + '/' + file;
    var processedFile = this.processedDir + '/' + file.toLowerCase();

    // Every time that a file is processed in the watch directory,
    // it is renamed to lowercase and moved to the processed directory.
    fs.rename(watchFile, processedFile, function(err) {
        if (err) throw err;
    });
});

watcher.start();