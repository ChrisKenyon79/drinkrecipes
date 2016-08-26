


//ORIGINAL AUTH CODE

//REQUIRES
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var async = require('async');
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

  //var faveRecipeList = 
  //console.log(currentName);


  //pass in name AND NEW FAVORITE RECIPES
  res.render('profile', {
    userName: currentName, 
    //favoriteRecipesPassedToShow: faveRecipeList
  });
});

app.use('/auth', require('./controllers/auth'));

//END AUTHENTICATION CODE







//this shows current favorited recipes when logged in as a user
//there's a button on every shown API recipe for this
app.post('/profile/favorite', isLoggedIn, function(req, res) {
  document.getElementById('passedRecipe').value = recipe;
  console.log(recipe);


});







//this allows changes to a current favorited recipes when logged in as a user
app.get('/profile/update', isLoggedIn, function(req, res) {



});


//this deletes a current favorited recipes when logged in as a user
app.get('/profile/delete', isLoggedIn, function(req, res) {



});






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
    res.render("partials/showrecipes", { recipe: data.drinks });
  });
});





//initial function passing a callback

app.get('/ingredient', function(req, res) {

  console.log("calling get ingredient");

  initialReq(req, function(combinedDrinkArray) {
    res.render("partials/showrecipes", { recipe: combinedDrinkArray });
  });
});



//called as the original waterfall function with a callback to render 
function initialReq(req, callback) {
  var count = 0;
  var combinedDrinkArray = [];
  console.log("calling initialReq before ingredient1 req");

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

      var combinedArrayOfIds = containsAll(drinkIdArray1, drinkIdArray2);

      contReq(combinedArrayOfIds, 0, combinedDrinkArray, callback);
    });
  });
};



//called by initialReq, passback the callback to be a render of combinedDrinkArray
function contReq(combinedArrayOfIds, count, combinedDrinkArray, callback) {
  if(count === combinedArrayOfIds.length) {
    console.log('All done');
    callback(combinedDrinkArray);
  } else {
    request({
      url: 'http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + combinedArrayOfIds[count]
    }, function(error, response, body) {
      var dataParsed = JSON.parse(body);
      var dataModified = dataParsed.drinks[0];
      combinedDrinkArray.push(dataModified);
      count++;
      contReq(combinedArrayOfIds, count, combinedDrinkArray, callback);
    });
  } 
}

// function idCombinedSearch(combinedArrayOfIds, callback) {
//   for (var i = 0; i < combinedArrayOfIds.length; i++) {
//     var combinedDrinkArray = [];

//     request({
//       url: 'http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + combinedArrayOfIds[i]
//     }, function(error, response, body) {
//       var dataParsed = JSON.parse(body);
//       var dataModified = dataParsed.drinks[0];
//       combinedDrinkArray.push(dataModified);
//     });
//   }
// };

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

