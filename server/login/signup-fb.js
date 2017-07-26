const knex = require('../knexserver')

function signupFacebook(profile, done, user) {
  let email = null
  if (profile.emails !== undefined) {
    email = profile.emails[0].value
  }
  knex('users')
    .insert({
      'name': profile.name.givenName,
      'email': email,
      'pass_or_token': profile.provider,
      'oauth_id': profile.id
    })
    .then(function(response) {
      done(null, user)
    })
    .catch(function(err) {
      throw new Error('user not added to db')
    })
}

function loginFacebook(token, refreshToken, profile, done) {
  knex('users')
    .whereIn('oauth_id', profile.id)
    .select('id')
    .then(function(user) {
      if (user.length !== 0) {
        return done(null, user)
      }
      else {
        return done(null, signupFacebook(profile, done, user))
      }
    })
    .catch(function(err) {
      if (err) {
        console.log(err)
        throw new Error(err.message)
      }
    })
}

module.exports = {
  loginFacebook: loginFacebook,
  signupFacebook: signupFacebook
}