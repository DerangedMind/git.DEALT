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
  }).then(function(newGameID){
    allGames[newGameID[0]] = (gops.createGameObject("gops", userid));
    console.log(allGames);
  })
}

//TO TRIGGER: Player clicks "Join" from server list
//Using gameID from URL and userID from cookies, creates a player object in the appropriate game. Also checks if the user is alreasdy in
//the game.
function addPlayer(gameid, userid) {
  if(gops.playerExists(userid, allGames[gameid])){
    gops.appendPlayerToGame(allGames[gameid], userid);

    knex('user_games')
    .insert({
      user_id: userid,
      game_id: gameid
    })
    .then(function(){
      console.log("knex write successful")
    })
  } else {
    console.log("Player Exists!");
  }
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
//Sets selected card as readyCard for player. Will also check to see if that player has played a card already this round.
function playCard(gameid, userid, card) {
  if(gops.hasPlayed(userid, allGames[gameid])){
    allGames[gameid][userid].readyCard = card;
  } else {
  console.log("You've already played a card this round!")
  }
};

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
function getGameWinner(gameid) {

  if(gops.gameCheck(allGames[gameid])) {
    let gameWinner = gops.endGame(allGames[gameid]);

    knex('gamedetails')
    .where('id', '=', gameid)
    .update({
      status :"Finished",
      winner_id : gameWinner
    })
  }
};


//TO TRIGGER: When someone joins a game.
//This is a function that will check to see if a game is in Q. If it is, then the game can't start. If it isn't, then the game CAN start.
//The callbacks: inQ will not let anybody get into the game instance. outQ will allow only the players that in the game to get inside the
//instance.
function gameStatus(gameid, inQ, outQ){
  knex.select('status')
  .from('gamedetails')
  .where('id', '=', gameid)
  .then(function(row){
    let status = (row[0].status);
    if(status === "In Queue"){
      inQ;
    } else {
      outQ;
    }
  })
}

//Running this will return an array containing all the games for a given user and run a callback on that.
function getGames(userid, callback){
  knex.select('gamedetails.id', 'status')
  .from('gamedetails')
  .innerJoin('user_games', 'user_games.game_id', 'gamedetails.id')
  .where('user_games.user_id', '=', userid)
  .then(function(rows){
    callback(rows);
  })
}


//Running this will return the id of all the games that are currently in Queue and will run a callback on them.
//NOTE That it is returning an array of objects.
function getQueue(callback) {
  knex.select('id')
  .from('gamedetails')
  .where('status', '=', 'In Queue')
  .then(function(rows){
    callback(rows);
  })
}

//Example callback that prints everything.
function print(arr) {
  console.log(arr);
}


// //TESTS
// allGames[1] = gops.createGameObject('gops', 1);

// addPlayer(1,2);
// addPlayer(1,3);

// playCard(1,2,10);
// playCard(1,1,3);
// playCard(1,3,5);

// winRound(1);

// console.log(allGames);

const knexFunctions = {
  createGame: createGame,
  addPlayer: addPlayer,
  playCard: playCard,
  winRound: winRound,
  getGameWinner: getGameWinner,
  startGame: startGame,
  getGames: getGames,
  getQueue: getQueue
}

module.exports = knexFunctions;












