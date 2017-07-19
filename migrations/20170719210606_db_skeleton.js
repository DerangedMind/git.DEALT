//Don't forget to create the database ib psql before actually doing this migrate. Dev settings have already been set.

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('gameSettings', function (table){
      table.increments('id').primary(),
      table.string('name'),
      table.integer('min_players'),
      table.integer('max_players')
    }),
    knex.schema.createTable('gameDetails', function (table){
      table.increments('id').primary(),
      table.integer('settings_id'),
      table.foreign('settings_id').references('gameSettings.id'),
      table.string('status'),
      table.integer('winner_id'),
      table.integer('players_to_auto_start')
    }),
    knex.schema.createTable('users', function (table){
      table.increments('id').primary(),
      table.string('name'),
      table.string('picture')
    }),
    knex.schema.createTable('user_games', function (table){
      table.increments('id').primary(),
      table.integer('user_id'),
      table.integer('game_id'),
      table.foreign('user_id').references('users.id'),
      table.foreign('game_id').references('gameDetails.id')
    }),
    knex.schema.createTable('gopsTurns', function (table){
      table.increments('id').primary(),
      table.integer('game_id'),
      table.foreign('game_id').references('gameDetails.id'),
      table.integer('turn_number'),
      table.string('turn_result')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('gameSettings'),
    knex.schema.dropTable('gameDetails'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('user_games'),
    knex.schema.dropTable('gopsTurns')
    ])
};
