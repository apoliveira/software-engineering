var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user.js");

passport.use("login", new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    User.findOne({ email : username }, function(err, user) {
      if (err) { return done(err); }
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: req.flash('info', 'Incorrect username or password.') });
      }
      return done(null, user);
    });
  }
));

passport.use("signup", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    User.findOne({ email : username }, function(err, user) {
      if(err) { return done(err, false, { message: req.flash('info', 'There was an error creating your account.') } ); }
      if(user) {
        return done(null, false, { message: req.flash('info', 'That email is already being used.') });
      }
      if( password != req.body.confirmPassword ) {
        return done(null, false, { message: req.flash('info', 'The password and confirmation must match.') });
      }
      var user = new User({
        name: req.body.name,
        email: username,
        password: User.generateHash(password)
      });
      user.save(function(err){
        if(err) {
            return done(null, false, { message: req.flash('info', 'We couldn\'t create your account. If this persists please contact us.') });
        }
          return done(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
