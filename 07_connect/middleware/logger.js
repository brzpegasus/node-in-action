/**
 * A logger middleware component that logs various properties
 * of the request object.
 * 
 * @param {String} format
 *    Printing format specifying the properties to log, e.g.
 *    ':method :url'
 */
module.exports = function setup(format) {
  var regexp = /:(\w+)/g;
  return function logger(req, res, next) {
    var str = format.replace(regexp, function(match, property) {
      return req[property];
    });
    console.log(str);
    next();
  }
};
