var $ = jQuery;

function DocumentReady(){

	setData();

	// retrieve the selected note's data and put it in the page
	function  setData(){

		$.ajax({
			url : "/currentTitle",
			method: "GET",
			success : function(foundNote){
				if(foundNote!==false){
					$("#author").text(foundNote.uploader);
					$('#title').text(foundNote.title);
					$('#note-view').val(foundNote.text);
					$('#course').text(foundNote.code);
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

	// set the note to read-only upon page load
	document.getElementById("note-view").readOnly = true;
	$("#toggle_edit").toggleClass("toggled");
	
	// toggle between edit/read-only mode
	$("#toggle_edit").click(function() {
		$(this).toggleClass("toggled");
		toggleTextArea();
	});

	// search for a course's notes using a given course code
	$('.searchCourses').click(function(){
		code = prompt("Search a course code", "");
		if(code.length===0 || code === null || code === ""){
			alert("Courses must have names");
		}else{
			var course = {
				"code" : code
			};

			$.ajax({
				url : "/searchCourse",
				data : course,
				method: "POST",
				success : function(response){
					if(response===false){
						alert("that course doesn't exist");
					}
					else{
						location.replace("http://localhost:3000/course_info?code="+response);
					}
				}
			});
		}
	});
	
	// toggle between edit/read-only mode
	$('.logOut').click(function(){
		$.ajax({
			url : "/logout",
			method: "GET",
			success : function(data){
				location.replace("http://localhost:3000/");
			}
		});
	});

	// take the user to the home page
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

	// helper function to switch between edit/read-only mode. change the text
	// on the edit button depending on the mode.
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