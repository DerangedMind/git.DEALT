const knex = require('../knexserver')

module.exports = {
  addUser: function (user) {
    console.log('adding user');
    if (user.provider !== null) {
      let pass_or_token = 'token'
    } 
    else {
      let pass_or_token = 'pass'
    }
    
    
  },

  verifyUserExists: function(token, refreshToken, profile, done) {
    knex('users')
            .whereIn('oauth_id', profile.id)
            .select('id')
            .then(function(user) {
              if (user.length !== 0) {
                console.log('user exists?')
                return done(null, user)
              }
              else {
                console.log(profile)
                console.log(profile.emails)
                let email = profile.emails[0].value || null
                knex('users')
                  .insert({
                    'name': profile.name.givenName,
                    'email': email,
                    'pass_or_token': profile.provider,
                    'oauth_id': profile.id
                  })
                  .then(function(response) {
                    console.log('user added: ' + user.name)
                    done(null, user)
                  })
                  .catch(function(err) {
                    throw new Error('user not added to db')
                  })
              }
            })
            .catch(function(err) {
              if (err) {
                console.log(err)
                throw new Error(err.message)
              }
            })
          }
}