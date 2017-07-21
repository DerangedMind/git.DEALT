
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.string('email')
      table.string('pass_or_token')
      table.string('token')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
     table.dropColumns('email', 'pass_or_token', 'token')
    })
  ])
};
