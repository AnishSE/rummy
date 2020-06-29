const express                     = require('express');
const router                      = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt                      = require('bcryptjs');
const saltRounds                  = 10;
const salt                        = bcrypt.genSaltSync(saltRounds);
const HTTPStatus                  = require('http-status');
const jwt                         = require('jsonwebtoken');
const validateToken 			  = require('../middleware/validate_token').validateToken;

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
        wagner.get('UserManager').login(req.body).then(user=>{
        	if(user){            	
                return res.status(200).json(user);
            }
            else{
                return res.status(401).json(user);
            }
        }).catch(error=>{
            next(error);
        });
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
            const users = await wagner.get('UserManager').insert(req.body)        	
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

	            let user = await wagner.get('UserManager')["find"](req);
	            console.log(user);
	            if(user){
	              let forgetPassword = await wagner.get('UserManager').forgetPassword(user);
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
    router.post('/dashboard',validateToken, (req,res,next) =>{    
        return res.status(200).json({ success: '1', status_code: 200, message: 'Welcome to Dashboard', data: req.authData.data });
    }); 

    router.post('/resetPassword',[
    	check('old_password').notEmpty().withMessage('old password is required').bail().isLength({ min: 6 }).withMessage('Minimum 6 characters are required'),
    	check('new_password').notEmpty().withMessage('new password is required').bail().isLength({ min: 6 }).withMessage('Minimum 6 characters are required'),
    	check('confirm_password').notEmpty().withMessage('confirm password is required').bail().isLength({ min: 6 }).withMessage('Minimum 6 characters are required').custom((value, {req}) => (value === req.body.new_password)).withMessage('Confirm Password must match with New Password')	
    ],validateToken, (req,res,next) => { 
    	let errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(405).json({ success: '0', message: "failure", data: errors.array() });
        }

	    let params  = req.body;
	    params.id   = req.authData.data.id;	         	
	        
	    wagner.get('UserManager').resetPassword(params).then(user => {
	        if(user){            	
	            return res.status(200).json(user);
	        }else{
	            return res.status(401).json(user);
	        }
	    }).catch(error=>{
	        next(error);
	    }); 	
    }); 

	return router;
}
