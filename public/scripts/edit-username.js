$(document).ready(function() {
  $(".edit-icon").click(function() {
    $(".user-name").attr("contenteditable", "true").focus();
  });

});

//SHOULD BOX AROUND NAME BE THERE OR ONLY WHEN THEY CLICK EDIT
//HOW WOULD THEY SAVE?? CMD+ENTER?? SAVE/CANCEL ICONS APPEAR NEXT TO/INSTEAD OF EDIT??
//CANCEL JUST BY CLICKING ELSEWHERE ON SCREEN???
