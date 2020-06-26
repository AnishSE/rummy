require('dotenv').config();
var createError     = require('http-errors');
var express         = require('express');
var path            = require('path');
var cookieParser    = require('cookie-parser');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var schedule        = require('node-schedule');
var cors            = require('cors');

var ejsLayouts      = require("express-ejs-layouts");
var app             = express();
const wagner        = require('wagner-core');
const helmet        = require('helmet');
var bodyParser      = require('body-parser');
const sequelize     = require('./utils/db')(wagner);

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
