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

//Creates Game hardcode gameType for the time being.
function createGameObject(gameType, user_id) {
  let instance = {}

  instance.gameType = gameType;
  instance[user_id] = {};
  instance[user_id].hand = generateHand()
  instance[user_id].readyCard = 0
  instance[user_id].points = 0
  instance.prizePool = shuffle(generateHand());
  instance.autoStartPlayers = 2,
  instance.playerCount = 1

  return instance;
}

//Returns a player object.
function addPlayer() {

  let player = {}
  player.hand = generateHand();
  player.readyCard = 0;
  player.points = 0;

  return player;
}

//Adds the created player to the game.
function appendPlayerToGame(instance, user_id) {

    instance[user_id] = addPlayer()
    instance.playerCount ++;
};

//Adds cards to hand
function playCard(instance, card, user_id) {

  instance[user_id].readyCard = card;
  instance[user_id].hand.splice((card - 1), 1);
};

//Returns the winner of the round. Must be used as the argument for award points. Rerturns null should
//Two players have played the same highest card.
function roundWinner(instance) {

  let highestCard = 0;
  let winner = 0;
  let multipleHighest = false;

  for (let player in instance){
    if ((instance[player].readyCard === highestCard)){
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

//Awards points to the winner of the round. Takes the return value of roundWinner as an argument.
function awardPoints(instance, id) {

  if (id) {
    instance[id].points += instance.prizePool[0];
    instance.prizePool.splice(0, 1);
    resetReadyCard(instance);
  } else {
    let message = "Round nulled, two or more players played same card."
    instance.prizePool.splice(0, 1);
    resetReadyCard(instance);
    return message;
  }
}

//Once winner has been decided, resets hand of each player to zero.
function resetReadyCard(instance) {

  for (let player in instance) {
    if(instance[player].readyCard !== undefined){
      instance[player].readyCard = 0
    }
  }
};

//At the begginning of every round, will check to see if every player has played. Status conditional -- needs to run
//before checking a winner.
function readyCheck(instance) {

  for (let player in instance) {
    if(instance[player].readyCard === 0) {
      return false
    }
  }
  return true
}

//Cheecks to see if the game is still playable based on the number of cards in the prize pool. At zero, returns false.
function endGameCheck(instance){

  if (instance.prizePool.length === 0) {
    return true
  }
  return false
}

//Will run after having checked if game is done. If it is, will dfind the player with the highest points and return that.
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

// Will run after a player has joined the round. Returns true if the maximum number of players ahave been reached.
function startCheck(instance) {

  if (instance.playerCount === instance.autoStartPlayers){
    return true
  }
  return false
}

//will check if a player already exists in the instance. Returns true if the player doesn't exist.
function playerInGame(id, instance){
  if (instance[id] === undefined) {
    return true;
  } else {
    return false;
  }
}

function hasPlayed(id, instance) {
  if (instance[id].readyCard === 0){
    return true;
  } else {
    return false;
  }
}

var gops = {

  generateHand : generateHand,
  shuffle : shuffle,
  createGameObject : createGameObject,
  addPlayer : addPlayer,
  appendPlayerToGame: appendPlayerToGame,
  playCard : playCard,
  roundWinner : roundWinner,
  awardPoints: awardPoints,
  reset: resetReadyCard,
  readyCheck: readyCheck,
  endGameCheck: endGameCheck,
  endGame: endGame,
  startCheck: startCheck,
  playerInGame: playerInGame,
  hasPlayed: hasPlayed
}

module.exports = gops;

//TESTS
// let game1 = createGameObject("gops", 1);
// appendPlayerToGame(game1, 2);
// appendPlayerToGame(game1, 5);
// appendPlayerToGame(game1, 5);

// playCard(game1, 10, 1);
// playCard(game1, 13, 2);
// playCard(game1, 4, 5);

// roundWinner(game1, game1.prizePool.shift());

// console.log(game1);
