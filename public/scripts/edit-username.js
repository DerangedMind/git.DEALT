$(document).ready(function() {
  var name = $(".user-name").text();
  $(".edit-icon").click(function() {
    $(".user-name").attr("contenteditable", "true").focus();
  });
  $(".user-name").focus(function (event) {
     name = $(this).text();
  })

  $(".user-name").keydown(function(e) {

    console.log(name);
    if (e.keyCode == 13) {
      $(".user-name").attr("contenteditable", "false").blur();
    }
    else if (e.keyCode == 27) {
      $(this).text(name);
      $(".user-name").attr("contenteditable", "false").blur();
    }
  });
});

$('body').scrollspy({ target: '.col-width' });

