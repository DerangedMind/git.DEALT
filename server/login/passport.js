const LocalStrategy     = require('passport-local').Strategy
const FacebookStrategy  = require('passport-facebook').Strategy

const User              = require('./signup-fb')

const configAuth        = require('./auth')

module.exports          = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user)
  })

  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

  passport.use(new LocalStrategy(
    function(username, password, done) {

    }
  ))

  passport.use(new FacebookStrategy(
    {
      clientID        : configAuth.facebookAuth.clientID,
      clientSecret    : configAuth.facebookAuth.clientSecret,
      callbackURL     : configAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'email', 'name'],

    },
    function(token, refreshToken, profile, done) {
      process.nextTick(function() {
        User.loginFacebook(token, refreshToken, profile, done)
      })
    }
  ))
}

