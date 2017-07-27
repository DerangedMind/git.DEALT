let gameid = $(location).attr('href').split('/')
    gameid = gameid[gameid.length - 1]

$(() => {

  $('#submit-card').on('click', submitCard)

  $('#hand .table li').on('click', function (event) {
    $('.selected').removeClass('selected')
    $(event.target).parents('li').addClass('selected')
    console.log($('.selected .rank').text())
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
          console.log(cardPlayed)
          disableBtn()
          playCard()  
        }
      })
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
          .append(`<li>
              <div class="card back">
              </div>
            </li>`)
    removeCard()
  }

  function removeCard() {
    $('.selected').remove()

  }

  function showPlayedCards(gameInfo) {
    // go through each player and
    // show card
    // and update score


    // if turn over...
    for (let player in gameInfo.players) {
      if(gameInfo[player].ready === false) {
        continue
        $('#bets .table').html(``)
      }
      console.log(gameInfo);
      $('#bets .table')
          .append(`<li>
              <div class="card rank-${gameInfo[player].cardPlayed} hearts">
                <span class="rank">${gameInfo[player].cardPlayed}</span>
                <span class="suit">&hearts;</span>
              </div>
            </li>`)
    }
  }

  function updateScore(gameInfo) {
    for (let player in gameInfo.players) {
      console.log(player);
      $(`#player-${player}`).text(gameInfo.players[player].points)
    }
  }

  function updatePrize(gameInfo) {
    $('#prize').html(`<div class="card rank-${gameInfo.prize} spades">
              <span class="rank">${gameInfo.prize}</span>
              <span class="suit">&spades;</span>
            </div>`)
  }

  function updatePlayers(gameInfo) {

  }

  function updatePlayedCards(gameInfo) {
    console.log(gameInfo)
    $('#bets .table').html('')
    for (let player in gameInfo.players) {
      if(gameInfo.players[player].ready === false) {
        console.log('not ready');
        continue
      }
      console.log(gameInfo);
      $('#bets .table')
          .append(`<li>
              <div class="card back">
              </div>
            </li>`)
    }
  }

  function readyCheck() {

    $.ajax({
      url: '/gops/'+gameid+'/ready_check'
    })
      .then(function(gameInfo) {
        console.log('polling!')
        // readyCheck will return:
        // score, previously played cards
        updatePlayedCards(gameInfo)
        updateScore(gameInfo)
        updatePrize(gameInfo)
        showPlayedCards(gameInfo)
        
      })
  }

  setInterval(readyCheck, 5000)

})