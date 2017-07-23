$(() => {

  $('#submit-card').on('click', submitCard)

  $('.table li').on('click', function (event) {
    $('.selected').removeClass('selected')
    $(event.target).parents('li').addClass('selected')
    console.log($('.selected .rank').text())
  })

  function submitCard(event) {
    event.preventDefault()
    
    let card = $('.selected .rank').text()
    console.log(card)
    $.ajax({
      url: '/gops', 
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
  }
)