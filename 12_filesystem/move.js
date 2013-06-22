// An optimized "move()" function that renames when possible,
// and falls back to copying, e.g. when dealing with multiple
// physical devices.
var fs = require('fs');

module.exports = function move(oldPath, newPath, callback) {
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      if (err.code === 'EXDEV') {
        // Can't move files across devices, copy instead
        copy();
      } else {
        callback(err);
      }
    }
    callback();
  });
};

function copy() {
  var readStream = fs.createReadStream(oldPath);
  var writeStream = fs.createWriteStream(newPath);
  readStream.on('error', callback);
  writeStream.on('error', callback);
  readStream.on('close', function () {
    // Use "unlink" to delete the original file
    fs.unlink(oldPath, callback);
  });
  readStream.pipe(writeStream);
}
