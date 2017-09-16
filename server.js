var express = require('express');
var express_session=require('express-session');
var expressValidator = require('express-validator');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

require('dotenv').load();
var index = require('./routes/index.js');
var mongoDB = process.env.MONGO_URI; 
var app = express();
//database connection
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware loading
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//https://gist.github.com/bookercodes/1db4484fa9cdfe40b7cc
//https://github.com/ctavan/express-validator/blob/master/test/type-definition.spec.ts
app.use(expressValidator({
  customValidators: {
    areOptions: function (value) {
      var opts = value.split(',');
      // Remove empty options
      //opts = opts.filter(function(opt) { return /\S/.test(opt) });
      var nb=0;
      opts.forEach(function(opt){
        if(/^[a-zA-Z0-9]*$/.test(opt))
        nb++;
      });
      return nb==opts.length;
    }
  }
}));
app.use(cookieParser());
app.use(express_session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'client')));

//routes definition
app.use('/',index);


var Listener =app.listen(8080,function(){
  console.log("server listening at port : "+Listener.address().port);
});




