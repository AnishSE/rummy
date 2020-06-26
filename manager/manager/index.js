module.exports = function(wagner) {
   wagner.factory('users', function() {
    var users = require('./users');
    return new users(wagner);
  })
}

