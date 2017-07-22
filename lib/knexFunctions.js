knex = require ("../knexserver");
gops = require ("../games/gopsHelpers");
allGames = require('./allGames');

// TO TRIGGER: Click "Create Game"
//Takes userID from cookies and creates a game object as well a database entry.
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

//TO TRIGGER: Player clicks "Join" from server list
//Using gameID from URL and userID from cookies, creates a player object in the appropriate game.
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

//TO TRIGGER: Number of players in game = max number to start game.
// Sets status of game to "Active", removing it from gamelist.
function startGame(gameid) {
  if(gops.startCheck(allGames[gameid])) {

    knex('gamedetails')
    .where('game_id', '=', gameid)
    .update({
      status: "Active"
    })
  }
};

//TO TRIGGER: Player submits a card
//Sets selected card as readyCard for player.
function playHand(gameid, userid, card) {

  allGames[gameid][userid].readyCard = card;
}

//TO TRIGGER: Should run after each player submits a card,
//System will run a check to see if everyone has submitted a card. If true, decides round winner and award points.
function winRound(gameid) {

  if(gops.readyCheck(allGames[gameid])) {
    gops.awardPoints(allGames[gameid], gops.roundWinner(allGames[gameid]))
  } else {
    return ("Waiting on other players");
  }
};

//TO TRIGGER: Should trigger after winRound function
//System will check the number of cards within the prize pool once they are zero, find the winner of the game by points
//Sets game status to "Finished", set winner_id to winner.
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



const knexFunctions = {
  createGame: createGame,
  addPlayer: addPlayer,
  playHand: playHand,
  winRound: winRound,
  winGame: winGame,
  startGame: startGame
}

module.exports = knexFunctions;












