$(".signup").css("display", "none");

$(".signbtn").click(function(){
    $("form").animate({ height:"toggle", opacity: "toggle"}, "slow");
});

$("#showhide").click(function(){
var pass = $("#myinput");
if (pass.attr("type") == "password") {
pass.attr("type", "text");
} else {
pass.attr("type", "password");
}
})