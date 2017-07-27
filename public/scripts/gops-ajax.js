let gameid = $(location).attr('href').split('/')
    gameid = gameid[gameid.length - 1]
let gameOver = false

$(() => {

  let currentPrize = $('#prize .rank').text()

  $('#submit-card').on('click', submitCard)

  $('#hand .table li').on('click', function (event) {
    $('.selected').removeClass('selected')
    $(event.target).parents('li').addClass('selected')
  })

  function submitCard(event) {
    event.preventDefault()

    let card = $('.selected .rank').text()
    if (card === '') {
      return
    }

    $.ajax({
      url: '/gops/'+gameid,
      method: 'POST',
      data: {
        card: card
      }
    }).done(function (cardPlayed) {
        if (cardPlayed) {
          disableBtn()
          playCard()  
        }
      })
  }

  function readyCheck() {
    if (!gameOver) {
      $.ajax({
        url: '/gops/'+gameid+'/ready_check'
      })
        .then(function(gameInfo) {
          console.log('polling!')
          // readyCheck will return:
          // score, previously played cards
          if (gameInfo.prize === undefined) {
            return endGame(gameInfo)
          }
          updatePlayedCards(gameInfo)
          updateScore(gameInfo)
          updatePrize(gameInfo)
          showPlayedCards(gameInfo)     
        })
    }
  }

  function disableBtn() {
    $('#submit-card')
          .text('Waiting for other players...')
  }

  function enableBtn() {
    $('#submit-card')
          .html('<button class="btn btn-default" >Submit Card</button>')
          .on('click', submitCard)
  }

  function playCard() {
    $('#bets .table')
          .append(drawCardBack())
    removeCard()
  }

  function drawCardBack() {
    return `<li>
              <div class="card back">
              </div>
            </li>`
  }

  function drawCardFront(card, suit) {
    return `<li>
              <div class="card rank-${card} ${suit}">
                <span class="rank">${card}</span>
                <span class="suit">&${suit};</span>
              </div>
            </li>`

  }

  function removeCard() {
    $('.selected').remove()

  }

  function showPlayedCards(gameInfo) {
    // go through each player and
    // show card
    // and update score
    // if turn over...
    // for (let player in gameInfo.players) {
    //   if(gameInfo.players[player].ready === false) {
    //     continue
    //   }
    //   $('#bets .table').html(``)
    //   console.log(gameInfo);
    //   $('#bets .table')
    //       .append(drawCardFront(gameInfo.players[player].cardPlayed), 'hearts')
    // }
  }

  function updateScore(gameInfo) {
    for (let player in gameInfo.players) {
      $(`#player-${player} .score`).text(gameInfo.players[player].points)
    }
  }

  function updatePrize(gameInfo) {
    if (gameInfo.prize === undefined) {
      endGame(gameInfo)
    }
    if (gameInfo.prize !== currentPrize) {
      currentPrize = gameInfo.prize
      $('#prize').html(drawCardFront(gameInfo.prize, 'spades'))
      enableBtn()  
    }
  }

  function endGame(gameInfo) {
    gameOver = true
    let finalScore = 0
    let winner = ''

    for (let player in gameInfo.players) {
      if (gameInfo.players[player].points > finalScore) {
        finalScore = $(`#player-${player} .score`).text()
        winner = $(`#player-${player}`).text()
      }
    }
    $('#win-check').html(`<div>WINNNER ${winner}</div>`)
  }

  function updatePlayers(gameInfo) {

  }

  function updatePlayedCards(gameInfo) {
    $('#bets .table').html('')
    for (let player in gameInfo.players) {
      if(gameInfo.players[player].ready === true) {
        console.log(gameInfo.players[player].ready)
        console.log(player)
        $('#bets .table')
          .append(drawCardBack())
      }
      
    }
  }

  setInterval(readyCheck, 5000)

})