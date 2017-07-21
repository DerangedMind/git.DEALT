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
};

//Adds cards to hand
function playCard(instance, card, user_id) {

  instance[user_id].readyCard = card;
  instance[user_id].hand.splice((card - 1), 1);
};

function roundWinner(instance, prize) {

  let highestCard = 0;
  let winner = 0;
  for (let player in instance){
    if ((instance[playCard].readyCard === highestCard)){
      highestCard = 0;
      winner = 0;
      return;
    } else if (instance[player].readyCard > highestCard){
      highestCard = instance[player].readyCard;
      winner = player;
    }
  }
  instance[winner].points += prize;
}

var gops = {

  generateHand : generateHand,
  shuffle : shuffle,
  createGameObject : createGameObject,
  addPlayer : addPlayer,
  appendPlayerToGame: appendPlayerToGame,
  playCard : playCard,
  roundWinner : roundWinner,
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