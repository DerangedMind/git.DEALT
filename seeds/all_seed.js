
exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('gameSettings')
      .del()
      .then(function () {
        return knex('gameSettings').insert([
          {name: "GOBS"},
          {min_players: 2},
          {max_players: 3}
        ])
      }),
    knex('gameDetails')
    .del()
    .then(function(){
      return knex('gameDetails').insert([
          {settings_id: 0},
          {status: "In Queue"},
          {winner_id: 0},
          {players_to_auto_start: 3}
        ])
      }),
    knex("users")
    .del()
    .then(function(){
      return knex('users').insert([
        {name: "Garo"},
        {picture: "None"}
      ])
    }),
    knex('user_games')
    .del()
    .then(function(){
      return knex('user_games').insert([
        {user_id: 1},
        {game_id: 1}
      ])
    }),
    knex('gopsTurns')
    .del()
    .then(function(){
      return knex('gopsTurns').insert([
        {game_id: 1},
        {turn_number: 1},
        {turn_result: "NONE"}
      ])
    })
  ]);
};
