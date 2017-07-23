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

    let card = $('.selected .rank').text()
    console.log(card)
    $.ajax({
      url: '/gops/'+gameid, 
      method: 'POST',
      data: {
        card: card
      }
    })
      .done(function (response) {
        $('#submit-card')
          .off('click', submitCard)
          .prop('disabled', true)
      })
      .fail(function (err) {

      })
    }

  function readyCheck() {

    let gameid = $(location).attr('href').split('/')
    gameid = gameid[gameid.length - 1]
    console.log(gameid)

    $.ajax({
      url: '/gops/'+gameid+'/ready_check'
    })
      .then(function(response) {

      })
  }

})