knex = require ("../knexserver");
gops = require ("../games/gopsHelpers");
allGames = require('./allGames');

//ID from cookies
function createGame(userid){

  knex('gamedetails')
  .insert({
    settings_id: 1,
    status: "In Queue",
    winner_id: null,
    players_to_auto_start: 3
  })
  .returning("id")
  .then(function(gameid){
    return knex('user_games')
    .insert({
      user_id: userid,
      game_id: gameid[0]
    }).returning("game_id")
  }).then(function(gid){
    allGames[gid[0]] = (gops.createGameObject("gops", userid));
    console.log(allGames);
  })
}

//gameID from params, playerID from cookies.
function addPlayer(gameid, userid) {

  gops.appendPlayerToGame(allGames[gameid], userid);

  knex('user_games')
  .insert({
    user_id: userid,
    game_id: gameid
  })
  .then(function(){
    console.log("knex write successful")
  })
  console.log(allGames);
};

//GameID and card will come from Params
function playHand(gameid, userid, card) {

  allGames[gameid][userid].readyCard = card;
}

function winRound(gameid) {

  if(gops.readyCheck(allGames[gameid])) {
    gops.awardPoints(allGames[gameid], gops.roundWinner(allGames[gameid]))
  } else {
    return ("Waiting on other players");
  }
};

function winGame(gameid) {

  if(gops.gameCheck(allGames[gameid])) {

    let gameWinner = gops.endGame(allGames[gameid]);

    knex('gamedetails')
    .where('id', '=', gameid)
    .update({
      status = "Finished",
      winner_id = gameWinner
    })
  }
};

/* Now then, the hardest function. Let's list what we need to do. MODULATE. I need to run a logical condition that would reference the
number of players within a game and the number of players required for the game to run, which means I need to run a logical 'if' within
knex. GOT IT */

function startGame(gameid) {
  if(gops.startCheck(allGames[gameid])) {

    knex('gamedetails')
    .where('game_id', '=', gameid)
    .update({
      status: "Active"
    })
  }
};

const knexFunctions = {
  createGame: createGame,
  addPlayer: addPlayer,
  playHand: playHand,
  winRound: winRound,
  winGame: winGame,
  startGame: startGame
}

module.exports = knexFunctions;












