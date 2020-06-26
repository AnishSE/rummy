const express                     = require('express');
const router                      = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt                      = require('bcryptjs');
const saltRounds                  = 10;
const salt                        = bcrypt.genSaltSync(saltRounds);
const HTTPStatus                  = require('http-status');
const jwt                         = require('jsonwebtoken');

/* GET users listing. */

module.exports = (app, wagner) => {
	router.get('/', function(req, res, next) {
	  res.send('respond with a resource');
	});
	
	router.post('/login', [
        check('email').notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Email is not valid'),
        check('password').notEmpty().withMessage('password is required').bail().isLength({ min: 6 }).withMessage('Minimum 6 characters are required')            
    ], (req, res, next)=> { 
		let errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(405).json({ success: '0', message: "failure", data: errors.array() });
        }  
        req.userObj = {
        	email : req.body.email
        }

        wagner.get('users').find(req).then(users => {
        	if(users){
        		if(bcrypt.compareSync(req.body.password, users.password)){
                    let data = {                        
                        email          : users.dataValues.email,
                        first_name     : users.dataValues.first_name,
                        last_name      : users.dataValues.last_name,
                        mobile_number  : users.dataValues.mobile_number                
                    }

                    jwt.sign({data},'secretkey', {expiresIn: '300s'},(err,token)=>{                        
                        res.status(200).json({ success: '1', message: "success", data:data, token:token });
                        //res.status(HTTPStatus.OK).json({ success: '1', message: "success", data:data,token:token });
                    });
        		}
        	}else{
        		res.status(401).json({ success: '0', message: "failure", data: { "message" : "Incorrect username or password." } });
        	}      	
        }) 
    });

	router.post('/register', [
        check('email').notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Email is not valid'),
        check('password').notEmpty().withMessage('password is required').bail().isLength({ min: 6 }).withMessage('Minimum 6 characters are required'),
        check('first_name').notEmpty().withMessage('firstname required').bail(),
        check('last_name').notEmpty().withMessage('lastname required').bail(),
        check('mobile_number').notEmpty().withMessage('mobile number required').bail().isLength({ min: 10 }).withMessage('Minimum 10 characters are required'),

    ], async (req, res, next)=> {
        try{ 
    		let errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(405).json({ success: '0', message: "failure", data: errors.array() });
            }  
            req.body.password = bcrypt.hashSync(req.body.password, salt);
            const users = await wagner.get('users').insert(req.body)
        	console.log(users.dataValues);
            const data = {
                email     : users.dataValues.email,
                first_name : users.dataValues.first_name,
                last_name  : users.dataValues.last_name,
                mobile_number  : users.dataValues.mobile_number                
            }
            console.log(data);
            res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: {
                //authtoken, vendorlist, profile :{
                email     : users.dataValues.email,
                first_name : users.dataValues.first_name,
                last_name  : users.dataValues.last_name,
                mobile_number  : users.dataValues.mobile_number  
                
            }});   	
        }catch(e){
            console.log(e);
            if(e){
                if(e.original.errno==1062){
                    res.status(401).json({ success: '0', message: "failure", data: { "message" : "Email id already exist." } });
                }
            }    
        }     
    });

    router.post('/forgetPassword', [ check('email').exists().isEmail() ], async (req, res) =>{
        try{
	        req.userObj = {
	        	email : req.body.email
	        }
	        const errors = validationResult(req);
	        if (!errors.isEmpty()) {
	            return res.status(405).json({ success: '0', message: "failure", data: errors.array() });
	        }else{

	            let user = await wagner.get('users')["find"](req);
	            console.log(user);
	            if(user){
	              let forgetPassword = await wagner.get('users').forgetPassword(user);
	              if(forgetPassword){
	                res.status(HTTPStatus.OK).json({ success: '1', message: "Reset link sent on your mail.", data: '' });
	              }else{
	                res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "Something went wrong.", data: '' });
	              }
	            }else{
	              res.status(401).json({ success: '0', message: "failure", data: { "message" : "No user found.!" } });
	            }
         	}
        } catch(e) {
            console.log(e);
          res.status(500).json({ success: '0', message: "failure", data: e });
        }
    });

    /* Dummy route to check JWT token*/
    router.post('/dashboard',verifyToken, (req,res) =>{        
        jwt.verify(req.token,'secretkey',(err,authData) => {
            if(err){
                res.status(403).json({ success: '0', message: "failure", data: err.array() });
            }else{    
                res.status(200).json({ success: '1', message: 'Welcome to Dashboard', authData: authData });
            }                
        });
    }); 

    // Verify Token
    function verifyToken(req,res,next){
        // Get auth header value
        const bearerHeader = req.headers['authorization'];

        // Check if bearer is undefined
        if(typeof bearerHeader !== 'undefined'){
            // Split at the space
            const bearer = bearerHeader.split(" ");
            // Get token from array
            const bearerToken = bearer[1];
            // Set the token
            req.token = bearerToken;
            // Call Next Middleware
            next();
        }else{
            res.sendStatus(403).json({ success: '0', message: "failure", data: 'Unauthorized Token' });
        }
    }   
	return router;
}