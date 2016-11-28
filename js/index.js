$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

$('.createAccount').click(function(){
	var query = {
		"username" : $('.usernameInput').val(),
		"password" : $('.passwordInput').val(),
		"email" : $('.emailInput').val()
	}

	$.ajax({
		url : "/signup",
		data : query,
		method: "POST",
		success : function(data){
			console.log("Success");
		}
	});
	console.log($('.passwordInput').val());
});