var $ = jQuery;

function DocumentReady(){

	setAuthor();

	function  setAuthor(){
		$.ajax({
			url : "/current",
			method: "GET",
			success : function(data){
				if(data!==false){
					$("#author").text(data);
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

	$('#save').click(function(){
		var note = {
			"uploader" : $('#author').text(),
			"title" : $('#title').val(),
			"text" : $('#note-view').val(),
			"code": $('#course').text()
		};

		$.ajax({
			url : "/notesave",
			data : note,
			method: "POST",
			success : function(data){
				if (data === false){
					alert("note with that title already exists by another user");
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