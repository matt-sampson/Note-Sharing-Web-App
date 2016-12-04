var $ = jQuery;

function DocumentReady(){

	showCourses();

	$('.addCourse').click(function(){
		code = String(prompt("Enter a course code to add", ""));
		if(code.length===0 || code === null){
			alert("Courses must have names");
		}else{
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
		}
	});

	$('.removeCourse').click(function(){
		code = String(prompt("Enter a course code to remove", ""));
		if(code.length===0 || code === null){
			alert("Courses must have names");
		}else{
			var course = {
				"code" : code
			};

			$.ajax({
				url : "/removeCourse",
				data : course,
				method: "POST",
				success : function(response){
					if(response===false){
						alert("that course doesnt exists");
					}
					else{
						alert("course has been removed");
					}
				}
			});
		}
	});

	$('.allCourses').click(function(){
		showCourses();
	});

	function showCourses(){
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
	}

	$('.myNotes').click(function(){
		$.ajax({
			url : "/currentDoc",
			method: "GET",
			success : function(data){
				var tableData= [];
				for(i=0; i<data.notes.length; i++){
					tableData.push(data.notes[i].title);
				}
				if(tableData.length!==0){
					createTable(tableData, false);
				}
				else{
					var linkList = document.getElementById("linkTable");
					$(linkTable).empty();
					var p = document.createElement("p");
					p.innerHTML = "You haven't made any notes yet";
					linkList.appendChild(p);
				}
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
				a.setAttribute('href', "http://localhost:3000/course_info?code="+tableData[j]);
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