knex = require ("../knexserver");
gops = require ("../games/gopsHelpers");
allGames = require('./allGames');

const cardConverter = {
  "A": 1,
  "J": 11,
  "Q": 12,
  "K": 13
}

// TO TRIGGER: Click "Create Game"
//Takes userID from cookies and creates a game object as well a database entry.
function createGame(userid){

  knex('gamedetails')
  .insert({
    settings_id: 1,
    status: "In Queue",
    winner_id: null,
    players_to_auto_start: 2
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
    .catch(function (err) {
      console.log(err, 'theres an error');
    })
}

//TO TRIGGER: Player clicks "Join" from server list
//Using gameID from URL and userID from cookies, creates a player object in the appropriate game. Also checks if the user is alreasdy in
//the game.
function addPlayer(gameid, userid) {
  console.log(`


      if not working



      `)
  if(!gops.playerInGame(userid, allGames[gameid])){
    console.log(`


      player not in game



      `)
    gops.appendPlayerToGame(allGames[gameid], userid);
    console.log(`



      appending player to game



      `)
    knex('user_games')
      .insert({
        user_id: userid,
        game_id: gameid
      })
      .then(function(){
        console.log("knex write successful")
      })
      .catch(function (err) {
        console.log(`


          error



          `)
      })
   }
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
//Sets selected card as readyCard for player. Will also check to see if that player has played a card already this round.
function playCard(gameid, userid, card) {
  if(!gops.hasPlayed(userid, allGames[gameid])){
    if(typeof card === "string"){
      allGames[gameid][userid].readyCard = cardConverter[card];
    } else {
      allGames[gameid][userid].readyCard = card;
    }
  } else {
    console.log("You've already played a card this round!")
  }
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

  if(gops.endGameCheck(allGames[gameid])) {
    let gameWinner = gops.endGame(allGames[gameid]);

    knex('gamedetails')
      .where('id', '=', gameid)
      .update({
        status :"Finished",
        winner_id : gameWinner
      })
  }
}

function cardValid(gameid, userid, card){
  if(allGames[gameid][userid].hand[card - 1] !== null){
    return true
  }
  return false
}

function showPlayedCount(gameid) {
  let playedCounter = 0
  
  for (let players in allGames[gameid]) {
    if (allGames[gameid][players].readyCard > 0) {
      playedCounter++
    }
  }
  return playedCounter
}

function showPlayerPlayed(gameid, userid) {
  if (allGames[gameid][userid].readyCard > 0) {
    return true
  }
  else return false
}

//When called, shows a given player's hand
function showHand(gameid, userid){
  return allGames[gameid][userid].hand;
}

//When called, shows points for a given user.
function showPoints(gameid, userid) {
  return allGames[gameid][userid].points;
}

function showCard(gameid, userid) {
  let readyCard = allGames[gameid][userid].readyCard;

  if (readyCard === 1 || readyCard > 10) {
    for (let card in cardConverter){
      if (cardConverter[card] === readyCard) {
        readyCard = card
      }
    }
  }
  return readyCard;
}

//When called, shows current prize for the round.
function showPrize(gameid) {
  return allGames[gameid].prizePool[0];
}

//When called, will reset the hand of all players to 0.
function resetHand(gameid) {

  for(let player in allGames[gameid]){
    if(allGames[gameid][player].readyCard !== undefined){
      allGames[gameid][player].readyCard = 0
    }
  }
}

//When called, will remove the prize card from the pool
function removePrize(gameid){
  allGames[gameid].prizePool.splice(0,1);
}



// TESTS
// allGames[1] = gops.createGameObject('gops', 1);

// addPlayer(1,2);

// playCard(1,2,"J");
// playCard(1,1,3);

// endRound(1);

// removePrize(1);
// resetHand(1);


console.log(allGames);

const knexFunctions = {
  createGame: createGame,
  addPlayer: addPlayer,
  playCard: playCard,
  endRound: endRound,
  getGameWinner: getGameWinner,
  startGame: startGame,
  showHand: showHand,
  showPoints: showPoints,
  showPrize: showPrize,
  showCard: showCard,
  resetHand: resetHand,
  removePrize: removePrize,
  cardValid: cardValid,
  showPlayedCount: showPlayedCount,
  showPlayerPlayed: showPlayerPlayed
}

module.exports = knexFunctions;
