const knex = require('../knexserver')
const bcrypt = require('bcryptjs')

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

function loginLocal(username, password, done) {
  knex('users')
    .whereIn('name', username)
    .select()
    .then(function(user) {
      console.log('user', user.length, password)
      if (!(user.length > 0) || !validPassword(password, user[0].oauth_id)) {

        let signupPromise = new Promise((resolve, reject) => {
          resolve(signupLocal(username, password, done))
        })
        signupPromise.then((user) => {
          return done(null, user)
        })
      }

      return done(null, user)
    })
}

function signupLocal(username, password, done) {

  knex('users')
    .insert({
      'name': username,
      'email': '',
      'pass_or_token': 'password',
      'oauth_id': generateHash(password)
    }, 'id')
    .then(function(id) {

      done(null, id)
    })
    .catch(function(err) {
      console.log(err.message)
      throw new Error('user not added to db')
    })
}

function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

function validPassword(userPassword, databasePassword = '') {
  return bcrypt.compareSync(userPassword, databasePassword)
}

module.exports = {
  loginFacebook: loginFacebook,
  signupFacebook: signupFacebook,
  loginLocal: loginLocal
}