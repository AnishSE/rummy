module.exports = function(wagner) {
   wagner.factory('UserManager', function() {
    var UserManager = require('./UserManager');
    return new UserManager(wagner);
  })
}

