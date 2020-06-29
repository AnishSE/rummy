const jwt     = require('jsonwebtoken');
const config  = require('config');
const JWT_KEY = config.get('JWT_KEY');

module.exports = {

    validateToken: (req, res, next) => {       
      // Get auth header value  
      const bearerHeader = req.headers.authorization;      
      let result;
      // Check if bearer is undefined
      if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' '); 
        // Get token from array
        const bearerToken = bearer[1];        
        try {
          // verify makes sure that the token hasn't expired and has been issued by us
          jwt.verify(bearerToken, JWT_KEY, (err,authData) => {
            if(err){              
              res.status(401).json({ success: '0', message: "Token not valid", data: err });
            }else{
              // Let's pass back the token to the request object or set the token
              req.authData = authData;
              // We call next to pass execution to the subsequent middleware
              next();
            }
          });
        } catch (err) {
          // Throw an error just in case anything goes wrong with verification
          throw new Error(err);
        }
      } else {
          res.sendStatus(403).json({ success: '0', message: "failure", data: 'Unauthorized Token' });
      }
    }
};