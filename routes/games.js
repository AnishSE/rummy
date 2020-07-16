const express                     = require('express');
const router                      = express.Router();
const { check, validationResult } = require('express-validator');
const HTTPStatus                  = require('http-status');


module.exports = (app, wagner) => {
	const authMiddleware              = wagner.get('auth');
	router.post('/startGame',/*authMiddleware['verifyAccessToken'].bind(authMiddleware),*/ [ check('player_id').exists(), check('bet_amount').exists(),check('player_count').exists()], async (req, res) =>{
		try{
	        const errors = validationResult(req);
	        if (!errors.isEmpty()) {
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
	        }else{
	        	let insert = await wagner.get('GameManager')["insert"](req.body);

	        	if(insert){
	                res.status(HTTPStatus.OK).json({ success: '1', message: "Saved Succesfully.", data: {"localRoomId" : insert.id} });
	            }else{
	                res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "Something went wrong.", data: '' });
	            }
	        }
		}catch(e){   
			console.log(e);
           res.status(500).json({ success: '0', message: "failure", data: e });
        }
	})

	router.post('/joinGame',authMiddleware['verifyAccessToken'].bind(authMiddleware), [ check('player_id').exists(), 
		check('room_id').exists(), check('localroom_id').exists(), check('player_count').exists(), check('connection_status').exists()], async (req, res) =>{
		try{
	        const errors = validationResult(req);
	        if (!errors.isEmpty()) {
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
	        }else{
	        	let insert = await wagner.get('GameManager')["insertJoinGame"](req.body);

	        	if(insert){
	                res.status(HTTPStatus.OK).json({ success: '1', message: "Saved Succesfully.", data: {} });
	            }else{
	                res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "Something went wrong.", data: '' });
	            }
	        }
		}catch(e){   
			console.log(e);
           res.status(500).json({ success: '0', message: "failure", data: e });
        }
	})	

	router.post('/gameStatus',authMiddleware['verifyAccessToken'].bind(authMiddleware), [ check('player_id').exists(), 
		check('room_id').exists(), check('localroom_id').exists(), check('points').exists(), check('status').exists()], async (req, res) =>{
		try{
	        const errors = validationResult(req);
	        if (!errors.isEmpty()) {
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
	        }else{
	        	let insert = await wagner.get('GameManager')["insertGameStats"](req.body);

	        	if(insert){
	                res.status(HTTPStatus.OK).json({ success: '1', message: "Saved Succesfully.", data: {} });
	            }else{
	                res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "Something went wrong.", data: '' });
	            }
	        }
		}catch(e){   
			console.log(e);
           res.status(500).json({ success: '0', message: "failure", data: e });
        }
	})

	router.get('/:id', async (req, res) =>{
		try{
        	let list = await wagner.get('GameManager')["findList"](req.params);

        	if(list){
                res.status(HTTPStatus.OK).json({ success: '1', message: "Saved Succesfully.", data: list });
            }else{
                res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "Something went wrong.", data: '' });
            }       
		}catch(e){   
			console.log(e);
           res.status(500).json({ success: '0', message: "failure", data: e });
        }
	})

	router.post('/saveCards',authMiddleware['verifyAccessToken'].bind(authMiddleware), [ check('player_id').exists(), 
		check('room_id').exists(), check('localroom_id').exists(), check('points').exists()], async (req, res) =>{
		try{

	        const errors = validationResult(req);
	        if (!errors.isEmpty()) {
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
	        }else{
	        	let data = {
	        		"player_id": req.body.player_id,
				    "room_id" : req.body.room_id,
				    "localroom_id": req.body.localroom_id,
				    "points" : req.body.points,
				    "cards" : JSON.stringify(req.body.cards)
	        	}

	        	console.log(data);
	        	let insert = await wagner.get('GameManager')["saveCards"](data);

	        	if(insert){
	                res.status(HTTPStatus.OK).json({ success: '1', message: "Saved Succesfully.", data: {} });
	            }else{
	                res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "Something went wrong.", data: '' });
	            }
	        }
		}catch(e){   
			console.log(e);
           res.status(500).json({ success: '0', message: "failure", data: e });
        }
	})					
	return router;
}