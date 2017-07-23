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
        })
        .returning("game_id")
    })
    .then(function(newGameID){
      allGames[newGameID[0]] = (gops.createGameObject("gops", userid))
      console.log(allGames)
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
}

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
}

//TO TRIGGER: Player submits a card
//Sets selected card as readyCard for player.
function playCard(gameid, userid, card) {

  allGames[gameid][userid].readyCard = card;
  if (gops.readyCheck(allGames[gameid])) {
    endRound(gameid)
  }
  console.log('yo')
}

//TO TRIGGER: Should run after each player submits a card,
//System will run a check to see if everyone has submitted a card. If true, decides round winner and award points.
function endRound(gameid) {

  if(gops.readyCheck(allGames[gameid])) {
    gops.awardPoints(allGames[gameid], gops.roundWinner(allGames[gameid]))
  } 
}

//TO TRIGGER: Should trigger after endRound function
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
}


//This function is responsible for checking is the status is anything but "In Queue". What I was planning on using this for was
//was to check if the function will take any given game ID and return a true or false based on that.
//This basically allows me to disable certain features if the game is not active.
function gameStatus(gameid){
  knex.select('status')
    .from('gamedetails')
    .where('id', '=', gameid)
    .then(function(row){
      let status = (row[0].status);
      if(status === "In Queue"){
        return false;
      } else {
        return true;
      }
    })
}

function getGameInfo(gameid) {
  knex.select()
      .from('user_games')
      .where('game_id', '=', gameid)
      .then( function(row) {
        let user_ids = []
        for (let users in row) {
          user_ids.push(row[users].user_id)
        }
        return user_ids
      })
}

// createGame(4);


// //TESTS
// allGames[1] = gops.createGameObject('gops', 1);
// addPlayer(1, 2);
// addPlayer(1,3);

// playHand(1,2,10);
// playHand(1,1,3);
// playHand(1,3,5);

// endRound(1);

// console.log(allGames);

const knexFunctions = {
  createGame: createGame,
  addPlayer: addPlayer,
  playCard: playCard,
  endRound: endRound,
  getGameWinner: getGameWinner,
  startGame: startGame,
  getGameInfo: getGameInfo
}

module.exports = knexFunctions;












