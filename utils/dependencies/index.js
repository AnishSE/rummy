module.exports = function(wagner) {
  wagner.factory('MailHelper', function() {
    var MailHelper = require('./mailHelper');
    return new MailHelper(wagner);
  });  
  wagner.factory('StripeDep', function() {
    var Stripe = require('./Stripe');
    return new Stripe(wagner);
  });  
};
