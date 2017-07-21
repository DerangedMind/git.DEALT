require('dotenv').config()
// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: process.env.DEV_HOST,
      user: process.env.DEV_USER,
      password: process.env.DEV_PASSWORD,
      database: process.env.DEV_DATABASE
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    ssl: true
  }

};
