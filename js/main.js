var $ = jQuery;

function DocumentReady(){

	showCourses();


	//search for a given course using a prompt input
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
					//if the course exists then navigate to its information page
					else{
						location.replace("http://localhost:3000/course_info?code="+response);
					}
				}
			});
		}
	});

	//add a course by getting the admin to enter the course code into a prompt input
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
						showCourses(); //once the course has been added, show all courses in the database
					}
				}
			});
		}
	});

	//an admin has the capability of making another user become an admin and this is done through a prompt input
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
						alert(username + " is now an admin");
					}
				}
			});
		}
	});

	$('.allCourses').click(function(){
		showCourses();
	});

	//get all course codes, then store them in an array so that they can be passed to the table creating function
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


	//get all note titles for the logged in user, then store them in an array so that they can be passed to the table creating function
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
				//if no notes exist for the logged in user then display a message telling the user that
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

	//navigate to the page where the user can make notes
	$('.makeNote').click(function(){
		location.replace("http://localhost:3000/note");
	});

	//log the user out 
	$('.logOut').click(function(){
		$.ajax({
			url : "/logout",
			method: "GET",
			success : function(data){
				location.replace("http://localhost:3000/");
			}
		});
	});


	//function for creating a list of either links of course codes or links of note titles
	function createTable(tableData,noteOrCourse){
		var linkList = document.getElementById("linkTable");
		$(linkTable).empty();
		for(j=0; j<tableData.length; j++){
			var li = document.createElement("li");
			var a = document.createElement('a');

			//noteOrCourse will be false for a note and true for a course
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