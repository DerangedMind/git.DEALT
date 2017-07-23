$(() => {

  $('#create-game').on('click', function(event) {
    $.ajax({
      url: '/create',
      method: 'POST',
      data: {

      }
    })
    .then(function (res) {
      
    })
    .catch(function(err) {
      console.log(err, 'this is an error');
    })
  })



})