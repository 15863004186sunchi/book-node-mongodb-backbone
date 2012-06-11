var nodemailer = require('nodemailer');
var express = require('express');
var app = express.createServer();

// Import the data layer
var mongoose = require('mongoose');
var Account = require('./models/Account')(mongoose);
var config = {
  mail: require('./config/mail')
}

app.configure(function(){
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  mongoose.connect('mongodb://localhost/nodebackbone');
});

app.get('/', function(req, res){
  res.render("index.jade", {layout:false});
});

app.post('/register', function(req, res) {
  var firstName = req.param('firstName', '');
  var lastName = req.param('lastName', '');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if ( null == email || email.length < 1
       || null == password || password.length < 1 ) {
    res.send(400);
    return;
  }

  Account.register(email, password, firstName, lastName);
  res.send(200);
});

app.get('/account/authenticated', function(req, res) {
  // Never authenticated for now
  res.send(401);
});

app.post('/forgotpassword', function(req, res) {
  var email = req.param('email', null);
  if ( null == email || email.length < 1 ) {
    res.send(400);
    return;
  }

  Account.forgotPassword(email, req, res);
});

app.listen(8080);
