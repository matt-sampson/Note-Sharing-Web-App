var $ = jQuery;

$(document).ready(function(){
	document.getElementById("note-view").readOnly = true;
	$("#toggle_edit").toggleClass("toggled");
	$("header").load("../common.html");
	
	$("#toggle_edit").click(function() {
		$(this).toggleClass("toggled");
		toggleTextArea();
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