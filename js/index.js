function DocumentReady(){
	//switch between the login and signup viewa
	$('.message a').click(function(){
   	$('form').animate({height: "toggle", opacity: "toggle"}, "slow");
	});
}
$(document).ready(DocumentReady);