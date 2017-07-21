require('dotenv').config()

const config = require('./knexfile')
const env = process.env.DATABASE_URL ? 'production' : 'development'
const knex = require('knex')(config[env])

module.exports = knex