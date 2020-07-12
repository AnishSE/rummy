module.exports = function(wagner) {
   	wagner.factory('UserManager', function() {
    	var UserManager = require('./UserManager');
    	return new UserManager(wagner);
  	});

   	wagner.factory('TokenManager', function() {
    	var TokenManager = require('./TokenManager');
    	return new TokenManager(wagner);
   	});

   	wagner.factory('PaymentDetailManager', function() {
    	var PaymentDetailManager = require('./PaymentDetailManager');
    	return new PaymentDetailManager(wagner);
  	});
}

