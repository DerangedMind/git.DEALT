exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('settings')
      .del()
      .then(function () {
        return knex.raw('ALTER SEQUENCE ' + 'settings_id_seq' + ' RESTART WITH 1').then(function() {
          return knex('settings').insert([{
            name: "GOBS",
            min_players: 2,
            max_players: 3
          }])
      })}),
    knex("users")
    .del()
    .then(function(){
      return knex.raw('ALTER SEQUENCE ' + 'users_id_seq' + ' RESTART WITH 1').then(function() {
        return knex('users').insert([{
          name: "Garo",
          picture: "None"
        },
        {
          name: "Rikki",
          picture: "NONE"
        },
        {
          name: "Julie",
          picture: "NONE"
        }
        ])
      })
    }),
    knex('gamedetails')
    .del()
    .then(function(){
      return knex.raw('ALTER SEQUENCE ' + 'gamedetails_id_seq' + ' RESTART WITH 1').then(function() {
        return knex('gamedetails').insert([{
          settings_id: 1,
          status: "In Queue",
          winner_id: null,
          players_to_auto_start: 3
          },
          {
            settings_id: 1,
            status: "In Queue",
            winner_id: null,
            players_to_auto_start: 3
          },
          {
            settings_id: 1,
            status: "Active",
            winner_id: null,
            players_to_auto_start: 3
          },
          {
            settings_id: 1,
            status: "Finished",
            winner_id: 1,
            players_to_auto_start: 3
          }
          ])
        })
      }),
    knex('user_games')
    .del()
    .then(function(){
      return knex.raw('ALTER SEQUENCE ' + 'user_games_id_seq' + ' RESTART WITH 1').then(function() {
        return knex('user_games').insert([{
          user_id: 1,
          game_id: 1
        },
        {
          user_id: 2,
          game_id: 1
        },
        {
          user_id: 3,
          game_id: 1
        }
        ])
      })
    }),
    knex('gopsturns')
    .del()
    .then(function(){
      return knex.raw('ALTER SEQUENCE ' + '"gopsturns_id_seq"' + ' RESTART WITH 1').then(function() {
        return knex('gopsturns').insert([{
          game_id: 1,
          turn_number: 1,
          turn_result: "NONE"
        }])
      })
    })
  ]);
};

