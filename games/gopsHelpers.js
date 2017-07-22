//Generates array 1-13 as cards.
function generateHand() {
  let hand = [];
  for (let i = 1; i <=13; i++) {
    hand.push(i);
  }
  return hand;
}

//Generates array 1-13 randomly ordered
function shuffle(arr) {
    for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
};

//Creates Game
function createGameObject(gameType, user_id) {
  let instance = {}

  instance.gameType = gameType;
  instance[user_id] = {};
  instance[user_id].hand = generateHand()
  instance[user_id].readyCard = 0
  instance[user_id].points = 0
  instance.prizePool = shuffle(generateHand());
  instance.maxPlayers = 3,
  instance.playerCount = 1

  return instance;
}

//Adds player to game
function addPlayer() {

  let player = {}
  player.hand = generateHand();
  player.readyCard = 0;
  player.points = 0;

  return player;
}

function appendPlayerToGame(instance, user_id) {

  instance[user_id] = addPlayer()
  instance.playerCount ++;
};

//Adds cards to hand
function playCard(instance, card, user_id) {

  instance[user_id].readyCard = card;
  instance[user_id].hand.splice((card - 1), 1);
};

//Returns the winner of the round. Must be used as the argument for award points.
function roundWinner(instance) {

  let highestCard = 0;
  let winner = 0;
  let multipleHighest = false;

  for (let player in instance){
    if ((instance[playCard].readyCard === highestCard)){
      multipleHighest = true;
    } else if (instance[player].readyCard > highestCard){
      highestCard = instance[player].readyCard;
      multipleHighest = false
      winner = player;
    }
  }
  if (multipleHighest === false) {
    return winner;
  } else {
    return null;
  }
};

function awardPoints(instance, id) {

  if (id) {
    instance[id].points += instance.prizePool[0];
    instance.prizePool.splice(0, 1);
    reset(instance);
  } else {
    let message = "Round nulled, two or more players played same card."
    instance.prizePool.splice(0, 1);
    reset(instance);
    return message;
  }
}

function reset(instance) {

  for (let player in instance) {
    instance[playCard].readyCard = 0
  }
};

function readyCheck(instance) {

  let ready = true;
  for (let player in instance) {
    if(instance[player].readyCard === 0) {
      ready = false;
    }
  }
  return ready;
}

function gameCheck(instance){

  let status = true;
  if (instance.prizePool.length === 0) {
    status = false
  }
  return status;
}

function endGame (instance) {

  let gameWinner = 0;
  let totalPoints = 0;

  for (let player in instance) {
    if ((instance[player].points) > totalPoints){
      totalPoints = instance[player].points;
      gameWinner = player;
    }
  }
  return gameWinner;
}

function startCheck(instance) {
  status = false;
  if (instance.playerCount === instance.maxPlayers){
    status = true;
  }
  return status;
}

var gops = {

  generateHand : generateHand,
  shuffle : shuffle,
  createGameObject : createGameObject,
  addPlayer : addPlayer,
  appendPlayerToGame: appendPlayerToGame,
  playCard : playCard,
  roundWinner : roundWinner,
  awardPoints: awardPoints.
  reset: reset,
  readyCheck: readyCheck,
  gameCheck: gameCheck,
  endGame: endGame,
  startCheck: startCheck
}

module.exports = gops;


// let game1 = createGameObject("gops", 1);
// appendPlayerToGame(game1, 2);
// appendPlayerToGame(game1, 5);

// playCard(game1, 10, 1);
// playCard(game1, 13, 2);
// playCard(game1, 4, 5);

// roundWinner(game1, game1.prizePool.shift());

// console.log(game1);