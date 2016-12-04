var $ = jQuery;

function DocumentReady(){

	
	$('.addCourse').click(function(){
		code = String(prompt("Enter a course code to add", ""));

		var course = {
			"code" : code
		};

		$.ajax({
			url : "/addACourse",
			data : course,
			method: "POST",
			success : function(response){
				if(response===false){
					alert("that course already exists");
				}
				else{
					alert("course has been added");
				}
			}
		});
	});

	$('.removeCourse').click(function(){
		code = String(prompt("Enter a course code to remove", ""));

		var course = {
			"code" : code
		};

		$.ajax({
			url : "/removeACourse",
			data : course,
			method: "POST",
			success : function(response){
				if(response===false){
					alert("that course doesn't exist");
				}
				else{
					alert("course has been removed");
				}
			}
		});
	});

	$('.allCourses').click(function(){
		$.ajax({
			url : "/courses",
			method: "GET",
			success : function(data){
				var tableData= [];
				for(i=0; i<data.length; i++){
					tableData.push(data[i].code);
				}
				createTable(tableData, true);
			}
		});
	});

	$('.myNotes').click(function(){
		$.ajax({
			url : "/currentDoc",
			method: "GET",
			success : function(data){
				var tableData= [];
				for(i=0; i<data.notes.length; i++){
					tableData.push(data.notes[i].title);
				}
				createTable(tableData, false);
			}
		});
	});

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

	function createTable(tableData,noteOrCourse){
		var linkList = document.getElementById("linkTable");
		$(linkTable).empty();
		for(j=0; j<tableData.length; j++){
			var li = document.createElement("li");
			var a = document.createElement('a');
			if (noteOrCourse){
				//a.setAttribute('href', "http://localhost:3000/note");
			}
			else{
				a.setAttribute('href', "http://localhost:3000/note?title="+tableData[j]);
			}
			a.innerHTML = tableData[j];
			li.appendChild(a);
			linkList.appendChild(li);
		}
	}
}
$(document).ready(DocumentReady);