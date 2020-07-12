const express                     = require('express');
const router                      = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt                      = require('bcryptjs');
const saltRounds                  = 10;
const salt                        = bcrypt.genSaltSync(saltRounds);
const HTTPStatus                  = require('http-status');
const jwt                         = require('jsonwebtoken');
const Razorpay 					  = require('razorpay');
const axios  					  = require('axios');
const config  					  = require('config');
const RAZORPAY_KEY_ID 			  = config.get('RAZORPAY_KEY_ID');
const RAZORPAY_KEY_SECRET         = config.get('RAZORPAY_KEY_SECRET');

// const validateToken 			  = require('../middleware/AuthMiddleware').validateToken;
const instance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
})

/* GET users listing. */

module.exports = (app, wagner) => {

    let authMiddleware = wagner.get('auth');
    
	router.get('/', function(req, res, next) {
	  res.send('respond with a resource');
	});
	
	router.post('/login', [
        check('email').notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Email is not valid'),
        check('password').notEmpty().withMessage('password is required').bail().isLength({ min: 6 }).withMessage('Minimum 6 characters are required')            
    ], (req, res, next)=> { 
		let errors = validationResult(req);
        if(!errors.isEmpty()){
            let lasterr = errors.array().pop();
            lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");    
            return res.status(405).json({ success: '0', message: "failure", data: lasterr });
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
            res.status(500).json({ success: '0', message: "failure", data: error });
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
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
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
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
	        }else{

	            let user = await wagner.get('UserManager')["find"](req);

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
    router.post('/dashboard',authMiddleware['verifyAccessToken'].bind(authMiddleware), (req,res,next) =>{    
        return res.status(200).json({ success: '1', status_code: 200, message: 'Welcome to Dashboard', data: req.authData.data });
    }); 

    router.post('/resetPassword',[
    	check('old_password').notEmpty().withMessage('old password is required').bail().isLength({ min: 6 }).withMessage('Minimum 6 characters are required'),
    	check('new_password').notEmpty().withMessage('new password is required').bail().isLength({ min: 6 }).withMessage('Minimum 6 characters are required'),
    	check('confirm_password').notEmpty().withMessage('confirm password is required').bail().isLength({ min: 6 }).withMessage('Minimum 6 characters are required').custom((value, {req}) => (value === req.body.new_password)).withMessage('Confirm Password must match with New Password')	
    ],authMiddleware['verifyAccessToken'].bind(authMiddleware), (req,res,next) => { 
    	let errors = validationResult(req);
        if(!errors.isEmpty()){
            let lasterr = errors.array().pop();
            lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
            return res.status(405).json({ success: '0', message: "failure", data: lasterr });
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

    router.post('/logout', authMiddleware['verifyAccessToken'].bind(authMiddleware), async (req,res,next) => { 
        try{
            let token = await wagner.get('Tokens').destroy({where: { authToken: req.token } })
            if(token){
              return res.status(200).json({ success: '1', message: "success", data:{"message": "User Logout successfully"} });
            }else{
              return res.status(403).json({ success: '0', message: "failure", data:{"message":'Invalid device token!'} });
            }          
        }
        catch(e){          
          res.status(500).json({ success: '0', message: "failure", data: e });
        }
    });

    router.post('/guestLogin', [
        check('device_token').notEmpty().withMessage('Device Token is required'),
        check('device_type').notEmpty().withMessage('Device Type is required'),
        check('user_language').notEmpty().withMessage('User Language is required')                        
    ], (req, res, next)=> { 
		let errors = validationResult(req);
        if(!errors.isEmpty()){
            let lasterr = errors.array().pop();
            lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");    
            return res.status(405).json({ success: '0', message: "failure", data: lasterr });
        }  
        wagner.get('UserManager').guest_login(req.body).then(user=>{
        	if(user){            	
                return res.status(200).json(user);
            }
            else{
                return res.status(401).json(user);
            }
        }).catch(error=>{
            next(error);
            res.status(500).json({ success: '0', message: "failure", data: error });
        });
    });


    router.get('/order_page', (req,res,next) => { 
    	res.render('order_page');
    });
    


    router.post('/create_order', async (req, res,next) => {
		let options = {
		  amount: (req.body.amount)*100,  
		  currency: "INR",		  
		};
		instance.orders.create(options, function(err, order) {
		  	if(err){
		  		console.log(err);
		  		res.status(500).json({ success: '0', message: "failure", data: err });
		  	}else{		  		
		  		let paymentObj = {
		  			"userId": 31,
		  			"orderId": order.id,
					"amount": order.amount/100		  			
		  		}
		  		let req = {paymentObj};
		  		wagner.get('PaymentDetailManager')["insert"](req);
		  		res.redirect('payment_page/'+order.id);
		  	}
		});  	
		
	});

    router.get('/payment_page/:orderId', async (req,res,next) => {
    	let param = {    		
    		"orderId": req.params.orderId
    	}
    	// let paymentDetail = await wagner.get('PaymentDetailManager').find(param);
    	let paymentDetail = await wagner.get('PaymentDetails').findOne({where:param});
    	//console.log(paymentDetail);   
        if(paymentDetail){ 
        	console.log(paymentDetail);   
	    	//paymentDetail.dataValues.amount,
	    }else{
	    	
	    }
	    
    	res.render('payment_page',{
    		"key_id" : RAZORPAY_KEY_ID,
    		"orderId": req.params.orderId,	    
    		"amount" : 200		
    	});
    });

    router.post('/capture/:orderId/:amount', async (req, res,next) => {
	  	let callback =  (err, resp) => {
		    if(!!err){
		      
		      let params = {
		      	paymentObj :{
		      		"paymentId":req.body.razorpay_payment_id,
		      		"paymentStatus": "FAILED"
		      	},
		      	conditons : {
		      		"orderId":req.params.orderId
		      	}
		      }
		      let paymentDetail = wagner.get('PaymentDetailManager').update(params);
		      res.send({success: '0'});
		      console.log("Unsuccessful payment at RazorPay");
		    }else{
		      
		      let params = {
		      	paymentObj :{
		      		"paymentId":req.body.razorpay_payment_id,
		      		"paymentStatus": "SUCCESS"
		      	},
		      	conditons : {
		      		"orderId":req.params.orderId
		      	}
		      }
		      let paymentDetail = wagner.get('PaymentDetailManager').update(params);
		      res.send({success: '1'});
		      console.log("Successful payment at RazorPay");
		    }
	  	}
	  	instance.payments.capture(req.body.razorpay_payment_id, req.params.amount, callback);
	});	

	return router;
}
