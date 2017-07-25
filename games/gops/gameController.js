knex = require ("../../server/knexserver");
gops = require ("./helpers");
gops_db = require('./db');

const cardConverter = {
  "A": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10":10,
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
      gops_db[newGameID[0]] = (gops.createGameObject("gops", userid))
      console.log(gops_db)
    })
    .catch(function (err) {
      console.log(err, 'theres an error');
    })
}

//TO TRIGGER: Player clicks "Join" from server list
//Using gameID from URL and userID from cookies, creates a player object in the appropriate game. Also checks if the user is alreasdy in
//the game.
function addPlayer(gameid, userid) {
  if(!gops.playerInGame(userid, gops_db[gameid])) {
    gops.appendPlayerToGame(gops_db[gameid], userid);
    knex('user_games')
      .insert({
        user_id: userid,
        game_id: gameid
      })
      .then(function(){
        console.log("knex write successful")
      })
      .catch(function (err) {
        console.log(err)
      })
   }
}

//TO TRIGGER: Number of players in game = max number to start game.
// Sets status of game to "Active", removing it from gamelist.
function startGame(gameid) {
  if(gops.startCheck(gops_db[gameid])) {

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
  if(!gops.hasPlayed(userid, gops_db[gameid])){
      gops_db[gameid][userid].readyCard = cardConverter[card];
  } else {
    console.log("You've already played a card this round!")
  }
}

//TO TRIGGER: Should run after each player submits a card,
//System will run a check to see if everyone has submitted a card. If true, decides round winner and award points.
function endRound(gameid) {

  if(gops.readyCheck(gops_db[gameid])) {
    gops.awardPoints(gops_db[gameid], gops.roundWinner(gops_db[gameid]))
    resetHand(gameid);
    removePrize(gameid);
  }
}

//TO TRIGGER: Should trigger after endRound function
//System will check the number of cards within the prize pool once they are zero, find the winner of the game by points
//Sets game status to "Finished", set winner_id to winner.
function getGameWinner(gameid) {

  if(gops.endGameCheck(gops_db[gameid])) {
    let gameWinner = gops.endGame(gops_db[gameid]);

    knex('gamedetails')
      .where('id', '=', gameid)
      .update({
        status :"Finished",
        winner_id : gameWinner
      }).then(function(){
        console.log("I RAN AND I FOUND A WINNER")
      })
  }
}

function cardValid(gameid, userid, card){
  if(gops_db[gameid][userid].hand[card - 1] !== null){
    return true
  }
  return false
}

function showPlayedList(gameid) {
  let playedCards = { }

  for (let players in gops_db[gameid]) {
    playedCards[players] = { }
    playedCards[players].cardPlayed = gops_db[gameid][players].readyCard
    playedCards[players].score = gops_db[gameid][players].points
  }
  playedCards.ready = (showPlayedCount === 2)

  return playedCards
}

function showPlayedCount(gameid) {
  let playedCounter = 0

  for (let players in gops_db[gameid]) {
    if (gops_db[gameid][players].readyCard > 0) {
      playedCounter++
    }
  }
  return playedCounter
}

function showPlayerPlayed(gameid, userid) {
  if (gops_db[gameid][userid].readyCard > 0) {
    return true
  }
  else return false
}

//When called, shows a given player's hand
function showHand(gameid, userid){
  return gops_db[gameid][userid].hand;
}

//When called, shows points for a given user.
function showPoints(gameid, userid) {
  return gops_db[gameid][userid].points;
}

function showCard(gameid, userid) {
  let readyCard = gops_db[gameid][userid].readyCard;
    for (let card in cardConverter){
      if (cardConverter[card] === readyCard) {
        readyCard = card
      }
    }
  return readyCard;
}

//When called, shows current prize for the round.
function showPrize(gameid) {
  return gops_db[gameid].prizePool[0];
}

//When called, will reset the hand of all players to 0.
function resetHand(gameid) {

  for(let player in gops_db[gameid]){
    if(gops_db[gameid][player].readyCard !== undefined){
      gops_db[gameid][player].readyCard = 0
    }
  }
}

//When called, will remove the prize card from the pool
function removePrize(gameid){
  gops_db[gameid].prizePool.splice(0,1);
  console.log(gops_db[gameid]);
}

//Removes card from hand
function removeCard(gameid, userid, card){
  for (let i = 0; i < gops_db[gameid][userid].hand.length; i++){
    if(gops_db[gameid][userid].hand[i] == card){
      gops_db[gameid][userid].hand.splice(i, 1);
    }
  }
};

// // TESTS

// gops_db[1] = gops.createGameObject('gops', 1);

// addPlayer(1,2);

// playCard(1,2,"J");
// playCard(1,1,3);

// endRound(1);

// // removePrize(1);
// // resetHand(1);


console.log(gops_db);

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
  showPlayerPlayed: showPlayerPlayed,
  removeCard: removeCard
}

module.exports = knexFunctions;
