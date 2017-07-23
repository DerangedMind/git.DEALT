$(document).ready(() => {

  $('#create-game').on('click', function(event) {
    $.ajax({
      url: '/create',
      method: 'POST',
      data: {
      },
      success: function(){
        location.reload(true);
      }
    })
    .then(function (res) {

    })
    .catch(function(err) {
      console.log(err, 'this is an error');
    })
  })
})