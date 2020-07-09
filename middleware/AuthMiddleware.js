const jwt     = require('jsonwebtoken');
const config  = require('config');
const JWT_KEY = config.get('JWT_KEY');
const JWT_TOKEN_EXPIRES = config.get('JWT_TOKEN_EXPIRES');


module.exports = class AuthMiddleware  {

    constructor(wagner){      
      this.Tokens = wagner.get('Tokens');
    };

    generateAccessToken(req,res){
      return new Promise(async ( resolve,reject)=>{
        jwt.sign({ "data": req }, JWT_KEY, { expiresIn: JWT_TOKEN_EXPIRES },
        function(err, token) {
          if(err){
            console.log(err)
            reject(err)
          } else {
            resolve(token);
          }
        });
      })
    }

    verifyAccessToken(req, res, next){       
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
              if(err.name == 'TokenExpiredError'){
                res.status(406).json({ success: '0',  message: "failure" , data :{"message": "Token expired!"} });
              } else {
                res.status(403).json({ success: '0',  message: "failure" ,data:{ "message": "Invalid token!"} });
              }                           
            }else{
              let result = this.Tokens.findOne({where: {authToken : bearerToken } });              
              if(result){
                  // Let's pass back the token to the request object or set the token
                  req.authData = authData;
                  req.token = bearerToken;
                  // We call next to pass execution to the subsequent middleware
                  next();
              }else{
                  res.status(403).json({ success: '0',  message: "failure" ,data:{ "message": "Invalid token!"}});
              }              
            }
          });
        } catch (err) {
            console.log(err);
          // Throw an error just in case anything goes wrong with verification
          //throw new Error(err);
          res.status(500).json({ success: '0', message: "failure", data: err });
        }
      } else {
          res.sendStatus(403).json({ success: '0', message: "failure", data: "Unauthorized Token" });
      }
    }

}