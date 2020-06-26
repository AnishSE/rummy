const config = require('config');
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    host: config.get('MAIL_HOST'),
    port: config.get('MAIL_PORT'),
    secure: false,
    auth: {
        user: config.get('MAIL_USERNAME'),
        pass: config.get('MAIL_PASSWORD')
    }
});

class mailHelper {

    constructor(wagner) {
    }

    sendMail (params) {
        return new Promise(async (resolve, reject)=>{
        	try{
    	        const sendMailfun = await transport.sendMail(params);
    	        resolve(sendMailfun);	
    		} catch(error){
                console.log(error);
                reject(sendMailfun);
    		}	
        })           
    }      
}

module.exports = mailHelper;