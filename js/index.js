function DocumentReady(){
	$('.message a').click(function(){
   	$('form').animate({height: "toggle", opacity: "toggle"}, "slow");
	});
}
$(document).ready(DocumentReady);