const nodemailer      = require('nodemailer');
const bcrypt          = require('bcryptjs');
const saltRounds      = 10;
const salt            = bcrypt.genSaltSync(saltRounds);
const config          = require('config');
const jwt             = require('jsonwebtoken');
const asyncLoop       = require('node-async-loop');
const async           = require("async");
const moment          = require('moment');

class GameManager {

    constructor(wagner) {
    	this.Games = wagner.get("Games");
    	this.Tokens = wagner.get("Tokens");
    	this.Mail  = wagner.get("MailHelper");
    	this.auth  = wagner.get('auth');
    	this.JoinGame = wagner.get("JoinGame");
    	this.GameStats = wagner.get("GameStats");
    	this.Cards = wagner.get("Cards");
    }

    insert(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		console.log(req);
		        let insert  = await this.Games.create(req,{raw:true});
		        resolve(insert)
	      	} catch(error){
	      		console.log(error);
	      		reject(error);
	        }
	    })
	}

	insertJoinGame(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		console.log(req);
		        let insert  = await this.JoinGame.create(req,{raw:true});
		        resolve(insert)
	      	} catch(error){
	      		console.log(error);
	      		reject(error);
	        }
	    })
	}

	insertGameStats(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		console.log(req);
		        let insert  = await this.GameStats.create(req,{raw:true});
		        resolve(insert)
	      	} catch(error){
	      		console.log(error);
	      		reject(error);
	        }
	    })
	}

	findList(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		let arrayData = [];
	      		let count = 0;
		        let find  = await this.GameStats.findAll({
		        	where : {id:req.id}
		        });
		        async.each(find, async(val, callback) =>{ 
		        	let data = {
		        		room_id : val.room_id,
		        		points : val.points,
		        		status : val.status,
		        		date :  moment(val.createdAt).format('YYYY-MM-DD HH:mm:ss'),
		        	}
		        	arrayData.push(data);

		        	if(count == find.length-1){
		        		console.log(arrayData);
		        		resolve(arrayData)
		        	}
		        	count++;
		        })		        
		        
	      	} catch(error){
	      		console.log(error);
	      		reject(error);
	        }
	    })		
	}	

	saveCards(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		console.log(req);
		        let insert  = await this.Cards.create(req,{raw:true});
		        resolve(insert)
	      	} catch(error){
	      		console.log(error);
	      		reject(error);
	        }
	    })
	}	

}

module.exports  = GameManager;    