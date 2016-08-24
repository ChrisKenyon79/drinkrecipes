


//ORIGINAL AUTH CODE

//REQUIRES
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var async = ('async');
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




//This gets the profile view
app.get('/profile', isLoggedIn, function(req, res) {
  //console.log(req.user.name);
  var currentName = req.user.name;
  //console.log(currentName);
  res.render('profile', {userName: currentName});
});

app.use('/auth', require('./controllers/auth'));

//END AUTHENTICATION CODE





//THIS SUCCESSFULLY GENERATES A RANDOM RECIPE JSON

//FIX THE STYLING ON THE RETURN
//ADD INGREDIENTS TO recipespotrandom.ejs
app.get('/random', function(req, res) {
  request({

    url: 'http://www.thecocktaildb.com/api/json/v1/1/random.php',

  }, function(error, response, body) {
    var data = JSON.parse(body);
    //res.send(body);
    //res.send(data.Search);
    //console.log(body);
    res.render("partials/showrecipes", { recipe: data.drinks });
  });
});



//THIS GETS ALL DRINKS WITH THE NAME SEARCHED

app.get('/recipename', function(req, res) {

  request({

    url: 'http://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + req.query.recipename
  }, function(error, response, body) {
    console.log('into function');
    var data = JSON.parse(body);
    //res.send(body);
    //res.send(data.Search);
    //console.log(body);
    res.render("partials/showrecipes", { recipe: data.drinks });
  });
});





app.get('/ingredient', function(req, res) {

  request({
    url: 'http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + req.query.ingredient1
  }, function(error, response, body) {

    //get ingredient1 IDs into new array
    var data1 = JSON.parse(body);
    var drinkIdArray1 = [];
    for (var i = 0; i < data1.drinks.length; i++) {
      drinkIdArray1.push(data1.drinks[i].idDrink);
    }

  request({
    url: 'http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + req.query.ingredient2
  }, function(error, response, body) {

    //get ingredient2 IDs into new array
    var data2 = JSON.parse(body);
    var drinkIdArray2 = [];
    for (var i = 0; i < data2.drinks.length; i++) {
      drinkIdArray2.push(data2.drinks[i].idDrink);
    }

    //compare the 2 arrays so far, keep the matches
    //uses the function below
    var combinedIds = containsAll(drinkIdArray1, drinkIdArray2);
  
    //with Ids in array, get full recipe info for each ID
    var combinedDrinkArray = [];
    for (var i = 0; i < combinedIds.length; i++) {
      request({
        url: 'http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + combinedIds[i]
      }, function(error, response, body) {
        var data3 = JSON.parse(body);
        var data4 = data3.drinks[0];

        console.log("here is data4");
        console.log(data4);
        console.log("end of data4");

        combinedDrinkArray.push(data4);

        console.log("here is combinedDrinkArray in loop");
        console.log(combinedDrinkArray);
        console.log("end of combinedDrinkArray in loop");


      }
      );
    }


    //console.log("here is ending combinedDrinkArray");
    //console.log(combinedDrinkArray);
    //console.log("end of ending combinedDrinkArray");

    //res.send("made it to the bottom");
    //res.send(combinedDrinkArray);
    res.render("partials/showrecipes", { recipe: combinedDrinkArray.drinks });


  });
})});


function ingredient1()









function containsAll(array1, array2) {
    var output = [];
    var cntObj = {};
    var array, item, cnt;
    // for each array passed as an argument to the function
    for (var i = 0; i < arguments.length; i++) {
        array = arguments[i];
        // for each element in the array
        for (var j = 0; j < array.length; j++) {
            item = "-" + array[j];
            cnt = cntObj[item] || 0;
            // if cnt is exactly the number of previous arrays, 
            // then increment by one so we count only one per array
            if (cnt == i) {
                cntObj[item] = cnt + 1;
            }
        }
    }
    // now collect all results that are in all arrays
    for (item in cntObj) {
        if (cntObj.hasOwnProperty(item) && cntObj[item] === arguments.length) {
            output.push(item.substring(1));
        }
    }
    return(output);
};



//LISTEN
var server = app.listen(process.env.PORT || 3000);

module.exports = server;

