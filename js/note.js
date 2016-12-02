var $ = jQuery;

$(document).ready(function(){
	document.getElementById("note-view").readOnly = true;
	$("#toggle_edit").toggleClass("toggled");
	$("header").load("../common.html");
	
	$("#toggle_edit").click(function() {
		$(this).toggleClass("toggled");
		toggleTextArea();
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
				console.log("Success");
			}
		});
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