

//requires for the password authentication controller
var express = require('express');
var router = express.Router();
var passport = require('../config/ppConfig');

var db = require('../models');



//The basic route for a new account signup
router.get('/signup', function(req, res) {
  res.render('auth/signup');
});




router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if(created) {
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in'
      })(req, res);
    } else {
      req.flash('error','Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    req.flash('error', 'an error occurred: ' + error.message);
    res.redirect('/auth/signup');
  });
});


//basic login route
router.get('/login', function(req, res) {
  res.render('auth/login');
});



//authentication post route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You logged in'
}));


//log out route
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Logged out');
  res.redirect('/');
});

module.exports = router;
