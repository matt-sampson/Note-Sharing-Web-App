var $ = jQuery;

function DocumentReady(){

	showCourses();

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

	$('.addCourse').click(function(){
		code = prompt("Enter a course code to add", "");
		if(code.length===0 || code === null || code === ""){
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
						showCourses();
					}
				}
			});
		}
	});

	$('.addAdmin').click(function(){
		username = prompt("Enter a username", "");
		if(username.length===0 || username === null || username === ""){
			alert("Usernames cant be empty");
		}else{
			var user = {
				"username" : username
			};

			$.ajax({
				url : "/addAdmin",
				data : user,
				method: "POST",
				success : function(response){
					if(response===false){
						alert("that user doesn't exist");
					}
					else{
						console.log("here88");
						alert(username + " is now an admin");
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