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



//SHOULD BOX AROUND NAME BE THERE OR ONLY WHEN THEY CLICK EDIT
//HOW WOULD THEY SAVE?? CMD+ENTER?? SAVE/CANCEL ICONS APPEAR NEXT TO/INSTEAD OF EDIT??
//CANCEL JUST BY CLICKING ELSEWHERE ON SCREEN???
