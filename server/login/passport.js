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

  passport.use(new LocalStrategy( {
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) {
      process.nextTick(function () {
        let login = new Promise((resolve, reject) => {
          User.loginLocal(username, password, done) 
        })
        login.then(function (user) {
          console.log('login local complete', user)
        })    
      })
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

