$(() => {

  $('#submitCard').on('click', function (event) {
    event.preventDefault()
    submitCard($('#selectedCard'))
  })

  $('.card').on('click', function (event) {
    $(event.target).toggleClass('selected')
  })

  function submitCard(card) {
    $.ajax('/gops', {

    }

    })
  }

}