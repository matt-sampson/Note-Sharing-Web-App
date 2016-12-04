var $ = jQuery;

function DocumentReady(){

	setData();

	function  setData(){

		$.ajax({
			url : "/currentTitle",
			method: "GET",
			success : function(foundNote){
				if(foundNote!==false){
					$("#author").text(foundNote.uploader);
					$('#title').val(foundNote.title);
					$('#note-view').val(foundNote.text);
					$('#course').val(foundNote.code);
				}
				else{
					$.ajax({
						url : "/current",
						method: "GET",
						success : function(currentUser){
							if(currentUser!==false){
								$("#author").text(currentUser);
							}
						}
					});
				}
			}
		});
	}

	document.getElementById("note-view").readOnly = true;
	$("#toggle_edit").toggleClass("toggled");
	
	$("#toggle_edit").click(function() {
		$(this).toggleClass("toggled");
		toggleTextArea();
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

	$('#save').click(function(){
		var note = {
			"uploader" : $('#author').text(),
			"title" : $('#title').val(),
			"text" : $('#note-view').val(),
			"code": $('#course').val()
		};

		$.ajax({
			url : "/notesave",
			data : note,
			method: "POST",
			success : function(data){
				if (data === "0"){
					alert("note with that title already exists by another user");
				}else if (data === "1"){
					alert("That course doesn't exist, beware of case sensitivity");
				}else{
					alert("changes have been saved");
				}
			}
		});
	});


	function toggleTextArea() {
		var disabled = document.getElementById("note-view").readOnly;
		if (disabled) {
			document.getElementById("note-view").readOnly = false;
			$("#toggle_edit").text("Read Only");
		}
		else {
			document.getElementById("note-view").readOnly = true;
			$("#toggle_edit").text("Edit");
		}
	}
}
$(document).ready(DocumentReady);