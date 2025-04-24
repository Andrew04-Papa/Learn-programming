$("input").keypress(function(event) {
    $("h1").css("color", "yellow");
    $("h1").text(event.key);
});