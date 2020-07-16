var express = require('express');

module.exports = (app, wagner) => {
	app.get('/', (req, res, next)=> {
	  	res.redirect('/admin/login');
	});

	const users  = require('./users')(app, wagner);
	const games  = require('./games')(app, wagner);
	app.use('/users', users);
	app.use('/games', games);
}


