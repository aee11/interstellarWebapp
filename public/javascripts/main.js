$(document).ready(function() {
  $.material.init();
  // $.material.input();
  // $.material.radio();
  // $.material.ripples();
  $("#newEvent").click(function () {
    event.preventDefault();
    $('#eventModal').modal();
  })
  $(".list-group-item a").click(function () {
    $('#eventModal').modal();
  });
});
