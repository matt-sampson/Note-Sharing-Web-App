var $ = jQuery;

function DocumentReady(){


	setData();

	function  setData(){

		$.ajax({
			url : "/currentCode",
			method: "GET",
			success : function(foundCourse){
				if(foundCourse!==false){
					$("#course").html(foundCourse.code);
				}
			}
		});
	}


	$('.logOut').click(function(){
		$.ajax({
			url : "/logout",
			method: "GET",
			success : function(data){
				location.replace("http://localhost:3000/");
			}
		});
	});

	$('.homePage').click(function(){
		$.ajax({
			url : "/currentDoc",
			method: "GET",
			success : function(data){
				if (data.admin){
					location.replace("http://localhost:3000/admin_home_page.html");
				}
				else{
					location.replace("http://localhost:3000/user_home_page.html");
				}
			}
		});
	});

}
$(document).ready(DocumentReady);