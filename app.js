require('dotenv').config();
const createError     = require('http-errors');
const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');
const bodyParser      = require('body-parser');
const schedule        = require('node-schedule');
const cors            = require('cors');
const ejsLayouts      = require("express-ejs-layouts");
const wagner          = require('wagner-core');
const helmet          = require('helmet');
const sequelize       = require('./utils/db')(wagner);

var app               = express();

const port = 3002;

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({limit: '5000mb',extended: true}));
app.use(bodyParser.urlencoded({limit: '5000mb',extended: true}));

/*Setting up layouts*/
app.use(ejsLayouts); 

require('./utils/dependencies')(wagner);
require("./models")(sequelize, wagner);
require('./manager')(wagner);

app.use(function(err, req, res, next) {
  res.locals.message     = err.message;
  res.status(err.status || 500);
  res.render('error');  
});

//Routes
require("./routes")(app, wagner);

app.listen(port, () => console.log(`App listening on port ${port}!`));
