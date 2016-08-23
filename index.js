


//ORIGINAL AUTH CODE


//REQUIRES
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var request = require('request');
var isLoggedIn = require('./middleware/isLoggedIn');
var app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.use(session({
  secret: process.env.SESSION_SECRET || 'abcdefghijklmnopqrstuvwxyz',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));

//END AUTHENTICATION CODE



//THIS SUCCESSFULLY GENERATES A RANDOM RECIPE JSON

//THIS IS NOW THE FRONT PAGE FIX THIS

// app.get('/', function(req, res) {
//   //console.log(process.env.SEARCH_TERM);
//   //res.render('index');
//   var qs = {
//     //s: process.env.SEARCH_TERM, 
//     s: 'margarita', 
//     //plot: 'short', 
//     //r: 'json'
//   }
//   request({
//     //url: 'http://omdbapi.com', 
//     url: 'http://www.thecocktaildb.com/api/json/v1/1/random.php',
//     qs: qs
//   }, function(error, response, body) {
//     console.log('into function');
//     var data = JSON.parse(body);
//     res.send(body);
//     //res.send(data.Search);
//     console.log(body);
//   });
// });















//LISTEN
var server = app.listen(process.env.PORT || 3000);

module.exports = server;



