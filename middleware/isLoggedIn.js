module.exports = function(req, res, next) {
  if(!req.user) {
    req.flash('error', 'You must be logged in to access');
    res.redirect('/auth/login');
  } else {
    next();
  }
}