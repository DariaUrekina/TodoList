//Creates an Express application. The express() function is a top-level function exported by the express module.
var express = require('express');
var path = require('path');
var http=require('http');
var formidable=require('formidable');
var fs=require('fs');
var moment = require('moment');
var favicon = require('static-favicon');
var logger = require('morgan');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Static = require('node-static');
var home = require('./routes/home');
var users = require('./routes/users');
var tasks = require('./routes/tasks');
var lists = require('./routes/lists');
var uploadManager = require('./routes/uploadManager')
var dbConfig = require('./db');


// Configuring Passport

var passport = require('passport');
var expressSession = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
 
app.use('/home', home);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/lists', lists);
app.use('/upload', uploadManager)


// Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

var routes = require('./routes/index')(passport);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


mongoose.connect('mongodb://localhost/todoApp', function(err) { 
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});


module.exports = app;
