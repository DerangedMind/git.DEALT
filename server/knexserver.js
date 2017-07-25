require('dotenv').config()

const config = require('../db/knexfile')

const env = process.env.DATABASE_URL ? 'production' : 'development'
console.log(`



  ${env}




  `)
const knex = require('knex')(config[env])

module.exports = knex