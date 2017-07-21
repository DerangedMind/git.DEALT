knex = require ("../knexserver");
gops = require ("../games/gopsHelpers");
allGames = require('./allGames');

//ID from cookies
function createGame(id){

  knex('gamedetails')
  .insert({
    settings_id: 1,
    status: "In Queue",
    winner_id: null,
    players_to_auto_start: 3
  })
  .returning("id")
  .then(function(gameid){
    allGames[gameid] = (gops.createGameObject("gops", id));
  })
}

//gameID from params, playerID from cookies.
function addPlayer(gameid, userid) {

  gops.appendPlayerToGame(allGames[gameid], userid);
};

//GameID and card will come from Params
function playHand(gameid, userid, card) {

  allGames[gameid][userid].readyCard = card;
}

