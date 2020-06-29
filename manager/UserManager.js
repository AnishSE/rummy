const Sequelize       = require('sequelize');
const nodemailer      = require('nodemailer');
const bcrypt          = require('bcryptjs');
const saltRounds      = 10;
const salt            = bcrypt.genSaltSync(saltRounds);
const config          = require('config');
const jwt             = require('jsonwebtoken');

class UserManager {

    constructor(wagner) {
    	this.Users = wagner.get("Users");
    	this.Mail  = wagner.get("MailHelper");
    }

	find(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Users.findOne({where : req.userObj});
		        resolve(user)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	insert(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Users.create(req,{raw:true});
		        resolve(user)
	      	} catch(error){
	      		console.log("ABC");
	        	//console.log(error);
	        	reject(error);
	        }
	    })
	}

	forgetPassword(req){
    	return new Promise(async (resolve, reject)=>{
    		console.log("HI");
		    try{
	          const mailOptions = {
	            from: config.get('MAIL_USERNAME'),
	            to: req.email,
	            subject: 'Reset Password Link.',
	            html: '<b>HI</b><br> <p>Greetings for the day.</p><br> <p>Please click Reset Password to reset your password.</p>  <p><a href='+config.get('app_route')+'users/resetPassword/'+ req.id+' <button>Reset Password</button></a></p> <br>Regards.<br> <p>Team '+config.get('site_name')+'.</p>'
	          };
	          const sendMailfunc = await this.Mail.sendMail(mailOptions);
	          resolve(sendMailfunc);

		    }catch(e){
		        console.log(e);
		        reject(e);
		    }
    	})
  	}

  	async login(req) {  		
	        try {
	            const JWT_KEY = config.get('JWT_KEY');
	            const JWT_TOKEN_EXPIRES = config.get('JWT_TOKEN_EXPIRES');
	            let emailId   = req.email; 
	            let password  = req.password;   
	            let user      = await this.Users.findOne({where: {email : emailId } });  

	            if (!user) {
	                return({ success: '0', status_code : 401, message: "failure", data: { "message" : "Incorrect email or password." } });                       
	            }else{
	            		            
		            if(bcrypt.compareSync(password, user.dataValues.password)){			            	
		            	let data = {
		            		id             : user.dataValues.id,
			                email          : user.dataValues.email,
                        	first_name     : user.dataValues.first_name,
                        	last_name      : user.dataValues.last_name,
                        	mobile_number  : user.dataValues.mobile_number                
		            	}			            	
		            	let token = await jwt.sign({ data: data }, JWT_KEY, { expiresIn: JWT_TOKEN_EXPIRES });
		            	if (!token){		                        
		                    return({ success : '0', status_code	: 401, message: "failure", data : {"message" : "Expired Token"}});  
		                }else{   
			                    return({
			                        success     : '1',
			                        status_code : 200,
			                        message     : "success",
			                        data        : data,                
			                        token       : token		                            
			                    });
			            }			            
		            } else {		            	
		                return({ success : '0', status_code : 401, message : "failure", data : { "message" : 'Incorrect password'}	});                          
		            }
		        }
	        } catch (e) {
	            return({ success : '0', status_code: 422, message : "failure", data : { "message" : e }});                          
	        }    	
    }

    async resetPassword(req) {
        try {                        
            let user = await this.Users.findOne({
                where: { id: req.id }
            });

            if (user) {
                if(bcrypt.compareSync(req.old_password, user.dataValues.password)){
                	let hashPassword = await bcrypt.hashSync(req.new_password, salt);
               
	                let update = await user.update({
	                    password: hashPassword	                    
	                });
	                if(update){
		                return({
		                    success : '1',
		                    status_code : 200,
		                    message: "success",
		                    data:{ message: "Password resetted successfully."}
		                }); 
		            }
            	}else{
            		return({ success : '0', status_code : 401, message : "failure", data : { "message" : 'Invalid Old Password.'}	});
            	}
            } else {
				return({ success : '0', status_code : 401, message : "failure", data : { "message" : 'Invalid token.'}	});
            }
        } catch (e) {            
            return({ success : '0', status_code: 422, message : "failure", data : { "message" : e }}); 
        }
    }

}


module.exports  = UserManager;