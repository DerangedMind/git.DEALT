//Don't forget to create the database in psql before actually doing this migrate. Dev settings have already been set.
//Run knex.init in directory to use migration file.

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('settings', function (table){
      table.increments('id').primary(),
      table.string('name'),
      table.integer('min_players'),
      table.integer('max_players')
    }),
    knex.schema.createTable('gamedetails', function (table){
      table.increments('id').primary(),
      table.integer('settings_id').notNullable(),
      table.string('status'),
      table.integer('winner_id').nullable(),
      table.integer('players_to_auto_start')
    }),
    knex.schema.createTable('users', function (table){
      table.increments('id').primary(),
      table.string('name'),
      table.string('picture')
    }),
    knex.schema.createTable('user_games', function (table){
      table.increments('id').primary(),
      table.integer('user_id').notNullable(),
      table.integer('game_id').notNullable()
    }),
    knex.schema.createTable('gopsturns', function (table){
      table.increments('id').primary(),
      table.integer('game_id').notNullable(),
      table.integer('turn_number'),
      table.string('turn_result').nullable(),
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user_games'),
    knex.schema.dropTable('gopsturns'),
    knex.schema.dropTable('gamedetails'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('settings')
    ])
};
