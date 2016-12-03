var $ = jQuery;

function DocumentReady(){

	$('.makeNote').click(function(){
		location.replace("http://localhost:3000/note");
	});
	$('.logOut').click(function(){
		$.ajax({
			url : "/logout",
			method: "GET",
			success : function(data){
				location.replace("http://localhost:3000/");
			}
		});
	});
}
$(document).ready(DocumentReady);