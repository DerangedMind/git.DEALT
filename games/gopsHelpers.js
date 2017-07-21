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
function createGameObject(game_id, user_id) {
  let instance = {}

  instance.game_id = game_id
  instance[user_id] = generateHand();
  instance.prizePool = shuffle(generateHand());
  instance.currentCards = {};
  instance.currentCards[user_id] = 0
  instance.points = {};
  instance.points[user_id] = 0;

  return instance;
}

//Adds player to game
function addPlayer(gameObj, user_id) {

  gameObj[user_id] = generateHand();
  gameObj.currentCards[user_id] = 0;
  gameObj.points[user_id] = 0
}




