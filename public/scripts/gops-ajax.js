$(() => {

  $('#submit-card').on('click', submitCard)

  $('#hand .table li').on('click', function (event) {
    $('.selected').removeClass('selected')
    $(event.target).parents('li').addClass('selected')
    console.log($('.selected .rank').text())
  })

  function submitCard(event) {
    event.preventDefault()

    let gameid = $(location).attr('href').split('/')
    gameid = gameid[gameid.length - 1]

    let card = $('.selected .rank').text()

    if (card === '') {
      return
    }

    $.ajax({
      url: '/gops/'+gameid,
      method: 'POST',
      data: {
        card: card
      },
      success: function(){
        location.reload(true);
      }
    })
      .done(function (response) {
        disableBtn()
        playCard(card)
      })
      .fail(function (err) {

      })
  }

  function disableBtn() {
    $('#submit-card')
          .off('click', submitCard)
          .prop('disabled', true)
          .text('Waiting for other players...')
  }

  function enableBtn() {
    $('#submit-card')
          .html('<button class="btn btn-default" >Submit Card</button>')
          .on('click', submitCard)
  }

  function playCard(card) {
    $('#prizes .table')
          .append(`<li>
              <div class="card rank-${card} hearts">
                <span class="rank">${card}</span>
                <span class="suit">&hearts;</span>
              </div>
            </li>`)
    removeCard()
  }

  function removeCard() {
    $('.selected').remove()

  }

  function revealCards(gameObject) {
    // go through each player and
    // show card
    // and update score
    $('#prizes .table').html(``)

    for (let player in gameObject) {
      $('#prizes .table')
          .append(`<li>
              <div class="card rank-${gameObject[player].cardPlayed} hearts">
                <span class="rank">${gameObject[player].cardPlayed}</span>
                <span class="suit">&hearts;</span>
              </div>
            </li>`)
    }
  }

  function updateScore(gameObject) {
    for (let player in gameObject) {
      $(`#player-${player}`).text(gameObject[player].score)
    }
  }

  function updateHiddenCards() {
    //bonus
  }

  function readyCheck() {

    let gameid = $(location).attr('href').split('/')
    gameid = gameid[gameid.length - 1]

    $.ajax({
      url: '/gops/'+gameid+'/ready_check'
    })
      .then(function(game) {
        // readyCheck will return:
        // score, previously played cards
        if(game.ready) {
          enableBtn()
          revealCards(game)
          updateScore(game)
        }
        else {
          updateHiddenCards()
        }
        console.log('polling!')
      })
  }

  setInterval(readyCheck, 20000)

})