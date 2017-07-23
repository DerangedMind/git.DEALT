$(() => {

  $('#submit-card').on('click', submitCard)

  $('.table li').on('click', function (event) {
    $('.selected').removeClass('selected')
    $(event.target).parents('li').addClass('selected')
    console.log($('.selected .rank').text())
  })

  function submitCard(event) {
    event.preventDefault()
    
    let gameid = $(location).attr('href').split('/')
    gameid = gameid[gameid.length - 1]
    console.log(gameid);

    let card = $('.selected .rank').text()

    if (card === '') {
      return 
    }

    console.log(card)
    $.ajax({
      url: '/gops/'+gameid, 
      method: 'POST',
      data: {
        card: card
      }
    })
      .done(function (response) {
        disableBtn()
        removeCard()
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

  function removeCard() {
    $('.selected').remove()

  }

  function readyCheck() {

    let gameid = $(location).attr('href').split('/')
    gameid = gameid[gameid.length - 1]
    console.log(gameid)

    $.ajax({
      url: '/gops/'+gameid+'/ready_check'
    })
      .then(function(ready) {
        if(ready) {
          enableBtn()
        }
        console.log('ready!')
      })
  }

  setInterval(readyCheck, 20000)

})