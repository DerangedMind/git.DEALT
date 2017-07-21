
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('gopsprize', function(table){
      table.increments('id').primary(),
      table.string('prize'),
      table.integer('game_id')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all ([
    knex.schema.dropTable('gopsprize')
  ])
};
