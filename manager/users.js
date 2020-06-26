const Sequelize       = require('sequelize');
const nodemailer      = require('nodemailer');
const bcrypt          = require('bcryptjs');
const saltRounds      = 10;
const salt            = bcrypt.genSaltSync(saltRounds);
const config          = require('config');

class users {

    constructor(wagner) {
    	this.Users = wagner.get("Users");
    	this.Mail = wagner.get("MailHelper");
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
}


module.exports  = users;