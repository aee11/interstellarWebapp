$(document).ready(function() {
  $.material.init();
  $("#newEvent").click(function () {
    event.preventDefault();
    $('#eventModal').modal();
  })
  $(".list-group-item a").click(function () {
    $('#eventModal').modal();
  });
});
